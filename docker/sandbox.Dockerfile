FROM python:3.11-slim

WORKDIR /app

# Install minimal dependencies for code execution
RUN apt-get update && apt-get install -y \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy executor
COPY executor/ /app/executor/
COPY shared/ /app/shared/

# Set Python path
ENV PYTHONPATH=/app

# Run as non-root user for security
RUN useradd -m -u 1000 sandbox && chown -R sandbox:sandbox /app
USER sandbox

# This container would be used for isolated code execution
# In production, you'd run code in separate containers via API

