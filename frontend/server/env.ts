import { existsSync } from "fs";
import * as path from "path";

export interface ServerEnv {
  PORT: number;
  DIST_DIR: string;
  FLATCAM_BIN: string;
  PYTHON_BIN: string;
}

export function isEnvSet(
  key: keyof ServerEnv,
  source: Record<string, string | undefined> = process.env
): boolean {
  return source[key] !== undefined && source[key] !== "";
}

export function loadEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  const parsedPort = parseInt(source.PORT || "3001", 10);

  return {
    PORT: Number.isNaN(parsedPort) ? 3001 : parsedPort,
    DIST_DIR: source.DIST_DIR || path.resolve(__dirname, "../dist"),
    FLATCAM_BIN:
      source.FLATCAM_BIN ||
      (existsSync("/opt/flatcam/flatcam.py")
        ? "/opt/flatcam/flatcam.py"
        : "/Users/samuel/workspace/python/FlatCAM_Evo/flatcam.py"),
    PYTHON_BIN:
      source.PYTHON_BIN ||
      (existsSync("/opt/flatcam/.venv/bin/python")
        ? "/opt/flatcam/.venv/bin/python"
        : "python3"),
  };
}

export const env: ServerEnv = loadEnv();

export function logEnv(
  currentEnv: ServerEnv = env,
  source: Record<string, string | undefined> = process.env
): void {
  console.log("Server environment variables:");
  for (const [key, value] of Object.entries(currentEnv)) {
    const origin = isEnvSet(key as keyof ServerEnv, source) ? "env" : "default";
    console.log(`  ${key}=${value} (${origin})`);
  }
}
