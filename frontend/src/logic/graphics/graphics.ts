import {
    AxesHelper,
    BufferGeometry,
    Color,
    GridHelper,
    Line,
    LineBasicMaterial,
    MOUSE,
    PerspectiveCamera,
    Scene,
    Shape,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Project} from "../types/project.ts";
import {drawBoard} from "./board.ts";
import {Trace} from "../types/gcode.ts";
import {ColorRepresentation} from "three/src/math/Color";
import {getProjectAlignmentDrills, getProjectDimensions} from "../processors/project.ts";
import {Drill} from "../types/cam.ts";

export namespace Graphics {
    type RenderConfig = {
        boardOpacity: number,
        showProfile: boolean,
        showTraces: boolean,
        showSilkscreen: boolean,
        showSoldermask: boolean,
        showDrills: boolean,
        showGrid: boolean,
    };

    const requestRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls?: OrbitControls) =>
        requestAnimationFrame(() => render(renderer, scene, camera, controls));

    export const start = (config: { width: number, height: number }): {
        canvas: HTMLCanvasElement,
        update: (project: Project, config: RenderConfig) => void
    } => {
        const renderer = new WebGLRenderer();
        renderer.setSize(config.width, config.height);

        const scene = new Scene();
        scene.background = new Color(0.018, 0.018, 0.018)

        const camera = new PerspectiveCamera(75, config.width / config.height, 0.1, 10000);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.mouseButtons = {
            LEFT: MOUSE.PAN,
            RIGHT: MOUSE.ROTATE
        }
        controls.enableDamping = true;
        controls.addEventListener("change", (e) => {
            requestRender(renderer, scene, camera, controls);
        })

        requestRender(renderer, scene, camera);
        return {
            canvas: renderer.domElement,
            update: (project, config) => {
                update(scene, camera, project, config, controls)
                requestRender(renderer, scene, camera);
            }
        };
    }

    const render = (renderer: WebGLRenderer,
                    scene: Scene,
                    camera: PerspectiveCamera,
                    controls?: OrbitControls,) => {
        controls?.update();
        renderer.render(scene, camera);
    }

    const update = (scene: Scene,
                    camera: PerspectiveCamera,
                    project: Project,
                    config: RenderConfig,
                    controls?: OrbitControls) => {
        scene.clear()

        const dimensions = getProjectDimensions(project);
        camera.position.x = dimensions.width / 2
        camera.position.y = dimensions.height / 2
        // Auto zoom based on board dimensions (notice we're working with perspectives here)
        camera.position.z = Math.max(dimensions.width, dimensions.height) / 2 / Math.tan(camera.fov / 2 / 180 * Math.PI)
        camera.lookAt(camera.position.x, camera.position.y + 1, 0)  // Look straight down
        if (controls) {
            controls.target = new Vector3(camera.position.x, camera.position.y, 0)
        }

        scene.add(new AxesHelper(2));
        if (config.showGrid) {
            drawGrid(dimensions, scene);
        }

        if (config.showProfile) {
            drawDefaultLines(scene, project.profile, 0x88763e)
        }
        if (config.showTraces) {
            drawDefaultLines(scene, project.traces_top, 0xa00909)
            drawDefaultLines(scene, project.traces_bottom, 0xa00909)
        }
        if (config.showSilkscreen) {
            drawDefaultLines(scene, project.silkscreen_top, 0x9f9f9f)
            drawDefaultLines(scene, project.silkscreen_bottom, 0x9f9f9f)
        }
        if (config.showSoldermask) {
            drawDefaultLines(scene, project.soldermask_top, 0x31b079)
            drawDefaultLines(scene, project.soldermask_bottom, 0x31b079)
        }
        if (config.showDrills) {
            project.drills.forEach(it => scene.add(drawDrill(it, 0xaa00aa)))
            getProjectAlignmentDrills(project).forEach(it => scene.add(drawDrill(it, 0x88aaff)))
        }

        drawBoard(scene, project.board, config.boardOpacity)
    }

    const drawGrid = (dimensions: { x: number; y: number; width: number; height: number }, scene: Scene) => {
        const gridSize = 2 * Math.ceil(Math.max(dimensions.x + dimensions.width, dimensions.y + dimensions.height) / 10) * 10;
        const gridHelper = new GridHelper(gridSize, gridSize, 0xffffff);
        gridHelper.rotateX(0.5 * Math.PI)
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.2;
        scene.add(gridHelper)

        const gridHelper2 = new GridHelper(gridSize, gridSize / 10, 0xffffff, 0xffffff);
        gridHelper2.rotateX(0.5 * Math.PI)
        gridHelper2.material.transparent = true;
        gridHelper2.material.opacity = 0.15;
        scene.add(gridHelper2)
    }

    const drawDefaultLines = (scene: Scene, traces: Trace[], color: ColorRepresentation) => {
        traces.forEach(it => scene.add(drawTrace(it, color)))
    }

    const drawTrace = (trace: Trace, color: ColorRepresentation) => {
        if (trace.length == 0) return;

        const shape = new Shape();
        shape.moveTo(trace[0].x, trace[0].y)
        trace.forEach(wire => {
            shape.lineTo(wire.x, wire.y);
        })

        const geometry = new BufferGeometry().setFromPoints(shape.getPoints())
        const material = new LineBasicMaterial({color: color, linewidth: 20});
        return new Line(geometry, material)
    };

    const drawDrill = (drill: Drill, color: ColorRepresentation) => {
        const shape = new Shape();
        const radius = drill.size / 2 * Math.sin(0.25 * Math.PI);
        shape.moveTo(drill.x - radius, drill.y - radius)
        shape.lineTo(drill.x + radius, drill.y + radius)
        shape.moveTo(drill.x, drill.y)
        shape.lineTo(drill.x - radius, drill.y + radius)
        shape.lineTo(drill.x + radius, drill.y - radius)

        const geometry = new BufferGeometry().setFromPoints(shape.getPoints())
        const material = new LineBasicMaterial({color: color});
        return new Line(geometry, material)
    }
}