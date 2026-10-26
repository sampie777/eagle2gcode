import { Project } from "../types/project";
import { GcodeConfig } from "../types/gcode";
import { Checklist } from "../types/checklist";
import { CadType } from "../flatcam";

export namespace Persistency {
  export const MAX_PROJECTS = 5;
  export const STORAGE_KEY = "saved_projects";
  export const LEGACY_STORAGE_KEY = "project";

  export type SavedProject = {
    path: string;
    name: string;
    savedAt: number;
    project: Project;
    config: GcodeConfig;
    cadType?: CadType;
    checklist?: Checklist;
  };

  export type All = {
    project: Project;
    config: GcodeConfig;
    checklist?: Checklist;
    cadType?: CadType;
  };

  export const normalizePath = (p: string | null | undefined): string => {
    return (p || "").trim().replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
  };

  export const getProjectName = (p: string | null | undefined): string => {
    const clean = (p || "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
    if (!clean) return "Untitled Project";
    const segments = clean.split("/").filter(Boolean);
    return segments[segments.length - 1] || clean;
  };

  export const getSavedProjects = (): SavedProject[] => {
    if (typeof localStorage === "undefined") return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_PROJECTS);
        }
      }

      // Check legacy single-project storage if available
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed?.project) {
          const path = parsed.project.path || "Untitled Project";
          const migrated: SavedProject = {
            path,
            name: getProjectName(path),
            savedAt: Date.now(),
            project: parsed.project,
            config: parsed.config,
            checklist: parsed.checklist,
            cadType: parsed.cadType,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify([migrated]));
          return [migrated];
        }
      }
    } catch (e) {
      console.error("Failed to load saved projects from localStorage:", e);
    }
    return [];
  };

  export const saveProject = (
    project: Project,
    config: GcodeConfig,
    checklist?: Checklist,
    cadType?: CadType
  ): SavedProject => {
    const path = project.path?.trim() || "Untitled Project";
    project.path = path;

    const newEntry: SavedProject = {
      path,
      name: getProjectName(path),
      savedAt: Date.now(),
      project: JSON.parse(JSON.stringify(project)),
      config: JSON.parse(JSON.stringify(config)),
      cadType,
      checklist: checklist ? JSON.parse(JSON.stringify(checklist)) : undefined,
    };

    if (typeof localStorage !== "undefined") {
      try {
        const existingList = getSavedProjects();
        const normPath = normalizePath(path);

        const existingIndex = existingList.findIndex(
          p => normalizePath(p.path) === normPath
        );

        if (existingIndex !== -1) {
          // Overwrite existing save with same project path
          existingList[existingIndex] = newEntry;
          // Move to the beginning (most recent)
          const [updated] = existingList.splice(existingIndex, 1);
          existingList.unshift(updated);
        } else {
          // Add as a new entry at the beginning
          existingList.unshift(newEntry);
        }

        // Keep at most 5 projects
        const capped = existingList.slice(0, MAX_PROJECTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));

        // Also update legacy key for backward compatibility
        localStorage.setItem(
          LEGACY_STORAGE_KEY,
          JSON.stringify({
            project: newEntry.project,
            config: newEntry.config,
            checklist: newEntry.checklist,
            cadType: newEntry.cadType,
          })
        );
      } catch (e) {
        console.error("Failed to save project to localStorage:", e);
      }
    }

    return newEntry;
  };

  export const deleteProject = (path: string): SavedProject[] => {
    if (typeof localStorage === "undefined") return [];

    try {
      const normPath = normalizePath(path);
      const existingList = getSavedProjects();
      const filtered = existingList.filter(p => normalizePath(p.path) !== normPath);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (e) {
      console.error("Failed to delete project from localStorage:", e);
      return [];
    }
  };

  export const saveAll = (
    project: Project,
    config: GcodeConfig,
    checklist?: Checklist,
    cadType?: CadType
  ) => {
    return saveProject(project, config, checklist, cadType);
  };

  export const loadAll = (): All | null => {
    const saved = getSavedProjects();
    if (saved.length > 0) {
      const first = saved[0];
      return {
        project: first.project,
        config: first.config,
        checklist: first.checklist,
        cadType: first.cadType,
      };
    }

    if (typeof localStorage === "undefined") return null;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return null;
    try {
      return JSON.parse(legacy) as All;
    } catch {
      return null;
    }
  };
}
