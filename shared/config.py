"""Shared configuration constants."""

# Server configuration
BACKEND_PORT = 8000  # Dedicated port for backend server
FRONTEND_PORT = 3000  # Dedicated port for frontend server

# Code limits
MAX_CODE_LENGTH = 300  # lines
MAX_CODE_SIZE = 10000  # characters

# LLM limits
MAX_TOKENS = 500
TEMPERATURE = 0.2

# Execution limits
EXECUTION_TIMEOUT = 15  # seconds
MAX_MEMORY_MB = 512

# Rate limiting
DAILY_REQUEST_LIMIT = 5

# RL training
MAX_REFINEMENT_STEPS = 3
TRAINING_MODE = False  # Set to True for training (simulated rewards), False for inference (real LLM calls)

# Reward weights
REWARD_WEIGHTS = {
    'runtime': 0.6,
    'memory': 0.25,
    'test_pass': 0.2,
    'code_length': -0.1,
    'complexity': -0.05,
}

