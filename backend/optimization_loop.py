"""
Hierarchical multi-agent optimization loop with iterative refinement.
RL-Controlled Agent Activation Version
"""

import asyncio
from typing import Dict, Any, List
import structlog
import numpy as np

from backend.agents import RuntimeAgent, MemoryAgent, ReadabilityAgent, CriticAgent
from backend.reward import compute_multi_objective_reward
from executor.sandbox import benchmark_code
from shared.sanitize import sanitize_code
from backend.rl_model import get_meta_policy_action

logger = structlog.get_logger()


class OptimizationLoop:
    """Hierarchical optimization loop with RL-controlled multi-agent coordination."""

    def __init__(self):
        self.runtime_agent = RuntimeAgent()
        self.memory_agent = MemoryAgent()
        self.readability_agent = ReadabilityAgent()
        self.critic_agent = CriticAgent()

    async def optimize(
        self,
        code: str,
        max_refinements: int = 3,
        runtime_preference: float = 0.6,
        memory_preference: float = 0.25,
        quality_preference: float = 0.15,
        user_preferences: Dict[str, float] = None,
    ) -> Dict[str, Any]:

        # -----------------------
        # SANITIZE INPUT
        # -----------------------
        if not code or not code.strip():
            raise ValueError("Input code is empty")
        
        sanitized_code, warnings = sanitize_code(code)
        if not sanitized_code or not sanitized_code.strip():
            logger.error(f"Code sanitization failed. Original code length: {len(code)}, Sanitized length: {len(sanitized_code) if sanitized_code else 0}")
            logger.error(f"Original code preview: {code[:200] if code else 'None'}")
            raise ValueError(f"Code sanitization failed or empty. Warnings: {warnings}")

        # -----------------------
        # BASELINE BENCHMARK
        # -----------------------
        baseline_result = await benchmark_code(sanitized_code)

        if not baseline_result["success"]:
            logger.error("Baseline execution failed", error=baseline_result.get("error"), details=baseline_result)
            raise RuntimeError(f"Baseline execution failed — aborting optimization. Error: {baseline_result.get('error', 'Unknown error')}")
        
        baseline_runtime = baseline_result["runtime"]
        baseline_memory = baseline_result["memory"]

        # -----------------------
        # RL META POLICY
        # -----------------------
        try:
            from rl.services.state_encoder import encode_state

            state = encode_state(
                sanitized_code,
                baseline_runtime,
                baseline_memory,
            )

            meta_action = get_meta_policy_action(
                state,
                runtime_pref=runtime_preference,
                memory_pref=memory_preference,
                quality_pref=quality_preference,
                deterministic=True  # Use deterministic=True for inference (exploitation)
            )

            logger.info("RL meta-policy selected", meta_action=meta_action)

        except Exception as e:
            logger.warning(f"RL failed, using fallback: {e}")
            meta_action = {
                "selected_action": 0,
                "action_probabilities": [1.0, 0, 0, 0, 0, 0, 0],
                "entropy": 0.0,
                "confidence": 1.0,
                "refinement_depth": min(max_refinements, 2),
                "runtime_weight": runtime_preference,
                "memory_weight": memory_preference,
                "quality_weight": quality_preference,
                "strategy_mask": [1, 1, 1],
            }

        # Use user's max_refinements setting (from slider) - this controls optimization rounds
        refinement_depth = max_refinements

        runtime_weight = meta_action["runtime_weight"]
        memory_weight = meta_action["memory_weight"]
        quality_weight = meta_action["quality_weight"]
        strategy_mask = meta_action["strategy_mask"]
        selected_action = meta_action.get("selected_action", 0)
        
        # Prevent STOP action in first 2 rounds
        if selected_action == 6 and refinement_depth > 2:
            # Override to highest non-stop probability action
            action_probs = meta_action.get("action_probabilities", [0.14] * 7)
            # Set STOP probability to 0 and find max
            non_stop_probs = action_probs[:6]  # Actions 0-5
            if non_stop_probs:
                max_non_stop_idx = int(np.argmax(non_stop_probs))
                logger.warning(f"STOP action (6) prevented in early rounds, overriding to action {max_non_stop_idx} (prob={non_stop_probs[max_non_stop_idx]:.3f})")
                # Update strategy_mask based on new action
                strategy_masks = [
                    [1, 0, 0],  # Action 0
                    [0, 1, 0],  # Action 1
                    [1, 1, 0],  # Action 2
                    [1, 0, 1],  # Action 3
                    [0, 1, 1],  # Action 4
                    [1, 1, 1],  # Action 5
                ]
                if max_non_stop_idx < len(strategy_masks):
                    strategy_mask = strategy_masks[max_non_stop_idx]
                    selected_action = max_non_stop_idx

        # Detect memory-intensive code and force memory agent if needed
        # Check if baseline memory is high and user wants memory optimization
        is_memory_intensive = baseline_memory > 10.0  # More than 10MB baseline
        wants_memory_opt = memory_preference > 0.3  # User preference > 30%
        
        # If code is memory-intensive and user wants memory optimization,
        # but model selected action 0 (runtime only), override to include memory
        if is_memory_intensive and wants_memory_opt and strategy_mask == [1, 0, 0]:
            logger.info(f"Memory-intensive code detected (baseline_memory={baseline_memory:.2f}MB) with memory_preference={memory_preference:.2f} - forcing memory agent")
            strategy_mask = [1, 1, 0]  # Force both runtime and memory agents
            # Adjust weights to favor memory more
            memory_weight = max(memory_weight, memory_preference)
            total = runtime_weight + memory_weight + quality_weight
            if total > 0:
                runtime_weight /= total
                memory_weight /= total
                quality_weight /= total

        # Prevent STOP action (all zeros) on first optimization - force at least one agent
        if strategy_mask == [0, 0, 0] and refinement_depth > 0:
            logger.warning("RL selected STOP action - overriding to force at least one optimization attempt")
            strategy_mask = [1, 0, 0]  # Force runtime agent to ensure optimization happens

        # Normalize weights
        total = runtime_weight + memory_weight + quality_weight
        if total > 0:
            runtime_weight /= total
            memory_weight /= total
            quality_weight /= total

        # -----------------------
        # INIT STATE
        # -----------------------
        current_code = sanitized_code
        best_code = sanitized_code
        best_reward = -1.0
        best_strategy = "none"
        trace: List[Dict[str, Any]] = []
        # Track selected action from meta_action for diversity regularization
        selected_action = meta_action.get("selected_action", 0)
        episode_actions = [selected_action]  # Initialize with selected action

        # -----------------------
        # REFINEMENT LOOP
        # -----------------------
        for round_num in range(refinement_depth):
            logger.info(f"Optimization round {round_num+1}/{refinement_depth}")

            # Activate agents based on RL mask
            agents = []

            if strategy_mask[0] == 1:
                agents.append(("runtime", self.runtime_agent))
            if strategy_mask[1] == 1:
                agents.append(("memory", self.memory_agent))
            if strategy_mask[2] == 1:
                agents.append(("readability", self.readability_agent))

            # If RL selected STOP (all zeros), force at least one agent to run
            # This prevents the system from doing nothing when the model is too conservative
            if not agents:
                logger.warning("RL selected STOP — forcing runtime agent to ensure optimization happens.")
                agents.append(("runtime", self.runtime_agent))  # Force at least one optimization attempt

            tasks = [
                agent.generate_candidate(current_code, config={})
                for _, agent in agents
            ]

            candidates = await asyncio.gather(*tasks, return_exceptions=True)

            best_candidate = None
            best_candidate_reward = -1.0
            best_candidate_name = None
            best_candidate_result = None
            best_safety_status = "SAFE"

            for (name, _), candidate_code in zip(agents, candidates):

                if isinstance(candidate_code, Exception):
                    continue

                candidate_sanitized, sanitize_warnings = sanitize_code(candidate_code)
                if not candidate_sanitized:
                    logger.warning("Candidate sanitization failed", agent=name, warnings=sanitize_warnings)
                    continue

                candidate_result = await benchmark_code(candidate_sanitized)
                if not candidate_result["success"]:
                    logger.warning("Candidate execution failed", agent=name, error=candidate_result.get("error"), details=candidate_result)
                    continue

                critic_score, detailed_scores, safety_status = (
                    await self.critic_agent.score_candidate(
                        current_code,
                        candidate_sanitized,
                    )
                )

                # Calculate previous rewards for stability variance
                previous_rewards = [t.get("reward", 0) for t in trace] if trace else []

                reward_result = compute_multi_objective_reward(
                    baseline_runtime=baseline_runtime,
                    baseline_memory=baseline_memory,
                    opt_runtime=candidate_result["runtime"],
                    opt_memory=candidate_result["memory"],
                    critic_score=critic_score,
                    runtime_weight=runtime_weight,
                    memory_weight=memory_weight,
                    quality_weight=quality_weight,
                    baseline_code=current_code,
                    opt_code=candidate_sanitized,
                    test_pass_rate=candidate_result.get("test_pass_rate", 1.0),
                    safety_status=safety_status,
                    previous_rewards=previous_rewards,
                    episode_actions=episode_actions,  # Pass episode actions for diversity regularization
                )

                if reward_result["reward"] > best_candidate_reward:
                    best_candidate_reward = reward_result["reward"]
                    best_candidate = candidate_sanitized
                    best_candidate_name = name
                    best_candidate_result = candidate_result
                    best_safety_status = safety_status

            if best_candidate and best_candidate_reward > best_reward:
                best_reward = best_candidate_reward
                best_code = best_candidate
                best_strategy = best_candidate_name
                current_code = best_candidate
            elif not best_candidate:
                # If no candidates succeeded, log warning but continue
                logger.warning(f"No successful candidates in round {round_num + 1} - all failed execution or sanitization")

            # Get policy diagnostics for this round
            try:
                from rl.services.state_encoder import encode_state
                from backend.rl_model import _get_policy_distribution, _calculate_entropy
                
                current_state = encode_state(current_code, baseline_runtime, baseline_memory)
                probs = _get_policy_distribution(current_state)
                entropy = _calculate_entropy(probs)
                confidence = float(np.max(probs))
                selected_action = int(np.argmax(probs))
            except Exception as e:
                logger.warning(f"Policy diagnostics failed: {e}")
                probs = [0.14] * 7  # Uniform fallback
                entropy = 1.95
                confidence = 0.14
                selected_action = 0

            # Get reward decomposition
            reward_components = {}
            if best_candidate_result:
                # Calculate previous rewards for stability variance
                previous_rewards = [t.get("reward", 0) for t in trace] if trace else []
                
                reward_result = compute_multi_objective_reward(
                    baseline_runtime=baseline_runtime,
                    baseline_memory=baseline_memory,
                    opt_runtime=best_candidate_result["runtime"],
                    opt_memory=best_candidate_result["memory"],
                    critic_score=critic_score if 'critic_score' in locals() else 0.5,
                    runtime_weight=runtime_weight,
                    memory_weight=memory_weight,
                    quality_weight=quality_weight,
                    baseline_code=current_code,
                    opt_code=best_candidate or current_code,
                    test_pass_rate=best_candidate_result.get("test_pass_rate", 1.0),
                    safety_status=best_safety_status,
                    previous_rewards=previous_rewards,
                    episode_actions=episode_actions,  # Pass episode actions for diversity regularization
                )
                reward_components = reward_result.get("components", {})

            trace.append(
                {
                    "round": round_num + 1,
                    "strategy": best_candidate_name or "none",
                    "reward": best_candidate_reward,
                    "confidence": confidence,
                    "entropy": entropy,
                    "action_probabilities": probs.tolist() if isinstance(probs, np.ndarray) else probs,
                    "selected_action": selected_action,
                    "objective_weights": {
                        "runtime": runtime_weight,
                        "memory": memory_weight,
                        "quality": quality_weight,
                    },
                    "components": reward_components,
                    "runtime_improvement": (
                        ((baseline_runtime - best_candidate_result["runtime"]) / baseline_runtime * 100)
                        if best_candidate_result and baseline_runtime > 0
                        else 0
                    ),
                    "memory_improvement": (
                        ((baseline_memory - best_candidate_result["memory"]) / baseline_memory * 100)
                        if best_candidate_result and baseline_memory > 0
                        else 0
                    ),
                }
            )

        # -----------------------
        # FINAL BENCHMARK
        # -----------------------
        # If no optimization happened (best_code is still original), use baseline metrics
        if best_code == sanitized_code and best_reward <= -1.0:
            logger.warning("No successful optimization occurred - using baseline metrics")
            final_result = {
                "runtime": baseline_runtime,
                "memory": baseline_memory,
                "test_pass_rate": 1.0,  # Original code should pass tests
            }
            best_reward = 0.0  # Set to neutral reward if no optimization happened
        else:
            final_result = await benchmark_code(best_code)

            if not final_result["success"]:
                logger.warning("Final benchmark failed.")
                final_result = {
                    "runtime": baseline_runtime,
                    "memory": baseline_memory,
                    "test_pass_rate": 0.0,
                }

        runtime_improvement = (
            (baseline_runtime - final_result["runtime"])
            / baseline_runtime
            * 100
            if baseline_runtime > 0
            else 0
        )

        memory_improvement = (
            (baseline_memory - final_result["memory"])
            / baseline_memory
            * 100
            if baseline_memory > 0
            else 0
        )

        return {
            "optimized_code": best_code,
            "strategy": best_strategy,
            "strategy_label": best_strategy.title() + " Agent",
            "reward": best_reward,
            "trace": trace,
            "refinement_depth": refinement_depth,  # Actual refinement depth used
            "metrics": {
                "baseline_runtime": baseline_runtime,
                "baseline_memory": baseline_memory,
                "optimized_runtime": final_result["runtime"],
                "optimized_memory": final_result["memory"],
                "runtime_improvement_pct": runtime_improvement,
                "memory_improvement_pct": memory_improvement,
                "test_pass_rate": final_result.get("test_pass_rate", 1.0),
            },
            "objective_weights": {
                "runtime": runtime_weight,
                "memory": memory_weight,
                "quality": quality_weight,
            },
            "rl_meta_action": meta_action,   # 🔥 THIS IS IMPORTANT
            "warnings": warnings,
        }
