import { describe, expect, it } from "bun:test";
import { executeFlatcam } from "./runner";
import * as fs from "fs";
import * as path from "path";

describe("FlatCAM Runner Backend", () => {
  it.skipIf(!fs.existsSync(process.env.FLATCAM_BIN || "/opt/flatcam/flatcam.py"))("processes Gerber profile and generates G-code via executeFlatcam", async () => {
    const profilePath = path.resolve(__dirname, "../../data/tutorial1/Project Outputs for tutorial1/PCB1_Profile.gbr");
    const profileContent = fs.readFileSync(profilePath, "utf-8");

    const result = await executeFlatcam({
      files: [
        { filename: "PCB1_Profile.gbr", content: profileContent }
      ],
      cadType: "altium",
      pcbName: "PCB1",
      diaWidth: 0.20188
    });

    expect(result.success).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
    const profileOutput = result.outputs.find(o => o.name === "traces_profile.gcode");
    expect(profileOutput).toBeDefined();
    expect(profileOutput!.content).toContain("G00");
  });
});
