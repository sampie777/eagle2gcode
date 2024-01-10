import {DoubleSide, Mesh, MeshBasicMaterial, Scene, Shape, ShapeGeometry, Vector2} from "three";
import {Eagle} from "../types/eagle.ts";
import {defaultLine} from "./utils.ts";

const colors = {
    4: 0xa00909,
    2: 0x31b079,
    7: 0x9f9f9f,
    24: 0x88763e
}

const layerToColor = (layers: Eagle.Layer[], layer: string) => {
    const value = colors[layers.find(it => it.number == layer)?.color];
    return value ?? 0x888888;
}

function drawOutline(board: Eagle.Board, scene: Scene) {
    board.plain.forEach(wire => {
        scene.add(defaultLine(
            {x: wire.x1, y: wire.y1},
            {x: wire.x2, y: wire.y2},
            layerToColor(board.layers, wire.layer)))
    })
}

export const drawBoard = (scene: Scene, board: Eagle.Board) => {
    drawOutline(board, scene);

    board.signals.forEach(signal => {
        signal.wires.forEach(wire => {
            // scene.add(defaultLine({x: wire.x1, y: wire.y1}, {x: wire.x2, y: wire.y2}, layerToColor(wire.layer)))

            const shape = new Shape();
            shape.moveTo(wire.x1, wire.y1);
            shape.lineTo(wire.x1 + wire.width, wire.y1 + wire.width);
            shape.lineTo(wire.x2 + wire.width, wire.y2 + wire.width);
            shape.lineTo(wire.x2, wire.y2);

            const geometry = new ShapeGeometry(shape);
            const material = new MeshBasicMaterial({color: layerToColor(board.layers, wire.layer)});
            material.side = DoubleSide;
            const mesh = new Mesh(geometry, material);
            scene.add(mesh)
        })
    })
};