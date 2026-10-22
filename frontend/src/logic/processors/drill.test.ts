import { describe, expect, it } from "bun:test";
import { processDrillFile, processExcellonDrillFile } from "./drill";
import { Upload } from "../upload";
import { Project } from "../types/project";
import { emptyProject } from "../../gui/ProjectContext";

describe("Drill processor", () => {
  it("processes Excellon format drill file", () => {
    const excellon = `
M48
METRIC,TZ,000.000
T1C0.800
T2C1.200
%
G90
T1
X10000Y20000
T2
X30000Y40000
M30
`;
    const drills = processExcellonDrillFile(excellon);
    expect(drills).toHaveLength(2);
    expect(drills[0].x).toBeCloseTo(10, 4);
    expect(drills[0].y).toBeCloseTo(20, 4);
    expect(drills[0].size).toBeCloseTo(0.8, 4);

    expect(drills[1].x).toBeCloseTo(30, 4);
    expect(drills[1].y).toBeCloseTo(40, 4);
    expect(drills[1].size).toBeCloseTo(1.2, 4);
  });

  it("processes Altium Gerber PTH Drill file (PCB1_PTH_Drill.gbr)", () => {
    const gerberPth = `%TF.GenerationSoftware,Altium Limited,Altium Designer,22.2.1 (43)*%
G04 Layer_Color=0*
%FSLAX45Y45*%
%MOMM*%
%TF.FileFunction,Plated,1,2,PTH,Drill*%
G01*
G75*
%TA.AperFunction,ViaDrill,NotFilled*%
%ADD26C,0.71120*%
D26*
X1600200Y279400D02*
D03*
X762000Y787400D02*
D03*
X2108200Y558800D02*
D03*
M02*`;

    const drills = processDrillFile(gerberPth);
    expect(drills).toHaveLength(3);
    // X1600200 with FSLAX45 (5 decimals) in MM -> 16.00200 mm
    // Y279400 -> 2.79400 mm
    expect(drills[0].x).toBeCloseTo(16.002, 3);
    expect(drills[0].y).toBeCloseTo(2.794, 3);
    expect(drills[0].size).toBeCloseTo(0.7112, 4);

    expect(drills[1].x).toBeCloseTo(7.620, 3);
    expect(drills[1].y).toBeCloseTo(7.874, 3);

    expect(drills[2].x).toBeCloseTo(21.082, 3);
    expect(drills[2].y).toBeCloseTo(5.588, 3);
  });

  it("handles empty NPTH Gerber Drill file without errors", () => {
    const gerberNpth = `%TF.GenerationSoftware,Altium Limited,Altium Designer,22.2.1 (43)*%
G04 Layer_Color=0*
%FSLAX45Y45*%
%MOMM*%
%TF.FileFunction,NonPlated,1,2,NPTH,Drill*%
G01*
G75*
M02*`;

    const drills = processDrillFile(gerberNpth);
    expect(drills).toHaveLength(0);
  });

  it("matches both Eagle .xln and Altium _PTH/_NPTH drill file names in Upload.fileMatchers", () => {
    expect("drill_1_16.xln").toMatch(Upload.fileMatchers.drill);
    expect("PCB1_PTH_Drill.gbr").toMatch(Upload.fileMatchers.drill);
    expect("PCB1_NPTH_Drill.gbr").toMatch(Upload.fileMatchers.drill);
    expect("MyBoard_PTH_Drill.gbr").toMatch(Upload.fileMatchers.drill);
    expect("something_else.gbr").not.toMatch(Upload.fileMatchers.drill);
  });

  it("combines PTH and NPTH drill files without duplicates in Upload.processFile", () => {
    const project: Project = emptyProject();
    const pthContent = `%FSLAX45Y45*%
%MOMM*%
%ADD26C,0.71120*%
D26*
X1600200Y279400D02*
D03*`;
    const npthContent = `%FSLAX45Y45*%
%MOMM*%
%ADD28C,3.00000*%
D28*
X5000000Y5000000D02*
D03*`;

    Upload.processFile(project, "PCB1_PTH_Drill.gbr", pthContent);
    expect(project.drills).toHaveLength(1);

    Upload.processFile(project, "PCB1_NPTH_Drill.gbr", npthContent);
    expect(project.drills).toHaveLength(2);

    // Re-uploading PTH should not create duplicate holes
    Upload.processFile(project, "PCB1_PTH_Drill.gbr", pthContent);
    expect(project.drills).toHaveLength(2);
  });
});
