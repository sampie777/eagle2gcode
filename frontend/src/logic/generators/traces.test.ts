import { describe, expect, it } from "bun:test";
import { generateCopperFile, getBoardOutline } from "./traces";
import { emptyProject } from "../../gui/ProjectContext";
import { OutOfBoundsOption, TracesConfig } from "../types/gcode";

const baseTracesConfig: TracesConfig = {
  outOfBounds: OutOfBoundsOption.Hide,
  cutoutProfile: false,
  offsetX: 10,
  offsetY: 20,
  minFeedRate: 500,
  maxFeedRate: 2000,
  acceleration: 400,
  iterations: 40,
  brush: {
    enabled: false,
    posAx: 0,
    posAy: 0,
    posAz: 0,
    posBx: 0,
    posBy: 0,
    posBz: 0,
    distanceThreshold: 1000
  }
};

describe("Traces GCode Generator - Continuous Board Outline", () => {

  it("produces a single continuous rectangle without gaps when project.profile has multiple segments with gaps", () => {
    const project = emptyProject();
    // Two segments with a gap at the top and bottom (typical FlatCAM cutout with tabs)
    project.profile = [
      [
        { x: 25, y: 0, enabled: true },
        { x: 0, y: 0, enabled: true },
        { x: 0, y: 30, enabled: true },
        { x: 25, y: 30, enabled: true }
      ],
      [
        { x: 26, y: 30, enabled: true },
        { x: 50, y: 30, enabled: true },
        { x: 50, y: 0, enabled: true },
        { x: 26, y: 0, enabled: true }
      ]
    ];

    const outline = getBoardOutline(project);
    // Must be exactly one continuous outline
    expect(outline.length).toBe(1);
    expect(outline[0].length).toBe(5);

    // Bounding rectangle from (0, 0) to (50, 30)
    expect(outline[0][0]).toEqual({ x: 0, y: 0, enabled: true });
    expect(outline[0][1]).toEqual({ x: 50, y: 0, enabled: true });
    expect(outline[0][2]).toEqual({ x: 50, y: 30, enabled: true });
    expect(outline[0][3]).toEqual({ x: 0, y: 30, enabled: true });
    expect(outline[0][4]).toEqual({ x: 0, y: 0, enabled: true });
  });

  it("prioritizes project.profile over smaller/stale board.plain wires", () => {
    const project = emptyProject();
    // Stale plain wires from exampleProject (15.24 x 16.51)
    project.board.plain = [
      { layer: "20", x1: 0, y1: 0, x2: 15.24, y2: 0, width: 0, curve: null },
      { layer: "20", x1: 15.24, y1: 0, x2: 15.24, y2: 16.51, width: 0, curve: null },
      { layer: "20", x1: 15.24, y1: 16.51, x2: 0, y2: 16.51, width: 0, curve: null },
      { layer: "20", x1: 0, y1: 16.51, x2: 0, y2: 0, width: 0, curve: null },
    ];
    // Real board cutout profile (e.g. 77.1 x 28.5)
    project.profile = [
      [
        { x: 0, y: 0, enabled: true },
        { x: 77.1, y: 0, enabled: true },
        { x: 77.1, y: 28.5, enabled: true },
        { x: 0, y: 28.5, enabled: true },
      ]
    ];

    const outline = getBoardOutline(project);
    expect(outline.length).toBe(1);
    expect(outline[0][0]).toEqual({ x: 0, y: 0, enabled: true });
    expect(outline[0][1]).toEqual({ x: 77.1, y: 0, enabled: true });
    expect(outline[0][2]).toEqual({ x: 77.1, y: 28.5, enabled: true });
    expect(outline[0][3]).toEqual({ x: 0, y: 28.5, enabled: true });
    expect(outline[0][4]).toEqual({ x: 0, y: 0, enabled: true });
  });

  it("prioritizes active traces dimensions over smaller/stale board.plain wires when profile is absent", () => {
    const project = emptyProject();
    // Stale plain wires (15 x 15)
    project.board.plain = [
      { layer: "20", x1: 0, y1: 0, x2: 15, y2: 0, width: 0, curve: null },
      { layer: "20", x1: 15, y1: 0, x2: 15, y2: 15, width: 0, curve: null },
      { layer: "20", x1: 15, y1: 15, x2: 0, y2: 15, width: 0, curve: null },
      { layer: "20", x1: 0, y1: 15, x2: 0, y2: 0, width: 0, curve: null },
    ];
    // Active copper traces (80 x 50)
    project.traces_top = [
      [
        { x: 5, y: 5, enabled: true },
        { x: 85, y: 55, enabled: true },
      ]
    ];

    const outline = getBoardOutline(project);
    expect(outline.length).toBe(1);
    expect(outline[0][0]).toEqual({ x: 5, y: 5, enabled: true });
    expect(outline[0][1]).toEqual({ x: 85, y: 5, enabled: true });
    expect(outline[0][2]).toEqual({ x: 85, y: 55, enabled: true });
    expect(outline[0][3]).toEqual({ x: 5, y: 55, enabled: true });
    expect(outline[0][4]).toEqual({ x: 5, y: 5, enabled: true });
  });

  it("uses board.plain when board.plain actually encloses the traces", () => {
    const project = emptyProject();
    // Board outline (0, 0) to (100, 60)
    project.board.plain = [
      { layer: "20", x1: 0, y1: 0, x2: 100, y2: 0, width: 0, curve: null },
      { layer: "20", x1: 100, y1: 0, x2: 100, y2: 60, width: 0, curve: null },
      { layer: "20", x1: 100, y1: 60, x2: 0, y2: 60, width: 0, curve: null },
      { layer: "20", x1: 0, y1: 60, x2: 0, y2: 0, width: 0, curve: null },
    ];
    // Traces inside the board (10, 10) to (90, 50)
    project.traces_top = [
      [
        { x: 10, y: 10, enabled: true },
        { x: 90, y: 50, enabled: true },
      ]
    ];

    const outline = getBoardOutline(project);
    expect(outline.length).toBe(1);
    expect(outline[0][0]).toEqual({ x: 0, y: 0, enabled: true });
    expect(outline[0][1]).toEqual({ x: 100, y: 0, enabled: true });
    expect(outline[0][2]).toEqual({ x: 100, y: 60, enabled: true });
    expect(outline[0][3]).toEqual({ x: 0, y: 60, enabled: true });
    expect(outline[0][4]).toEqual({ x: 0, y: 0, enabled: true });
  });

  it("extracts a continuous rectangle from project.board.plain layer 20", () => {
    const project = emptyProject();
    project.board.plain = [
      { layer: "20", x1: 0, y1: 0, x2: 40, y2: 0, width: 0, curve: null },
      { layer: "20", x1: 40, y1: 0, x2: 40, y2: 25, width: 0, curve: null },
      { layer: "20", x1: 40, y1: 25, x2: 0, y2: 25, width: 0, curve: null },
      { layer: "20", x1: 0, y1: 25, x2: 0, y2: 0, width: 0, curve: null },
      { layer: "21", x1: 5, y1: 5, x2: 10, y2: 5, width: 0, curve: null }
    ];

    const outline = getBoardOutline(project);
    expect(outline.length).toBe(1);
    expect(outline[0].length).toBe(5);
    expect(outline[0][0]).toEqual({ x: 0, y: 0, enabled: true });
    expect(outline[0][1]).toEqual({ x: 40, y: 0, enabled: true });
    expect(outline[0][2]).toEqual({ x: 40, y: 25, enabled: true });
    expect(outline[0][3]).toEqual({ x: 0, y: 25, enabled: true });
    expect(outline[0][4]).toEqual({ x: 0, y: 0, enabled: true });
  });

  it("falls back to project bounding box rectangle when neither profile nor board wires exist", () => {
    const project = emptyProject();
    project.traces_top = [
      [
        { x: 5, y: 10, enabled: true },
        { x: 35, y: 40, enabled: true }
      ]
    ];

    const outline = getBoardOutline(project);
    expect(outline.length).toBe(1);
    expect(outline[0].length).toBe(5);
    expect(outline[0][0]).toEqual({ x: 5, y: 10, enabled: true });
    expect(outline[0][1]).toEqual({ x: 35, y: 10, enabled: true });
    expect(outline[0][2]).toEqual({ x: 35, y: 40, enabled: true });
    expect(outline[0][3]).toEqual({ x: 5, y: 40, enabled: true });
    expect(outline[0][4]).toEqual({ x: 5, y: 10, enabled: true });
  });

  it("draws the continuous rectangle 3 times with first 2 passes at Z1.0000 and third pass at Z0.0000 in generateCopperFile", () => {
    const project = emptyProject();
    // Segmented profile with tabs
    project.profile = [
      [
        { x: 10, y: 0, enabled: true },
        { x: 0, y: 0, enabled: true },
        { x: 0, y: 20, enabled: true },
        { x: 10, y: 20, enabled: true }
      ],
      [
        { x: 11, y: 20, enabled: true },
        { x: 20, y: 20, enabled: true },
        { x: 20, y: 0, enabled: true },
        { x: 11, y: 0, enabled: true }
      ]
    ];

    project.traces_top = [
      [
        { x: 5, y: 5, enabled: true },
        { x: 15, y: 15, enabled: true }
      ]
    ];

    const gcode = generateCopperFile(project, "top", baseTracesConfig);

    // 1. Check G-code contains outline check header (3 passes)
    expect(gcode).toContain("; --- BOARD OUTLINE CHECK (3 PASSES: 2x Z1.0mm, 1x Z0.0mm) ---");

    // 2. Extract the outline section
    const outlineHeaderIndex = gcode.indexOf("; --- BOARD OUTLINE CHECK (3 PASSES: 2x Z1.0mm, 1x Z0.0mm) ---");
    const traceStartIndex = gcode.indexOf("; No profile cutout");

    expect(outlineHeaderIndex).toBeGreaterThan(-1);
    expect(traceStartIndex).toBeGreaterThan(outlineHeaderIndex);

    const outlineSection = gcode.substring(outlineHeaderIndex, traceStartIndex);

    // 3. First two passes plunge to Z1.0000, third pass plunges down to Z0.0000, then 1 retract to Z3.0000
    const plungeZ1Count = outlineSection.split("G01 Z1.0000").length - 1;
    const plungeZ0Count = outlineSection.split("G01 Z0.0000").length - 1;
    const retractCount = outlineSection.split("G00 Z3.0000").length - 1;

    expect(plungeZ1Count).toBe(1);
    expect(plungeZ0Count).toBe(1);
    expect(retractCount).toBe(1);

    // Ensure Z1.0000 happens before Z0.0000
    expect(outlineSection.indexOf("G01 Z1.0000")).toBeLessThan(outlineSection.indexOf("G01 Z0.0000"));

    // 4. Each corner of the rectangle is visited exactly 3 times (3 iterations: 2 at Z1mm, 1 at Z0mm)
    const cornerX = (20 + baseTracesConfig.offsetX).toFixed(4); // 30.0000
    const cornerY = (20 + baseTracesConfig.offsetY).toFixed(4); // 40.0000
    const cornerVisits = outlineSection.split(`X${cornerX} Y${cornerY}`).length - 1;
    expect(cornerVisits).toBe(3);
  });

  it("mirrors continuous rectangle properly for bottom side traces", () => {
    const project = emptyProject();
    project.profile = [
      [
        { x: 0, y: 0, enabled: true },
        { x: 30, y: 20, enabled: true }
      ]
    ];
    project.traces_bottom = [
      [
        { x: 10, y: 10, enabled: true },
        { x: 20, y: 10, enabled: true }
      ]
    ];

    const gcode = generateCopperFile(project, "bottom", baseTracesConfig);
    expect(gcode).toContain("; --- BOARD OUTLINE CHECK (3 PASSES: 2x Z1.0mm, 1x Z0.0mm) ---");

    // Top-right and bottom-left mirrored
    expect(gcode).toContain("X40.0000");
    expect(gcode).toContain("X10.0000");
  });
});
