import {createContext, useContext} from "solid-js";
import {Project} from "../logic/types/project.ts";
import {Persistency} from "../logic/utils/persistency.ts";

export const emptyProject = (): Project => ({
    isLoaded: false,
    board: {
        layers: [],
        libraries: [],
        plain: [],
        components: [],
        signals: [],
    },
    profile: [],
    traces_top: [],
    traces_bottom: [],
    silkscreen_top: [],
    silkscreen_bottom: [],
    soldermask_top: [],
    soldermask_bottom: [],
    drills: [],
});

const loadProject = (to: Project, from: Project | null | undefined) => {
    if (from == null) return;
    to.path = from.path;
    to.isLoaded = from.isLoaded;
    to.profile = from.profile;
    to.traces_top = from.traces_top;
    to.traces_bottom = from.traces_bottom;
    to.silkscreen_top = from.silkscreen_top;
    to.silkscreen_bottom = from.silkscreen_bottom;
    to.soldermask_top = from.soldermask_top;
    to.soldermask_bottom = from.soldermask_bottom;
    to.drills = from.drills;
    to.board = from.board;
}

const defaultValue = emptyProject()
export const ProjectContext = createContext<{ project: Project, loadProject: (from?: Project) => void }>({
    project: defaultValue,
    loadProject: (from = Persistency.loadAll()?.project) => loadProject(defaultValue, from)
});

export const useProject = () => useContext(ProjectContext)