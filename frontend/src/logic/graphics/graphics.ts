import {
    AxesHelper,
    Color,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GerberCommand} from "../types/cam.ts";
import {Project} from "../types/project.ts";
import {defaultLine, drawDefaultCircle} from "./utils.ts";
import {drawBoard} from "./board.ts";

export namespace Graphics {
    const requestRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls?: OrbitControls) =>
        requestAnimationFrame(() => render(renderer, scene, camera, controls));

    export const start = (): {
        canvas: HTMLCanvasElement,
        update: (project: Project) => void
    } => {
        const renderer = new WebGLRenderer();
        renderer.setSize(600, 600);

        const scene = new Scene();
        scene.background = new Color(0.018, 0.018, 0.018)
        scene.add(new AxesHelper(5));

        const camera = new PerspectiveCamera(75, 600 / 600, 0.1, 1000);

        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.addEventListener("change", (e) => {
        //     requestRender(renderer, scene, camera, controls);
        // })

        requestRender(renderer, scene, camera);
        return {
            canvas: renderer.domElement,
            update: (project: Project) => update(scene, camera, project)
        };
    }

    const render = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls?: OrbitControls) => {
        controls?.update();
        renderer.render(scene, camera);
    }

    const update = (scene: Scene, camera: PerspectiveCamera, project: Project) => {
        camera.up = new Vector3(0, 0, 1)
        camera.position.x = project.job.width / 2
        camera.position.y = project.job.height / 2
        camera.position.z = 15
        camera.lookAt(camera.position.x, camera.position.y + 1, 0)  // Look straight down

        // drawDefaultLines(scene, project.profile)
        // drawDefaultLines(scene, project.copper_top)
        // drawDefaultLines(scene, project.silkscreen_top)
        // drawDefaultLines(scene, project.soldermask_top)
        // drawDefaultCircle(scene, project.drills)
        drawBoard(scene, project.board)
    }

    const drawDefaultLines = (scene: Scene, inputs: GerberCommand[]) => {
        let prev: GerberCommand | undefined;
        inputs.forEach(it => {
            if (prev === undefined) {
                prev = it;
                return;
            }

            if (it.operation == "open") {
                scene.add(defaultLine(prev, it, 0xcc5555))
            }
            prev = it;
        })
    }

}