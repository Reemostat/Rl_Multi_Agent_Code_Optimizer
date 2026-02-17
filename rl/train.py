"""
Train PPO agent for code optimization.
Real RL training loop using Stable-Baselines3.
"""

import sys
from pathlib import Path
import numpy as np

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.callbacks import CheckpointCallback
from stable_baselines3.common.monitor import Monitor
from rl.env import CodeOptimizationEnv


# Increased timesteps for better convergence
TOTAL_TIMESTEPS = 200000  # 200K steps for better training

LEARNING_RATE = 3e-4  # Keep at 3e-4 as requested
N_STEPS = 512  # Increased for better sample efficiency
BATCH_SIZE = 64
GAMMA = 0.99
GAE_LAMBDA = 0.95
CLIP_RANGE = 0.2
ENT_COEF = 0.05  # Entropy coefficient to prevent policy collapse and encourage exploration
NET_ARCH = [256, 256, 128]  # Larger network with 3 layers


def make_env():
    """
    Create environment instance.
    LLM calls + benchmarking happen inside env.step().
    """
    env = CodeOptimizationEnv()
    env = Monitor(env)
    return env


def train():
    print("Creating environment...")
    env = DummyVecEnv([make_env])

    print("Initializing PPO model...")

    model = PPO(
        policy="MlpPolicy",
        env=env,
        learning_rate=LEARNING_RATE,
        n_steps=N_STEPS,
        batch_size=BATCH_SIZE,
        gamma=GAMMA,
        gae_lambda=GAE_LAMBDA,
        clip_range=CLIP_RANGE,
        ent_coef=ENT_COEF,
        policy_kwargs={"net_arch": NET_ARCH},
        verbose=1,
        tensorboard_log="./logs"
    )

    checkpoint_dir = Path(__file__).parent / "checkpoints"
    checkpoint_dir.mkdir(exist_ok=True)

    checkpoint_callback = CheckpointCallback(
        save_freq=1000,
        save_path=str(checkpoint_dir),
        name_prefix="ppo_code_agent"
    )

    print(f"Training for {TOTAL_TIMESTEPS} timesteps...")
    
    # Custom callback to log action distribution
    from stable_baselines3.common.callbacks import BaseCallback
    from collections import Counter
    
    class ActionDistributionCallback(BaseCallback):
        def __init__(self, verbose=0):
            super().__init__(verbose)
            self.episode_actions = []
        
        def _on_step(self) -> bool:
            # Collect actions from rollout buffer
            if hasattr(self.locals, 'actions') and self.locals.get('actions') is not None:
                actions = self.locals['actions']
                if hasattr(actions, 'flatten'):
                    self.episode_actions.extend(actions.flatten().tolist())
                elif isinstance(actions, (list, np.ndarray)):
                    self.episode_actions.extend(np.array(actions).flatten().tolist())
            return True
        
        def _on_rollout_end(self) -> bool:
            if len(self.episode_actions) > 0:
                action_counts = Counter(self.episode_actions)
                total = len(self.episode_actions)
                print(f"\n{'='*60}")
                print("Action Distribution:")
                action_names = ["Algorithmic", "Memory", "In-place", "Recursion→Iter", "Vectorization", "Alternative", "Stop"]
                for action in range(7):
                    count = action_counts.get(action, 0)
                    pct = (count / total * 100) if total > 0 else 0
                    print(f"  Action {action} ({action_names[action]}): {count:4d} ({pct:5.1f}%)")
                
                max_pct = max((c / total * 100) for c in action_counts.values()) if total > 0 else 0
                print(f"  Max action frequency: {max_pct:.1f}%")
                if max_pct > 80:
                    print(f"  ⚠️  WARNING: Action dominance detected (>80%)")
                print(f"{'='*60}\n")
                
                self.episode_actions = []  # Reset for next rollout
            return True
    
    action_dist_callback = ActionDistributionCallback()
    
    model.learn(
        total_timesteps=TOTAL_TIMESTEPS,
        callback=[checkpoint_callback, action_dist_callback],
        progress_bar=True
    )

    final_model_path = checkpoint_dir / "ppo_code_agent"
    model.save(str(final_model_path))

    print(f"Training complete! Model saved to {final_model_path}.zip")


if __name__ == "__main__":
    train()
