"""
Multi-objective reward engine for hierarchical optimization.
"""

from typing import Dict, Any
import structlog

logger = structlog.get_logger()

def compute_multi_objective_reward(
    baseline_runtime: float,
    baseline_memory: float,
    opt_runtime: float,
    opt_memory: float,
    critic_score: float,
    runtime_weight: float = 0.6,
    memory_weight: float = 0.25,
    quality_weight: float = 0.15,
    baseline_code: str = "",
    opt_code: str = "",
    test_pass_rate: float = 1.0,
    safety_status: str = "SAFE",
    previous_rewards: list = None,
    episode_actions: list = None  # Track actions for diversity regularization
) -> Dict[str, Any]:
    """
    Compute multi-objective reward with weighted objectives.
    
    Args:
        baseline_runtime: Original runtime in seconds
        baseline_memory: Original memory in MB
        opt_runtime: Optimized runtime in seconds
        opt_memory: Optimized memory in MB
        critic_score: Quality score from critic (0-1)
        runtime_weight: Weight for runtime objective (default 0.6)
        memory_weight: Weight for memory objective (default 0.25)
        quality_weight: Weight for quality objective (default 0.15)
        baseline_code: Original code (for length penalty)
        opt_code: Optimized code (for length penalty)
        test_pass_rate: Test pass rate (0-1)
    
    Returns:
        Dict with:
        - reward: Overall reward (-1 to 1)
        - runtime_gain: Normalized runtime improvement (-1 to 1)
        - memory_gain: Normalized memory improvement (-1 to 1)
        - quality_score: Critic quality score (0-1)
        - components: Breakdown of reward components
    """
    # Normalize runtime improvement (-1 to 1)
    if baseline_runtime > 0:
        runtime_gain = (baseline_runtime - opt_runtime) / baseline_runtime
        runtime_gain = max(-1.0, min(1.0, runtime_gain))  # Clip to [-1, 1]
    else:
        runtime_gain = 0.0
    
    # Normalize memory improvement (-1 to 1)
    if baseline_memory > 0:
        memory_gain = (baseline_memory - opt_memory) / baseline_memory
        memory_gain = max(-1.0, min(1.0, memory_gain))  # Clip to [-1, 1]
    else:
        memory_gain = 0.0
    
    # Normalize quality score (already 0-1, but ensure it's in range)
    quality_score = max(0.0, min(1.0, critic_score))
    
    # Code length penalty (negative if code gets longer)
    baseline_lines = len(baseline_code.split('\n')) if baseline_code else 0
    opt_lines = len(opt_code.split('\n')) if opt_code else 0
    if baseline_lines > 0:
        length_penalty = (opt_lines - baseline_lines) / baseline_lines
    else:
        length_penalty = 0.0
    
    # Safety penalty (negative if code is unsafe)
    safety_penalty = 0.0
    if safety_status and "UNSAFE" in safety_status.upper():
        safety_penalty = -0.15  # Penalty for unsafe code
    
    # Stability variance (penalty for high variance in rewards across rounds)
    stability_variance = 0.0
    if previous_rewards and len(previous_rewards) > 1:
        import numpy as np
        try:
            reward_array = np.array(previous_rewards)
            variance = np.var(reward_array)
            # Normalize variance (penalty increases with variance)
            stability_variance = min(variance * 0.5, 0.1)  # Cap at 0.1
        except:
            stability_variance = 0.0
    
    # Normalize weights (ensure they sum to 1.0)
    total_weight = runtime_weight + memory_weight + quality_weight
    if total_weight > 0:
        runtime_weight /= total_weight
        memory_weight /= total_weight
        quality_weight /= total_weight
    else:
        # Default weights if all zero
        runtime_weight = 0.6
        memory_weight = 0.25
        quality_weight = 0.15
    
    # Compute weighted reward with exploration bonus
    # Reward exploration: small bonus for attempting optimization (not for STOP action)
    # Extract action from episode_actions if available
    last_action = episode_actions[-1] if episode_actions and len(episode_actions) > 0 else None
    exploration_bonus = 0.05 if last_action is not None and last_action != 6 else 0.0
    
    # Cap runtime dominance: scale runtime contribution down to prevent dominance
    runtime_component = runtime_weight * runtime_gain * 0.7  # Scale down runtime by 30%
    memory_component = memory_weight * memory_gain  # Memory unchanged
    quality_component = quality_weight * quality_score  # Quality unchanged
    
    # Action diversity regularization: penalize if one action exceeds 50% usage
    diversity_penalty = 0.0
    if episode_actions and len(episode_actions) > 1:
        from collections import Counter
        action_counts = Counter(episode_actions)
        max_action_freq = max(action_counts.values()) / len(episode_actions)
        if max_action_freq > 0.5:  # If one action exceeds 50% usage
            diversity_penalty = 0.05  # Penalize action dominance
            logger.debug(f"Action diversity penalty applied: max_action_freq={max_action_freq:.2f}")
    
    # Compute weighted reward
    reward = (
        runtime_component +  # Capped runtime component
        memory_component +  # Memory component
        quality_component +  # Quality component
        0.2 * test_pass_rate +  # Test pass bonus
        exploration_bonus +  # Exploration bonus - reward effort
        safety_penalty -  # Safety penalty
        0.05 * abs(length_penalty) -  # Reduced length penalty (was 0.1)
        stability_variance -  # Stability variance penalty
        diversity_penalty  # Action diversity penalty
    )
    
    # Clip to [-1, 1] - explicit reward floor clipping
    reward = max(-1.0, min(1.0, reward))
    
    return {
        "reward": reward,
        "runtime_gain": runtime_gain,
        "memory_gain": memory_gain,
        "quality_score": quality_score,
        "test_pass_rate": test_pass_rate,
        "length_penalty": length_penalty,
        "safety_penalty": safety_penalty,
        "stability_variance": stability_variance,
        "components": {
            "runtime_component": runtime_component,  # Capped runtime component
            "memory_component": memory_component,
            "quality_component": quality_component,
            "test_bonus": 0.2 * test_pass_rate,
            "length_penalty": -0.05 * abs(length_penalty),
            "safety_penalty": safety_penalty,
            "stability_variance": stability_variance,
            "diversity_penalty": diversity_penalty
        },
        "weights": {
            "runtime": runtime_weight,
            "memory": memory_weight,
            "quality": quality_weight
        }
    }

