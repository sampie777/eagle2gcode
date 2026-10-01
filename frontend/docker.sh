#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

NAME="sajansen/eagle2gcode"
progname=$(basename "$0")

if [ ! -f "./package.json" ]; then
  echo "Error: package.json not found in $SCRIPT_DIR" >&2
  exit 1
fi

VERSION=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' ./package.json)
if [ -z "${VERSION:-}" ]; then
  echo "Error: Could not extract version from package.json" >&2
  exit 1
fi

function usage {
  cat << HEREDOC

     Usage: $progname <command>

     commands:
       run                  Run docker-compose
       build                Build a docker image
       push                 Push current docker image
       version              Print project version

     optional arguments:
       -h, --help           Show this help message and exit

HEREDOC
}

function checkDocker {
  if ! command -v docker > /dev/null 2>&1; then
    echo "Error: 'docker' command is not installed or not in PATH." >&2
    exit 1
  fi
  if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker and try again." >&2
    exit 1
  fi
}

function checkDockerfile {
  if [ ! -f "docker/Dockerfile" ]; then
    echo "Error: Dockerfile not found at docker/Dockerfile." >&2
    exit 1
  fi
}

function run {
  checkDocker
  if [ ! -f "docker/docker-compose.yaml" ]; then
    echo "Error: docker-compose.yaml not found at docker/docker-compose.yaml." >&2
    exit 1
  fi
  if command -v docker-compose > /dev/null 2>&1; then
    docker-compose -f docker/docker-compose.yaml up
  else
    docker compose -f docker/docker-compose.yaml up
  fi
}

function build {
  checkDocker
  checkDockerfile
  echo "==> Building docker image ${NAME}:${VERSION}..."
  docker build -t "${NAME}" --build-arg APP_VERSION="${VERSION}" --platform linux/amd64,linux/arm64 -f docker/Dockerfile .
  docker tag "${NAME}" "${NAME}:${VERSION}"
  echo "==> Successfully built ${NAME}:${VERSION}"
}

function push {
  checkDocker
  if ! docker image inspect "${NAME}:${VERSION}" > /dev/null 2>&1; then
    echo "Error: Local image '${NAME}:${VERSION}' not found. Please run '$progname build' first." >&2
    exit 1
  fi
  echo "==> Pushing docker image ${NAME}:${VERSION}..."
  docker push "${NAME}:${VERSION}"
  echo "==> Pushing docker image ${NAME} (latest)..."
  docker push "${NAME}"
  echo "==> Successfully pushed ${NAME}:${VERSION} and latest"
}

command="${1:-}"
case "$command" in
  run)
    run
    ;;
  build)
    build
    ;;
  push)
    push
    ;;
  version)
    echo "$VERSION"
    ;;
  -h|--help)
    usage
    ;;
  *)
    echo "Invalid command: '$command'" >&2
    usage
    exit 1
    ;;
esac
