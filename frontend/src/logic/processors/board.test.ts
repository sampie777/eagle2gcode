import { describe, expect, it } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import { Scene, Mesh } from "three";
import { processBoardFile } from "./board";
import { isAltiumBoardFile, processAltiumBoardFile } from "./altiumBoard";
import { processEagleBoardFile } from "./eagleBoard";
import { Upload } from "../upload";
import { drawBoard } from "../graphics/board";
import { Project } from "../types/project";
import { getProjectDimensions } from "./project";

if (typeof (globalThis as any).DOMParser === "undefined") {
  class MockElement {
    tagName: string;
    attrs: Record<string, string> = {};
    children: MockElement[] = [];
    textContent: string = "";

    constructor(tagName: string) {
      this.tagName = tagName;
    }

    getAttribute(name: string) {
      return this.attrs[name] ?? null;
    }

    getAttributeInt(name: string) {
      const v = this.getAttribute(name);
      return v == null ? null : +v;
    }

    getElementsByTagName(name: string): MockElement[] {
      const res: MockElement[] = [];
      for (const ch of this.children) {
        if (ch.tagName === name) res.push(ch);
        res.push(...ch.getElementsByTagName(name));
      }
      return res;
    }
  }

  class MockDOMParser {
    parseFromString(xml: string) {
      const root = new MockElement("document");
      const tagRegex = /<([a-zA-Z0-9_-]+)((?:\s+[a-zA-Z0-9_-]+="[^"]*")*)\s*(\/?)>|([^<]+)|<\/([a-zA-Z0-9_-]+)>/g;
      const stack: MockElement[] = [root];
      let m: RegExpExecArray | null;
      while ((m = tagRegex.exec(xml)) !== null) {
        const [_, openTag, attrsStr, selfClose, text, closeTag] = m;
        if (openTag) {
          const el = new MockElement(openTag);
          if (attrsStr) {
            const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
            let am: RegExpExecArray | null;
            while ((am = attrRegex.exec(attrsStr)) !== null) {
              el.attrs[am[1]] = am[2];
            }
          }
          stack[stack.length - 1].children.push(el);
          if (!selfClose) stack.push(el);
        } else if (text) {
          stack[stack.length - 1].textContent += text.trim();
        } else if (closeTag) {
          if (stack.length > 1 && stack[stack.length - 1].tagName === closeTag) {
            stack.pop();
          }
        }
      }
      return root as any;
    }
  }

  (globalThis as any).DOMParser = MockDOMParser;
}

describe("Board processor & 3D render", () => {
  const pcbDocPath = path.resolve(__dirname, "../../../../data/tutorial1/PCB1.PcbDoc");
  const pcbDocContent = fs.readFileSync(pcbDocPath, "utf-8");

  const eagleBrdPath = path.resolve(__dirname, "../../../../data/onechannelaudiomixer/design2.brd");
  const eagleBrdContent = fs.readFileSync(eagleBrdPath, "utf-8");

  it("detects Altium PcbDoc files correctly vs Eagle XML", () => {
    expect(isAltiumBoardFile(pcbDocContent)).toBe(true);
    expect(isAltiumBoardFile(eagleBrdContent)).toBe(false);
    expect(isAltiumBoardFile("<eagle version=\"9.6.2\"></eagle>")).toBe(false);
  });

  it("matches both .brd and .PcbDoc in fileMatchers.board", () => {
    expect(Upload.fileMatchers.board.test("test.brd")).toBe(true);
    expect(Upload.fileMatchers.board.test("project.BRD")).toBe(true);
    expect(Upload.fileMatchers.board.test("PCB1.PcbDoc")).toBe(true);
    expect(Upload.fileMatchers.board.test("board.pcbdoc")).toBe(true);
    expect(Upload.fileMatchers.board.test("PCB1_Profile.gbr")).toBe(false);
  });

  it("parses Eagle board via eagleBoard.ts and processBoardFile", () => {
    const eagleDirect = processEagleBoardFile(eagleBrdContent);
    const eagleViaRouter = processBoardFile(eagleBrdContent);

    expect(eagleDirect.plain.length).toBeGreaterThan(0);
    expect(eagleDirect.components.length).toBeGreaterThan(0);
    expect(eagleViaRouter.plain.length).toBe(eagleDirect.plain.length);
    expect(eagleViaRouter.components.length).toBe(eagleDirect.components.length);
  });

  it("parses Altium PCB1.PcbDoc outline into plain wires via altiumBoard.ts", () => {
    const board = processAltiumBoardFile(pcbDocContent);

    expect(board.plain.length).toBeGreaterThan(0);
    // Verify first and last wire form a closed contour
    const firstWire = board.plain[0];
    const lastWire = board.plain[board.plain.length - 1];
    expect(Math.abs(firstWire.x1 - lastWire.x2)).toBeLessThan(0.01);
    expect(Math.abs(firstWire.y1 - lastWire.y2)).toBeLessThan(0.01);

    // Verify board dimensions (~24.89 mm x ~12.7 mm)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const w of board.plain) {
      minX = Math.min(minX, w.x1, w.x2);
      maxX = Math.max(maxX, w.x1, w.x2);
      minY = Math.min(minY, w.y1, w.y2);
      maxY = Math.max(maxY, w.y1, w.y2);
    }
    const width = maxX - minX;
    const height = maxY - minY;
    expect(width).toBeCloseTo(24.892, 1);
    expect(height).toBeCloseTo(12.7, 1);
  });

  it("extracts all components with coordinates, rotation, and package definitions", () => {
    const board = processAltiumBoardFile(pcbDocContent);

    expect(board.components.length).toBe(5);
    const designators = board.components.map(c => c.name).sort();
    expect(designators).toEqual(["B1", "C1", "C2", "J1", "J2"]);

    // Verify specific component properties
    const j1 = board.components.find(c => c.name === "J1")!;
    expect(j1.package).toBe("JST SM02B-GHS-TB");
    expect(j1.rotation).toBeCloseTo(90 / 360, 2);
    expect(j1.x).toBeCloseTo(4.191, 1);
    expect(j1.y).toBeCloseTo(5.715, 1);

    const c2 = board.components.find(c => c.name === "C2")!;
    expect(c2.package).toBe("CAP 0805_2012");
    expect(c2.rotation).toBeCloseTo(90 / 360, 2);
    expect(c2.x).toBeCloseTo(16.002, 1);
    expect(c2.y).toBeCloseTo(5.588, 1);

    // Check libraries and packages
    expect(board.libraries.length).toBeGreaterThan(0);
    const altiumLib = board.libraries.find(l => l.name === "Altium")!;
    expect(altiumLib).toBeDefined();
    const pkgNames = altiumLib.packages.map(p => p.name);
    expect(pkgNames).toContain("JST SM02B-GHS-TB");
    expect(pkgNames).toContain("CAP 0805_2012");
    expect(pkgNames).toContain("SOT95P280X100-5N");

    // Check that packages contain pads and wires
    for (const pkg of altiumLib.packages) {
      expect(pkg.pads.length).toBeGreaterThan(0);
      expect(pkg.wires.length).toBeGreaterThan(0);
    }
  });

  it("calculates project dimensions from board outline when no traces exist", () => {
    const board = processAltiumBoardFile(pcbDocContent);
    const project: Project = {
      board,
      drills: [],
      profile: [],
      traces_top: [],
      traces_bottom: [],
      silkscreen_top: [],
      silkscreen_bottom: [],
      soldermask_top: [],
      soldermask_bottom: [],
    };

    const dims = getProjectDimensions(project);
    expect(dims.width).toBeCloseTo(24.892, 1);
    expect(dims.height).toBeCloseTo(12.7, 1);
  });

  it("successfully renders 3D board mesh in Three.js scene via drawBoard", () => {
    const board = processBoardFile(pcbDocContent);
    const drills = [
      { x: 16.002, y: 2.794, size: 0.7112 },
      { x: 7.620, y: 7.874, size: 0.7112 },
      { x: 21.082, y: 5.588, size: 0.7112 },
    ];

    const scene = new Scene();
    expect(scene.children.length).toBe(0);

    drawBoard(scene, board, drills, 1.0);

    // Should create meshes in scene (board substrate extrusion + components)
    expect(scene.children.length).toBeGreaterThan(0);
    const meshes = scene.children.filter(c => c instanceof Mesh);
    expect(meshes.length).toBeGreaterThan(0);
  });
});
