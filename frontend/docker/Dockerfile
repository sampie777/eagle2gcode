# Multi-stage Dockerfile
# Stage 1: Build frontend
FROM oven/bun:1 AS frontend-build

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Runtime with Nginx + FlatCAM Evo Headless + Bun Server
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PORT=3001 \
    DIST_DIR=/usr/share/nginx/html \
    FLATCAM_BIN=/opt/flatcam/flatcam.py \
    PYTHON_BIN=python3

# Install system dependencies including Nginx (from nginx.org), Tcl/Tk, OpenGL runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg2 \
    ca-certificates \
    git \
    tcl-dev \
    tk-dev \
    python3-tk \
    libgl1 \
    libgles2 \
    libglx-mesa0 \
    libgl1-mesa-dri \
    && curl -fsSL https://nginx.org/keys/nginx_signing.key | gpg --dearmor -o /usr/share/keyrings/nginx-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/debian bookworm nginx" > /etc/apt/sources.list.d/nginx.list \
    && apt-get update && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*

# Install Bun binary from oven/bun image
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun

# Clone FlatCAM_Evo headless branch dynamically on build
RUN git clone --depth 1 -b headless-no-gui https://github.com/sampie777/FlatCAM_Evo.git /opt/flatcam

# Install Python dependencies for FlatCAM Evo
WORKDIR /opt/flatcam
RUN sed -i -E '/^gdal/d' requirements.txt && \
    pip install --no-cache-dir --break-system-packages -r requirements.txt vispy pyopengl freetype-py

# Copy frontend static build to nginx html dir
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Setup Nginx configuration
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# Setup Bun backend app
WORKDIR /app
COPY package.json bun.lockb /app/
COPY server /app/server
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 80

CMD ["/app/entrypoint.sh"]
