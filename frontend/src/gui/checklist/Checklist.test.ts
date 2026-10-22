import { describe, expect, it } from "bun:test";
import { getAltiumChecklist, getChecklistForCad, getEagleChecklist } from "../ChecklistContext";

describe("Checklist", () => {
  it("provides Eagle checklist with Eagle-specific instructions", () => {
    const eagle = getEagleChecklist();
    const computerSection = eagle.find(g => g.title === "Computer");
    expect(computerSection).toBeDefined();
    const text = computerSection?.items.map(i => i.text).join(" ") ?? "";
    expect(text).toContain("ground planes in EAGLE");
    expect(text).toContain("Export EAGLE files using the CAM processor");
  });

  it("provides Altium checklist with mm unit requirement and Altium export steps", () => {
    const altium = getAltiumChecklist();
    const computerSection = altium.find(g => g.title === "Computer");
    expect(computerSection).toBeDefined();
    const text = computerSection?.items.map(i => i.text).join(" ") ?? "";
    expect(text).toContain("Altium Designer");
    expect(text).toContain("Millimeters (mm) instead of Inches");
    expect(text).toContain("Export Altium Gerber files");
    expect(text).toContain("Altium tab");
  });

  it("switches checklist based on CAD type", () => {
    const eagle = getChecklistForCad("eagle");
    const altium = getChecklistForCad("altium");
    expect(eagle[0].items[0].text).toContain("EAGLE");
    expect(altium[0].items[0].text).toContain("Altium");
  });
});
