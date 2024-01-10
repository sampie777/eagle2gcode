import {DoubleSide, Mesh, MeshBasicMaterial, Scene, Shape, ShapeGeometry} from "three";
import {Eagle} from "../types/eagle.ts";
import {defaultLine} from "./utils.ts";

const layerToColor = (layer: string) => {
    switch (layer) {
        case "1": return 0xff0000;
        case "20": return 0xffff00;
    }
    return 0x888888;
}

export const drawBoard = (scene: Scene, board: Eagle.Board) => {
    board.plain.forEach(wire => {
        scene.add(defaultLine({x: wire.x1, y: wire.y1}, {x: wire.x2, y: wire.y2}, layerToColor(wire.layer)))
    })

    board.signals.forEach(signal => {
        signal.wires.forEach(wire => {
            // scene.add(defaultLine({x: wire.x1, y: wire.y1}, {x: wire.x2, y: wire.y2}, layerToColor(wire.layer)))

            const shape = new Shape();
            shape.moveTo(wire.x1, wire.y1);
            shape.lineTo(wire.x1 + wire.width, wire.y1 + wire.width);
            shape.lineTo(wire.x2 + wire.width, wire.y2 + wire.width);
            shape.lineTo(wire.x2, wire.y2);

            const geometry = new ShapeGeometry( shape );
            const material = new MeshBasicMaterial( { color: 0xffffff } );
            material.side = DoubleSide;
            const mesh = new Mesh( geometry, material ) ;
            scene.add(mesh)
        })
    })
};