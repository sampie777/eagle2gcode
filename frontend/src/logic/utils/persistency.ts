import {Project} from "../types/project.ts";
import {GcodeConfig} from "../types/gcode.ts";

export namespace Persistency {
    type All = {
        project: Project,
        config: GcodeConfig,
    }

    export const saveAll = (project: Project, config: GcodeConfig) => {
        const all: All = {
            project: project,
            config: config,
        }
        localStorage.setItem("project", JSON.stringify(all))
    }

    export const loadAll = (): All | null => {
        const result = localStorage.getItem("project")
        if (!result) return null;
        return JSON.parse(result) as All;
    }
}