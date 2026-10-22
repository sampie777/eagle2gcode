import { describe, expect, it } from "bun:test";
import { Flatcam } from "./flatcam";

describe("Flatcam command generator", () => {
  it("resolves Eagle CAM directory correctly", () => {
    expect(Flatcam.resolveEagleCamDirectory("C:\\Users\\test\\project"))
      .toBe("C:/Users/test/project/CAMOutputs");
    expect(Flatcam.resolveEagleCamDirectory("C:/Users/test/project/"))
      .toBe("C:/Users/test/project/CAMOutputs");
    expect(Flatcam.resolveEagleCamDirectory("C:/Users/test/project/CAMOutputs"))
      .toBe("C:/Users/test/project/CAMOutputs");
  });

  it("resolves Altium output directory correctly", () => {
    expect(Flatcam.resolveAltiumCamDirectory("C:\\Projects\\tutorial1"))
      .toBe("C:/Projects/tutorial1/Project Outputs for tutorial1");
    expect(Flatcam.resolveAltiumCamDirectory("C:/Projects/tutorial1/"))
      .toBe("C:/Projects/tutorial1/Project Outputs for tutorial1");
    expect(Flatcam.resolveAltiumCamDirectory("C:/Projects/tutorial1/Project Outputs for tutorial1"))
      .toBe("C:/Projects/tutorial1/Project Outputs for tutorial1");
    expect(Flatcam.resolveAltiumCamDirectory("")).toBe("");
  });

  it("generates Eagle FlatCAM commands with expected files", () => {
    const commands = Flatcam.generateEagleCommands("/path/to/eagle", 0.20188);
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/profile.gbr" -outname profile');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/copper_top.gbr" -outname copper_top.gbr');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/copper_bottom.gbr" -outname copper_bottom.gbr');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/silkscreen_top.gbr" -follow 1 -outname silkscreen_top');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/silkscreen_bottom.gbr" -follow 1 -outname silkscreen_bottom');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/soldermask_top.gbr" -outname soldermask_top.gbr');
    expect(commands).toContain('open_gerber "/path/to/eagle/CAMOutputs/GerberFiles/soldermask_bottom.gbr" -outname soldermask_bottom.gbr');
    expect(commands).toContain('write_gcode profile_cutout_cnc "/path/to/eagle/CAMOutputs/traces_profile.gcode"');
    expect(commands).toContain('write_gcode copper_top.gbr.iso_cnc "/path/to/eagle/CAMOutputs/traces_top.gcode"');
    expect(commands).toContain('isolate copper_top.gbr -dia 0.20188 -passes 1 -overlap 1 -combine 1 -outname copper_top.gbr.iso');
  });

  it("generates Altium FlatCAM commands with expected files and prefix", () => {
    const commands = Flatcam.generateAltiumCommands("/path/to/tutorial1", 0.20188, "PCB1");
    const expectedDir = "/path/to/tutorial1/Project Outputs for tutorial1";
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Profile.gbr" -outname profile`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Copper_Signal_Top.gbr" -outname copper_top`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Copper_Signal_Bot.gbr" -outname copper_bottom`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Legend_Top.gbr" -follow 1 -outname silkscreen_top`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Legend_Bot.gbr" -follow 1 -outname silkscreen_bottom`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Soldermask_Top.gbr" -outname soldermask_top`);
    expect(commands).toContain(`open_gerber "${expectedDir}/PCB1_Soldermask_Bot.gbr" -outname soldermask_bottom`);
    expect(commands).toContain(`write_gcode profile_cutout_cnc "${expectedDir}/traces_profile.gcode"`);
    expect(commands).toContain(`write_gcode copper_top.iso_cnc "${expectedDir}/traces_top.gcode"`);
    expect(commands).toContain(`isolate copper_top -dia 0.20188 -passes 1 -overlap 1 -combine 1 -outname copper_top.iso`);
  });

  it("generates Altium FlatCAM commands without prefix if pcbName is empty", () => {
    const commands = Flatcam.generateAltiumCommands("/path/to/tutorial1", 0.20188, "");
    const expectedDir = "/path/to/tutorial1/Project Outputs for tutorial1";
    expect(commands).toContain(`open_gerber "${expectedDir}/Profile.gbr" -outname profile`);
    expect(commands).toContain(`open_gerber "${expectedDir}/Copper_Signal_Top.gbr" -outname copper_top`);
  });

  it("supports generateCommands polymorphic calls", () => {
    const eagleLegacy = Flatcam.generateCommands("/eagle/path", 0.2);
    expect(eagleLegacy).toContain('/eagle/path/CAMOutputs/GerberFiles/profile.gbr');

    const eagleExplicit = Flatcam.generateCommands("eagle", "/eagle/path", 0.2);
    expect(eagleExplicit).toContain('/eagle/path/CAMOutputs/GerberFiles/profile.gbr');

    const altiumExplicit = Flatcam.generateCommands("altium", "/altium/path", 0.2, "PCB2");
    expect(altiumExplicit).toContain('/altium/path/Project Outputs for path/PCB2_Profile.gbr');
  });
});
