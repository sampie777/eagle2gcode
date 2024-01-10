import {BufferGeometry, CircleGeometry, Line, LineBasicMaterial, MeshBasicMaterial, Scene, Vector3} from "three";
import {Drill, Point} from "../types/cam.ts";

export const drawDefaultCircle = (scene: Scene, inputs: Drill[]) => {
    inputs.forEach(it => {
        scene.add(defaultCircle({x: it.x, y: it.y}, it.size, 0xcc5555))
    })
}

export const defaultLine = (from: Point, to: Point, color = 0x0000ffff) => {
    const material = new LineBasicMaterial({color: color, linewidth: 20});
    const geometry = new BufferGeometry().setFromPoints([
        pointToVector(from),
        pointToVector(to),
    ])
    return new Line(geometry, material)
}

export const defaultCircle = (from: Point, size: number, color = 0x000000ff) => {
    const material = new MeshBasicMaterial({color: color});
    const geometry = new CircleGeometry(size / 2, 32)
    const line = new Line(geometry, material);
    line.position.x = from.x;
    line.position.y = from.y;
    return line
}

export const pointToVector = (input: Point, zoffset = 0): Vector3 => new Vector3(input.x, input.y, zoffset);