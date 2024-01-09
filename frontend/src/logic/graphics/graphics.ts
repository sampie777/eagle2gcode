import {
    AxesHelper,
    BufferGeometry, CircleGeometry, Color,
    Line,
    LineBasicMaterial, MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Drill, GerberCommand, Point, Project} from "../types.ts";

export namespace Graphics {
    const requestRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls?: OrbitControls) =>
        requestAnimationFrame(() => render(renderer, scene, camera, controls));

    export const start = (): {
        canvas: HTMLCanvasElement,
        update: (project: Project) => void
    } => {
        const renderer = new WebGLRenderer();
        renderer.setSize(800, 500);

        const scene = new Scene();
        scene.background = new Color(0.018, 0.018, 0.018)
        scene.add(new AxesHelper(5));

        const camera = new PerspectiveCamera(75, 800 / 500, 0.1, 1000);

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
        console.log(project)
        camera.position.x = project.job.width / 2
        camera.position.y = 20
        camera.position.z = project.job.height / 2
        camera.lookAt(camera.position.x, 0, camera.position.z)
        camera.rotateZ(1.5 * 3.14)

        drawDefaultLines(scene, project.profile)
        drawDefaultLines(scene, project.copper_top)
        drawDefaultLines(scene, project.silkscreen_top)
        drawDefaultLines(scene, project.soldermask_top)
        drawDefaultCircle(scene, project.drills)
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

    const drawDefaultCircle = (scene: Scene, inputs: Drill[]) => {
        inputs.forEach(it => {
            scene.add(defaultCircle({x: it.x, y: it.y}, it.size, 0xcc5555))
        })
    }

    const defaultLine = (from: Point, to: Point, color = 0x000000ff) => {
        const material = new LineBasicMaterial({color: color});
        const geometry = new BufferGeometry().setFromPoints([
            pointToVector(from),
            pointToVector(to),
        ])
        return new Line(geometry, material)
    }

    const defaultCircle = (from: Point, size: number, color = 0x000000ff) => {
        const material = new MeshBasicMaterial({color: color});
        const geometry = new CircleGeometry(size / 2, 32)
        const line = new Line(geometry, material);
        line.rotateX(0.5 * 3.14)
        line.position.z = from.x;
        line.position.x = from.y;
        return line
    }

    const pointToVector = (input: Point, zoffset = 0): Vector3 => new Vector3(input.y, zoffset, input.x);
}