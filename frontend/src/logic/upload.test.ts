import { describe, expect, it } from "bun:test";
import { Upload } from "./upload";
import { Project } from "./types/project";
import { Flatcam } from "./flatcam";

describe("Upload logic - remove and reset files", () => {
  const createEmptyProject = (): Project => ({
    name: "test-project",
    path: "/test/path",
    isLoaded: true,
    profile: [],
    traces_top: [],
    traces_bottom: [],
    silkscreen_top: [],
    silkscreen_bottom: [],
    soldermask_top: [],
    soldermask_bottom: [],
    drills: [],
    board: {
      layers: [],
      libraries: [],
      plain: [],
      components: [],
      signals: [],
    },
  });

  const sampleGcode = `
    G00 Z1.0000
    G00 X0.0000 Y0.0000
    G01 Z-0.0500 F600
    G01 X10.0000 Y10.0000 F2700
    G00 Z1.0000
  `;

  const sampleDrill1 = `
    M48
    METRIC,TZ
    T01C0.8
    %
    T01
    X1000Y1000
    X2000Y2000
    M30
  `;

  const sampleDrill2 = `
    M48
    METRIC,TZ
    T02C1.2
    %
    T02
    X3000Y3000
    M30
  `;

  it("Upload.isProjectAvailable returns true when any layer has data", () => {
    const project = createEmptyProject();
    expect(Upload.isProjectAvailable(project)).toBe(false);

    Upload.processFile(project, Flatcam.TRACES_BOTTOM_OUTPUT_FILE, sampleGcode);
    expect(Upload.isProjectAvailable(project)).toBe(true);
    expect(project.traces_bottom.length).toBeGreaterThan(0);
  });

  it("Upload.clearProjectFiles resets all layers and isLoaded to false", () => {
    const project = createEmptyProject();
    Upload.processFile(project, Flatcam.TRACES_BOTTOM_OUTPUT_FILE, sampleGcode);
    Upload.processFile(project, "drill_1_16.xln", sampleDrill1);
    expect(project.traces_bottom.length).toBeGreaterThan(0);
    expect(project.drills.length).toBeGreaterThan(0);

    Upload.clearProjectFiles(project);

    expect(project.traces_bottom).toEqual([]);
    expect(project.drills).toEqual([]);
    expect(project.profile).toEqual([]);
    expect(project.isLoaded).toBe(false);
    expect(Upload.isProjectAvailable(project)).toBe(false);
  });

  it("Upload.removeFileType clears the specified layer", () => {
    const project = createEmptyProject();
    Upload.processFile(project, Flatcam.TRACES_BOTTOM_OUTPUT_FILE, sampleGcode);
    Upload.processFile(project, "drill_1_16.xln", sampleDrill1);

    expect(project.traces_bottom.length).toBeGreaterThan(0);
    expect(project.drills.length).toBe(2);

    Upload.removeFileType(project, "traces_bottom");
    expect(project.traces_bottom).toEqual([]);
    expect(project.drills.length).toBe(2);
    expect(Upload.isProjectAvailable(project)).toBe(true);

    Upload.removeFileType(project, "drill");
    expect(project.drills).toEqual([]);
    expect(Upload.isProjectAvailable(project)).toBe(false);
    expect(project.isLoaded).toBe(false);
  });

  it("Upload.removeFile recalculates multi-file drill uploads correctly", () => {
    const project = createEmptyProject();

    const upload1: Upload.Type = {
      file: new File([], "drill_1_16.xln"),
      content: sampleDrill1,
      status: "done",
    };
    const upload2: Upload.Type = {
      file: new File([], "PCB1_PTH_Drill.gbr"),
      content: sampleDrill2,
      status: "done",
    };

    Upload.processFile(project, upload1.file.name, upload1.content!);
    Upload.processFile(project, upload2.file.name, upload2.content!);

    // drill1 had 2 points, drill2 had 1 point -> total 3 points
    expect(project.drills.length).toBe(3);

    // Remove first drill file, remaining uploads is [upload2]
    Upload.removeFile(project, upload1.file.name, [upload2]);

    expect(project.drills.length).toBe(1);
    expect(project.drills[0].size).toBeCloseTo(1.2, 2);

    // Remove remaining drill file
    Upload.removeFile(project, upload2.file.name, []);
    expect(project.drills.length).toBe(0);
    expect(project.isLoaded).toBe(false);
  });

  it("Upload.removeFile clears single trace file and updates isLoaded", () => {
    const project = createEmptyProject();
    Upload.processFile(project, Flatcam.TRACES_TOP_OUTPUT_FILE, sampleGcode);
    expect(project.traces_top.length).toBeGreaterThan(0);
    expect(Upload.isProjectAvailable(project)).toBe(true);

    Upload.removeFile(project, Flatcam.TRACES_TOP_OUTPUT_FILE, []);
    expect(project.traces_top).toEqual([]);
    expect(Upload.isProjectAvailable(project)).toBe(false);
    expect(project.isLoaded).toBe(false);
  });
});
