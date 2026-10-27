import { beforeEach, describe, expect, it } from "bun:test";
import { Persistency } from "./persistency";
import { emptyProject } from "../../gui/ProjectContext";
import { emptyConfig } from "../../gui/ConfigContext";
import { Checklist } from "../types/checklist";

describe("Persistency - Project and Checklist saving", () => {
  // Mock localStorage for test environment if not present
  const storageMap = new Map<string, string>();
  const mockLocalStorage = {
    getItem: (key: string) => storageMap.get(key) ?? null,
    setItem: (key: string, value: string) => storageMap.set(key, value),
    removeItem: (key: string) => storageMap.delete(key),
    clear: () => storageMap.clear(),
  };

  beforeEach(() => {
    storageMap.clear();
    (globalThis as any).localStorage = mockLocalStorage;
  });

  it("normalizes paths correctly across OS conventions and trailing slashes", () => {
    expect(Persistency.normalizePath("/Users/samuel/proj1/")).toBe("/users/samuel/proj1");
    expect(Persistency.normalizePath("C:\\Users\\samuel\\proj1")).toBe("c:/users/samuel/proj1");
    expect(Persistency.normalizePath("  /workspace/pcb  ")).toBe("/workspace/pcb");
  });

  it("extracts clean project name from path", () => {
    expect(Persistency.getProjectName("/Users/samuel/workspace/tutorial1")).toBe("tutorial1");
    expect(Persistency.getProjectName("C:\\PCB\\TestBoard\\")).toBe("TestBoard");
    expect(Persistency.getProjectName("")).toBe("Untitled Project");
  });

  it("saves a project and retrieves it in the saved list", () => {
    const project = { ...emptyProject(), path: "/path/to/first" };
    const config = emptyConfig();

    Persistency.saveProject(project, config);

    const saved = Persistency.getSavedProjects();
    expect(saved.length).toBe(1);
    expect(saved[0].path).toBe("/path/to/first");
    expect(saved[0].name).toBe("first");
  });

  it("overwrites existing project if saved with the same project path", () => {
    const project1 = { ...emptyProject(), path: "/path/to/my-board" };
    const config1 = emptyConfig();
    config1.traces.minFeedRate = 100;

    Persistency.saveProject(project1, config1);
    expect(Persistency.getSavedProjects().length).toBe(1);
    expect(Persistency.getSavedProjects()[0].config.traces.minFeedRate).toBe(100);

    // Save again with same path but modified config
    const config2 = emptyConfig();
    config2.traces.minFeedRate = 250;
    Persistency.saveProject(project1, config2);

    const saved = Persistency.getSavedProjects();
    // Must NOT add a new entry, must overwrite existing
    expect(saved.length).toBe(1);
    expect(saved[0].path).toBe("/path/to/my-board");
    expect(saved[0].config.traces.minFeedRate).toBe(250);
  });

  it("adds new entries for different project paths and keeps at most 5 projects", () => {
    const config = emptyConfig();

    // Save 6 different projects
    for (let i = 1; i <= 6; i++) {
      const proj = { ...emptyProject(), path: `/path/to/project-${i}` };
      Persistency.saveProject(proj, config);
    }

    const saved = Persistency.getSavedProjects();
    expect(saved.length).toBe(5);

    // Most recent (project-6) should be first
    expect(saved[0].path).toBe("/path/to/project-6");
    expect(saved[1].path).toBe("/path/to/project-5");
    expect(saved[2].path).toBe("/path/to/project-4");
    expect(saved[3].path).toBe("/path/to/project-3");
    expect(saved[4].path).toBe("/path/to/project-2");
    // project-1 should have been dropped
    expect(saved.some(p => p.path === "/path/to/project-1")).toBe(false);
  });

  it("brings updated project to the top when overwritten", () => {
    const config = emptyConfig();

    Persistency.saveProject({ ...emptyProject(), path: "/proj/a" }, config);
    Persistency.saveProject({ ...emptyProject(), path: "/proj/b" }, config);
    Persistency.saveProject({ ...emptyProject(), path: "/proj/c" }, config);

    expect(Persistency.getSavedProjects()[0].path).toBe("/proj/c");

    // Overwrite /proj/a
    Persistency.saveProject({ ...emptyProject(), path: "/proj/a" }, config);

    const saved = Persistency.getSavedProjects();
    expect(saved.length).toBe(3);
    expect(saved[0].path).toBe("/proj/a");
  });

  it("saves and restores checklist checked items and CAD type", () => {
    const project = { ...emptyProject(), path: "/proj/altium-board" };
    const config = emptyConfig();

    const sampleChecklist: Checklist = [
      {
        title: "Computer",
        items: [
          { text: "Item 1", checked: true },
          { text: "Item 2", checked: false },
          { text: "Item 3", checked: true },
        ]
      },
      {
        title: "CNC",
        items: [
          { text: "Item 4", checked: true }
        ]
      }
    ];

    Persistency.saveProject(project, config, sampleChecklist, "altium");

    const saved = Persistency.getSavedProjects();
    expect(saved.length).toBe(1);
    expect(saved[0].cadType).toBe("altium");
    expect(saved[0].checklist).toBeDefined();

    const restoredChecklist = saved[0].checklist!;
    expect(restoredChecklist[0].items[0].checked).toBe(true);
    expect(restoredChecklist[0].items[1].checked).toBe(false);
    expect(restoredChecklist[0].items[2].checked).toBe(true);
    expect(restoredChecklist[1].items[0].checked).toBe(true);
  });

  it("deletes a project by path", () => {
    const config = emptyConfig();
    Persistency.saveProject({ ...emptyProject(), path: "/proj/one" }, config);
    Persistency.saveProject({ ...emptyProject(), path: "/proj/two" }, config);

    expect(Persistency.getSavedProjects().length).toBe(2);

    Persistency.deleteProject("/proj/one");

    const saved = Persistency.getSavedProjects();
    expect(saved.length).toBe(1);
    expect(saved[0].path).toBe("/proj/two");
  });
});
