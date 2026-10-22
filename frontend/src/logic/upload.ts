import { processDrillFile } from "./processors/drill";
import { processBoardFile } from "./processors/board";
import { Flatcam } from "./flatcam";
import { processTraces } from "./processors/traces";
import { Project } from "./types/project";
import { Eagle } from "./types/eagle";

export namespace Upload {
  export type Type = {
    file: File
    content?: string
    status: "waiting" | "reading" | "done"
  }

  export const fileMatchers = {
    profile: RegExp(`^${Flatcam.TRACES_PROFILE_OUTPUT_FILE}$`),
    traces_top: RegExp(`^${Flatcam.TRACES_TOP_OUTPUT_FILE}$`),
    traces_bottom: RegExp(`^${Flatcam.TRACES_BOTTOM_OUTPUT_FILE}$`),
    silkscreen_top: RegExp(`^${Flatcam.SILKSCREEN_TOP_OUTPUT_FILE}$`),
    silkscreen_bottom: RegExp(`^${Flatcam.SILKSCREEN_BOTTOM_OUTPUT_FILE}$`),
    soldermask_top: RegExp(`^${Flatcam.SOLDERMASK_TOP_OUTPUT_FILE}$`),
    soldermask_bottom: RegExp(`^${Flatcam.SOLDERMASK_BOTTOM_OUTPUT_FILE}$`),
    drill: /^(drill_1_16\.xln|.+_(PTH|NPTH)_Drill\.gbr)$/i,
    board: /^(.*\.brd|.*\.PcbDoc)$/i,
  }

  export const isProjectAvailable = (project: Project): boolean => {
    if (project.profile.length > 0) return true;
    if (project.traces_top.length > 0) return true;
    if (project.traces_bottom.length > 0) return true;
    if (project.silkscreen_top.length > 0) return true;
    if (project.silkscreen_bottom.length > 0) return true;
    if (project.soldermask_top.length > 0) return true;
    if (project.soldermask_bottom.length > 0) return true;
    if (project.drills.length > 0) return true;
    if (isBoardAvailable(project.board)) return true;
    return false;
  }

  export const isBoardAvailable = (board: Eagle.Board): boolean => {
    if (!board) return false;
    if (board.layers?.length > 0) return true;
    if (board.libraries?.length > 0) return true;
    if (board.plain?.length > 0) return true;
    if (board.components?.length > 0) return true;
    if (board.signals?.length > 0) return true;
    return false;
  }

  export const processFile = (project: Project, name: string, content: string) => {
    if (name.match(fileMatchers.board)) return project.board = processBoardFile(content)
    if (name.match(fileMatchers.profile)) {
      const profile = processTraces(content);
      project.profile = profile;
      if (!project.board.plain || project.board.plain.length === 0) {
        const flatTraces = profile.flat().filter(p => p.enabled);
        if (flatTraces.length >= 3) {
          const plainWires: Eagle.Wire[] = [];
          for (let i = 0; i < flatTraces.length; i++) {
            const cur = flatTraces[i];
            const next = flatTraces[(i + 1) % flatTraces.length];
            plainWires.push({
              layer: "20",
              x1: cur.x,
              y1: cur.y,
              x2: next.x,
              y2: next.y,
              width: 0.1,
              curve: null
            });
          }
          project.board.plain = plainWires;
        }
      }
      return profile;
    }
    if (name.match(fileMatchers.traces_top)) return project.traces_top = processTraces(content)
    if (name.match(fileMatchers.traces_bottom)) return project.traces_bottom = processTraces(content)
    if (name.match(fileMatchers.silkscreen_top)) return project.silkscreen_top = processTraces(content)
    if (name.match(fileMatchers.silkscreen_bottom)) return project.silkscreen_bottom = processTraces(content)
    if (name.match(fileMatchers.soldermask_top)) return project.soldermask_top = processTraces(content)
    if (name.match(fileMatchers.soldermask_bottom)) return project.soldermask_bottom = processTraces(content)
    if (name.match(fileMatchers.drill)) {
      const parsedDrills = processDrillFile(content);
      const existing = project.drills ?? [];
      const combined = [...existing];
      for (const d of parsedDrills) {
        // Prevent duplicate drills if the same file is uploaded multiple times
        const exists = combined.some(c =>
          Math.abs(c.x - d.x) < 0.0001 &&
          Math.abs(c.y - d.y) < 0.0001 &&
          Math.abs(c.size - d.size) < 0.0001
        );
        if (!exists) {
          combined.push(d);
        }
      }
      project.drills = combined;
      return combined;
    }
  }
}
