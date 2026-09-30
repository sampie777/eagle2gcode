import {
  AxesHelper,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  GridHelper,
  LineBasicMaterial,
  LineSegments,
  MOUSE,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Project } from "../types/project";
import { drawBoard } from "./board";
import { DrillConfig, GcodeConfig, Trace } from "../types/gcode";
import { ColorRepresentation } from "three/src/math/Color";
import { getProjectAlignmentDrills, getProjectDimensions } from "../processors/project";
import { Drill } from "../types/cam";
import { defaultCircle } from "./utils";
import { getLocationForDrill } from "../generators/drills";
import { getConfigWithRotation } from "../utils/utils";

export namespace Graphics {
  type RenderConfig = {
    boardOpacity: number,
    showProfile: boolean,
    showTopTraces: boolean,
    showBottomTraces: boolean,
    showSilkscreen: boolean,
    showSoldermask: boolean,
    showDrills: boolean,
    showGrid: boolean,
    showAlignmentHolesDebug: boolean,
    showOffsetDrillHolesDebug: boolean,
  };

  const requestRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls?: OrbitControls) =>
    requestAnimationFrame(() => render(renderer, scene, camera, controls));

  export const start = (config: { width: number, height: number }): {
    canvas: HTMLCanvasElement,
    update: (project: Project, config: RenderConfig, projectConfig: GcodeConfig) => void,
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
    controls.enableZoom = false; // Disable default central zoom in favor of mouse-anchored zoom

    controls.addEventListener("change", () => {
      requestRender(renderer, scene, camera, controls);
    });

    // Setup mouse-anchored zoom
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const pcbPlane = new Plane(new Vector3(0, 0, 1), 0); // Z = 0 plane where the PCB lies
    const intersectionPoint = new Vector3();

    renderer.domElement.addEventListener("wheel", (event: WheelEvent) => {
      event.preventDefault();

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Find the point on the PCB plane under the cursor
      if (raycaster.ray.intersectPlane(pcbPlane, intersectionPoint)) {
        // Multiplier based on scroll direction (deltaY > 0 is scroll down/zoom out)
        const zoomFactor = event.deltaY < 0 ? 0.97 : 1.03;

        // Move camera position toward/away from the cursor intersection
        camera.position.x = intersectionPoint.x + (camera.position.x - intersectionPoint.x) * zoomFactor;
        camera.position.y = intersectionPoint.y + (camera.position.y - intersectionPoint.y) * zoomFactor;
        camera.position.z = intersectionPoint.z + (camera.position.z - intersectionPoint.z) * zoomFactor;

        // Keep controls.target aligned to prevent orbit rotation jumping
        controls.target.x = intersectionPoint.x + (controls.target.x - intersectionPoint.x) * zoomFactor;
        controls.target.y = intersectionPoint.y + (controls.target.y - intersectionPoint.y) * zoomFactor;
        controls.target.z = intersectionPoint.z + (controls.target.z - intersectionPoint.z) * zoomFactor;

        controls.update();
        requestRender(renderer, scene, camera, controls);
      }
    }, { passive: false });

    requestRender(renderer, scene, camera, controls);
    return {
      canvas: renderer.domElement,
      update: (project, config, projectConfig: GcodeConfig) => requestAnimationFrame(() => {
        update(scene, camera, project, config, projectConfig, controls)
        requestRender(renderer, scene, camera, controls);
      })
    };
  }

  const render = (renderer: WebGLRenderer,
                  scene: Scene,
                  camera: PerspectiveCamera,
                  controls?: OrbitControls,) => {
    controls?.update();
    renderer.render(scene, camera);
  }

  const drawAlignmentHoles = (scene: Scene, project: Project, config: DrillConfig) => {
    const configWithRotation = getConfigWithRotation(config);

    getProjectAlignmentDrills(project)
      .map(it => getLocationForDrill(configWithRotation, it))
      .forEach(it => scene.add(defaultCircle(it, 4, 0xffffff, 4)))
    config.offset.forEach(it => scene.add(defaultCircle(it.actual, 3, 0xff00ff, 4)))
    config.offset.forEach(it => scene.add(defaultCircle(it.original, 2, 0xffff00, 4)))
  };

  const drawOffsetDrillHoles = (scene: Scene, project: Project, config: DrillConfig) => {
    const configWithRotation = getConfigWithRotation(config);

    project.drills
      .map(it => getLocationForDrill(configWithRotation, it))
      .forEach(it => scene.add(defaultCircle(it, 1, 0x777777, 4)))
  };

  const update = (scene: Scene,
                  camera: PerspectiveCamera,
                  project: Project,
                  config: RenderConfig,
                  projectConfig: GcodeConfig,
                  controls?: OrbitControls) => {

    // --- MEMORY CLEANUP: Dispose of old geometries and materials ---
    scene.children.forEach((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        // Materials can be an array or a single object
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: any) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    // -------------------------------------------------------------

    scene.clear()

    const dimensions = getProjectDimensions(project);
    camera.position.x = dimensions.width / 2
    camera.position.y = dimensions.height / 2
    // Auto zoom based on board dimensions (notice we're working with perspectives here)
    const heightFactor = (37 / 28) * dimensions.height / dimensions.width;
    camera.position.z = heightFactor * Math.max(dimensions.width, dimensions.height) / 2 / Math.tan(camera.fov / 2 / 180 * Math.PI)
    camera.lookAt(camera.position.x, camera.position.y + 1, 0)  // Look straight down
    if (controls) {
      controls.target = new Vector3(camera.position.x, camera.position.y, 0)
    }

    scene.add(new AxesHelper(2));
    if (config.showGrid) {
      drawGrid(dimensions, scene);
    }


    if (projectConfig.traces.cutoutProfile) {
      drawDefaultLines(scene, project.profile, 0x88763e)
    } else if (config.showProfile) {
      drawDefaultLines(scene, project.profile, 0x333333)
    }

    if (config.showBottomTraces) {
      drawDefaultLines(scene, project.traces_bottom, 0xa00909)
    }
    if (config.showTopTraces) {
      drawDefaultLines(scene, project.traces_top, 0xa04909)
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
      drawDrillsBatched(scene, project.drills, 0xaa00aa)
      drawDrillsBatched(scene, getProjectAlignmentDrills(project), 0x88aaff)
    }

    drawBoard(scene, project.board, project.drills, config.boardOpacity)

    if (config.showOffsetDrillHolesDebug) {
      drawOffsetDrillHoles(scene, project, projectConfig.drills);
    }
    if (config.showAlignmentHolesDebug) {
      drawAlignmentHoles(scene, project, projectConfig.drills);
    }

    drawDimensions(scene, project, 0x777700)
  }

  const drawDimensions = (scene: Scene, project: Project, color: ColorRepresentation) => {
    const dimensions = getProjectDimensions(project)

    const trace: Trace = [
      { enabled: true, x: dimensions.x, y: dimensions.y },
      { enabled: true, x: dimensions.x + dimensions.width, y: dimensions.y },
      { enabled: true, x: dimensions.x + dimensions.width, y: dimensions.y + dimensions.height },
      { enabled: true, x: dimensions.x, y: dimensions.y + dimensions.height },
      { enabled: true, x: dimensions.x, y: dimensions.y },
    ]

    drawDefaultLines(scene, [trace], color);
  }

  const drawGrid = (dimensions: { x: number; y: number; width: number; height: number }, scene: Scene) => {
    const gridSize = Math.max(100, 2 * Math.ceil(Math.max(dimensions.x + dimensions.width, dimensions.y + dimensions.height) / 10) * 10);
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
    const positions: number[] = [];

    traces.forEach(trace => {
      const enabled = trace.filter(it => it.enabled);
      for (let i = 0; i < enabled.length - 1; i++) {
        positions.push(enabled[i].x, enabled[i].y, 0);
        positions.push(enabled[i + 1].x, enabled[i + 1].y, 0);
      }
    });

    if (positions.length === 0) return;

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    const material = new LineBasicMaterial({ color: color, linewidth: 20 });
    scene.add(new LineSegments(geometry, material));
  }

  // Replace drawDrill with a batched version
  const drawDrillsBatched = (scene: Scene, drills: Drill[], color: ColorRepresentation) => {
    const positions: number[] = [];

    drills.forEach(drill => {
      const radius = drill.size / 2 * Math.sin(0.25 * Math.PI);
      positions.push(drill.x - radius, drill.y - radius, 0);
      positions.push(drill.x + radius, drill.y + radius, 0);
      positions.push(drill.x - radius, drill.y + radius, 0);
      positions.push(drill.x + radius, drill.y - radius, 0);
    });

    if (positions.length === 0) return;

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    const material = new LineBasicMaterial({ color: color });
    scene.add(new LineSegments(geometry, material));
  }
}