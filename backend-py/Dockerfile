# ═══════════════════════════════════════════════════════════════
# Qurate Backend — Dockerfile
# ═══════════════════════════════════════════════════════════════

FROM python:3.12-slim

WORKDIR /app

# Runtime lib for psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY src/         ./src/
COPY agents/      ./agents/
COPY decorators/  ./decorators/
COPY models/      ./models/
COPY db/          ./db/
COPY redisdb/     ./redisdb/
COPY postgresdb/  ./postgresdb/
COPY utils/       ./utils/

# Cloud Run / Railway / Render inject PORT; default to 1008
ENV PORT=1008

EXPOSE ${PORT}

# Run with uvicorn
CMD ["sh", "-c", "uvicorn src.main:server --host 0.0.0.0 --port ${PORT}"]
