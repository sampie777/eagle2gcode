import { describe, expect, it } from "bun:test";
import { getGcodeDurationForTraces } from "./gcode";
import { processTraces } from "../processors/traces";
import { emptyConfig } from "../../gui/ConfigContext";
import fs from "fs";
import path from "path";

describe("getGcodeDurationForTraces", () => {
  it("returns 0:00h for empty or invalid traces", () => {
    expect(getGcodeDurationForTraces([], { iterations: 30, minFeedRate: 600, maxFeedRate: 2700 })).toBe("0:00h");
    expect(getGcodeDurationForTraces([[]], { iterations: 30 })).toBe("0:00h");
    expect(getGcodeDurationForTraces([[{ x: 0, y: 0, enabled: false }]], { iterations: 10 })).toBe("0:00h");
    expect(getGcodeDurationForTraces([[{ x: 0, y: 0, enabled: true }, { x: 10, y: 10, enabled: true }]], { iterations: 0 })).toBe("0:00h");
  });

  it("accurately estimates homesensors bottom traces production time to 3:29h based on real machine benchmark", () => {
    const tracesBottomPath = path.resolve(__dirname, "../../../../data/homesensors/Project Outputs for homesensors/traces_bottom.gcode");
    const profilePath = path.resolve(__dirname, "../../../../data/homesensors/Project Outputs for homesensors/traces_profile.gcode");

    if (fs.existsSync(tracesBottomPath)) {
      const bottomTraces = processTraces(fs.readFileSync(tracesBottomPath, "utf8"));
      const profileTraces = fs.existsSync(profilePath) ? processTraces(fs.readFileSync(profilePath, "utf8")) : [];

      const config = emptyConfig().traces;
      config.brush.distanceThreshold = 2500;
      config.iterations = 30;
      config.minFeedRate = 600;
      config.maxFeedRate = 2700;
      config.acceleration = 500;
      config.cutoutProfile = true;

      const allBottomTraces = [...(config.cutoutProfile ? profileTraces : []), ...bottomTraces];
      const estimatedTime = getGcodeDurationForTraces(allBottomTraces, config);

      expect(estimatedTime).toBe("3:29h");
    }
  });

  it("handles legacy config format with feedRate and iterations", () => {
    const squareTrace = [
      { x: 0, y: 0, enabled: true },
      { x: 50, y: 0, enabled: true },
      { x: 50, y: 50, enabled: true },
      { x: 0, y: 50, enabled: true },
      { x: 0, y: 0, enabled: true }
    ];

    const result = getGcodeDurationForTraces([squareTrace], { iterations: 10, feedRate: 1500 });
    expect(result).toMatch(/^[0-9]+:[0-9]{2}h$/);
    expect(result).not.toBe("0:00h");
  });
});
