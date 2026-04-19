# ═══════════════════════════════════════════════════════════════
# Qurate Backend — Multi-stage Dockerfile
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Builder ──────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# System deps needed for building psycopg2, bcrypt, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a clean layer
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: Runtime ─────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Only the runtime libs needed by psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /install /usr/local

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

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT}/')" || exit 1

# Run with uvicorn — bind to 0.0.0.0 for container networking
CMD ["sh", "-c", "uvicorn src.main:server --host 0.0.0.0 --port ${PORT}"]
