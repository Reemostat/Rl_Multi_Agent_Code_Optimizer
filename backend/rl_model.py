"""
RL model loading, inference, and policy diagnostics.
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
import numpy as np
import structlog
import torch

logger = structlog.get_logger()

_model = None
_model_path = None


# =========================
# MODEL LOADING
# =========================

def load_model(model_path: Optional[str] = None) -> bool:
    global _model, _model_path

    if _model is not None:
        return True

    if model_path is None:
        model_path = str(
            Path(__file__).parent.parent / "rl" / "checkpoints" / "ppo_code_agent.zip"
        )

    if not os.path.exists(model_path):
        logger.warning(f"Model not found at {model_path}, using fallback strategy")
        _model_path = None
        return False

    try:
        from stable_baselines3 import PPO
        _model = PPO.load(model_path)
        _model_path = model_path
        logger.info(f"PPO model loaded from {model_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to load PPO model: {e}")
        _model = None
        _model_path = None
        return False


# =========================
# POLICY DIAGNOSTICS
# =========================

def _get_policy_distribution(observation: np.ndarray):
    """
    Extract full action probability distribution from PPO policy.
    """

    obs_tensor = torch.tensor(observation, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        distribution = _model.policy.get_distribution(obs_tensor)
        probs = distribution.distribution.probs.cpu().numpy()[0]

    return probs


def _calculate_entropy(probs: np.ndarray) -> float:
    """
    Compute policy entropy (exploration measure).
    """
    eps = 1e-8
    entropy = -np.sum(probs * np.log(probs + eps))
    return float(entropy)


# =========================
# STRATEGY SELECTION
# =========================

def get_strategy(observation: np.ndarray, deterministic: bool = False) -> int:
    global _model

    if _model is None:
        load_model()

    if _model is None:
        return 0  # fallback

    observation = _prepare_observation(observation)

    action, _ = _model.predict(observation, deterministic=deterministic)
    action = int(action)
    action = max(0, min(6, action))

    return action


def get_meta_policy_action(
    observation: np.ndarray,
    runtime_pref: float = 0.6,
    memory_pref: float = 0.25,
    quality_pref: float = 0.15,
    deterministic: bool = True  # Default to True for inference (training uses False)
) -> Dict[str, Any]:

    global _model

    if _model is None:
        load_model()

    if _model is None:
        return _fallback_policy(runtime_pref, memory_pref, quality_pref)

    observation = _prepare_observation(observation)

    # Get probabilities
    probs = _get_policy_distribution(observation)

    # Selected action
    if deterministic:
        action = int(np.argmax(probs))
    else:
        action = int(np.random.choice(len(probs), p=probs))

    entropy = _calculate_entropy(probs)
    confidence = float(np.max(probs))

    # Structured mapping
    refinement_depths = [1, 2, 3, 3, 4, 5, 1]
    strategy_masks = [
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
    ]

    action_runtime_weight = 0.7 if action in [0, 2, 3, 5] else 0.3
    action_memory_weight = 0.7 if action in [1, 2, 4, 5] else 0.3
    action_quality_weight = 0.7 if action in [3, 4, 5] else 0.3

    runtime_weight = 0.7 * runtime_pref + 0.3 * action_runtime_weight
    memory_weight = 0.7 * memory_pref + 0.3 * action_memory_weight
    quality_weight = 0.7 * quality_pref + 0.3 * action_quality_weight

    total = runtime_weight + memory_weight + quality_weight
    runtime_weight /= total
    memory_weight /= total
    quality_weight /= total

    return {
        "selected_action": action,
        "action_probabilities": probs.tolist(),
        "entropy": entropy,
        "confidence": confidence,
        "refinement_depth": refinement_depths[action],
        "runtime_weight": runtime_weight,
        "memory_weight": memory_weight,
        "quality_weight": quality_weight,
        "strategy_mask": strategy_masks[action],
        "model_path": _model_path
    }


# =========================
# HELPERS
# =========================

def _prepare_observation(observation):
    if isinstance(observation, list):
        observation = np.array(observation, dtype=np.float32)

    # Support both 32-dim (old) and 64-dim (new) observations
    target_dim = 64
    if observation.shape != (target_dim,):
        obs = np.zeros(target_dim, dtype=np.float32)
        min_len = min(len(observation), target_dim)
        obs[:min_len] = observation[:min_len]
        observation = obs

    return observation


def _fallback_policy(runtime_pref, memory_pref, quality_pref):
    return {
        "selected_action": 0,
        "action_probabilities": [1.0, 0, 0, 0, 0, 0, 0],
        "entropy": 0.0,
        "confidence": 1.0,
        "refinement_depth": 3,
        "runtime_weight": runtime_pref,
        "memory_weight": memory_pref,
        "quality_weight": quality_pref,
        "strategy_mask": [1, 1, 1],
        "model_path": None
    }


def is_model_loaded() -> bool:
    return _model is not None


# Load on import
load_model()
