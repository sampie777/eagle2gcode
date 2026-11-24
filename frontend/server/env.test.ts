import { describe, expect, it, spyOn } from "bun:test";
import * as path from "path";
import { isEnvSet, loadEnv, logEnv } from "./env";

describe("Server environment configuration (env.ts)", () => {
  it("reads explicitly provided environment variables", () => {
    const resolved = loadEnv({
      PORT: "8080",
      DIST_DIR: "/custom/dist",
      FLATCAM_BIN: "/custom/flatcam.py",
      PYTHON_BIN: "/custom/python3",
    });

    expect(resolved.PORT).toBe(8080);
    expect(resolved.DIST_DIR).toBe("/custom/dist");
    expect(resolved.FLATCAM_BIN).toBe("/custom/flatcam.py");
    expect(resolved.PYTHON_BIN).toBe("/custom/python3");
  });

  it("falls back to defaults when variables are missing or invalid", () => {
    const resolved = loadEnv({ PORT: "not-a-number" });

    expect(resolved.PORT).toBe(3001);
    expect(resolved.DIST_DIR).toBe(path.resolve(__dirname, "../dist"));
    expect(resolved.FLATCAM_BIN.length).toBeGreaterThan(0);
    expect(resolved.PYTHON_BIN.length).toBeGreaterThan(0);
  });

  it("correctly reports whether env keys are set", () => {
    const source = { PORT: "4000", DIST_DIR: "" };
    expect(isEnvSet("PORT", source)).toBe(true);
    expect(isEnvSet("DIST_DIR", source)).toBe(false);
    expect(isEnvSet("FLATCAM_BIN", source)).toBe(false);
  });

  it("logs all environment variables and their origin", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {});
    try {
      const source = { PORT: "4000", FLATCAM_BIN: "/opt/flatcam/flatcam.py" };
      const currentEnv = loadEnv(source);
      logEnv(currentEnv, source);

      const output = logSpy.mock.calls.map(args => args.join(" ")).join("\n");
      expect(output).toContain("PORT=4000 (env)");
      expect(output).toContain(`DIST_DIR=${currentEnv.DIST_DIR} (default)`);
      expect(output).toContain("FLATCAM_BIN=/opt/flatcam/flatcam.py (env)");
      expect(output).toContain(`PYTHON_BIN=${currentEnv.PYTHON_BIN} (default)`);
    } finally {
      logSpy.mockRestore();
    }
  });
});
