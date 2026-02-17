# Experiments

This directory contains training datasets and experiment results.

## Dataset Structure

Place your training code samples in `dataset/` as Python files (`.py`).

Example:
```
experiments/
├── dataset/
│   ├── sample_001.py
│   ├── sample_002.py
│   └── ...
├── results/
│   └── (training logs and metrics)
└── README.md
```

## Training

Run training from the `rl/` directory:

```bash
cd rl
python train.py
```

Training will:
- Load code samples from `experiments/dataset/`
- Train PPO model with specified hyperparameters
- Save checkpoints to `rl/checkpoints/`
- Log metrics to TensorBoard in `rl/logs/`

