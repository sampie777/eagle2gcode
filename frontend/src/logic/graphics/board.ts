import {
    CylinderGeometry,
    DoubleSide, ExtrudeGeometry,
    Group,
    Mesh,
    MeshBasicMaterial, MeshStandardMaterial,
    Scene,
    Shape,
    ShapeGeometry,
    Vector2
} from "three";
import {Eagle} from "../types/eagle.ts";

const pcbThickness = 1;

export const drawBoard = (scene: Scene, board: Eagle.Board, opacity: number) => {
    drawOutline(board, scene, opacity);
    drawSignals(board, scene, opacity);
    drawComponents(board, scene, opacity);
};

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

function drawOutline(board: Eagle.Board, scene: Scene, opacity: number) {
    if (board.plain.length == 0) return;

    const shape = new Shape();
    shape.moveTo(board.plain[0].x1, board.plain[0].y1)
    board.plain.forEach(wire => {
        shape.lineTo(wire.x2, wire.y2);
    })

    const geometry = new ExtrudeGeometry(shape, {
        depth: -1 * pcbThickness,
    })
    const material = new MeshBasicMaterial({color: 0x0e442d, transparent: true, opacity: 0.8 * opacity});
    material.side = DoubleSide;
    scene.add(new Mesh(geometry, material))
}

const findPackage = (board: Eagle.Board, component: Eagle.Component): Eagle.Package | undefined => {
    const library = board.libraries.find(it => it.urn == component.library_urn);
    if (library == null) return;
    return library.packages.find(it => it.name == component.package);
};

const drawSignals = (board: Eagle.Board, scene: Scene, opacity: number) => {
    board.signals.forEach(signal => {
        signal.wires.forEach(wire => {
            scene.add(createWire(board, wire, opacity))
        })
    })
}

const drawComponents = (board: Eagle.Board, scene: Scene, opacity: number) => {
    board.components.forEach(component => {
        const pack = findPackage(board, component);
        if (pack == null) return;

        const group = new Group();
        pack.wires.forEach(it => {
            const mesh = createWire(board, it, opacity);
            group.add(mesh)
        })
        pack.pads.forEach(it => {
            const mesh = createPad(board, it, opacity);
            group.add(mesh)
        })
        pack.pads.forEach(it => {
            const mesh = createDrill(board, it, opacity);
            group.add(mesh)
        })

        group.position.x += component.x;
        group.position.y += component.y;
        if (component.rotation) {
            group.rotateZ(component.rotation * 2 * Math.PI)
        }
        scene.add(group)
    })
}

const createWire = (board: Eagle.Board, wire: Eagle.Wire, opacity: number) => {
    const from = new Vector2(wire.x1, wire.y1);
    const to = new Vector2(wire.x2, wire.y2);
    const between = (new Vector2()).subVectors(to, from)

    const shape = new Shape();
    shape.moveTo(0, -0.5 * wire.width);
    shape.lineTo(between.length(), -0.5 * wire.width);
    shape.arc(0, 0.5 * wire.width, 0.5 * wire.width, 1.5 * 3.14, 0.5 * 3.14);
    shape.lineTo(between.length(), 0.5 * wire.width);
    shape.lineTo(0, 0.5 * wire.width);
    shape.arc(0, -0.5 * wire.width, 0.5 * wire.width, 0.5 * 3.14, 1.5 * 3.14);

    const geometry = new ShapeGeometry(shape);
    const material = new MeshBasicMaterial({
        color: layerToColor(board.layers, wire.layer),
        transparent: true,
        opacity: opacity
    });
    material.side = DoubleSide;
    const mesh = new Mesh(geometry, material);

    mesh.rotateZ(between.angle())
    mesh.position.x = from.x
    mesh.position.y = from.y

    return mesh
}

const createPad = (board: Eagle.Board, pad: Eagle.Pad, opacity: number) => {
    const padWidth = pad.drill * 1.8;

    const shape = new Shape();
    if (pad.shape == "octagon") {
        const verticeLength = padWidth / (1 + Math.sqrt(2))
        const diagonalVerticeLength = verticeLength * Math.sqrt(0.5);

        shape.moveTo(diagonalVerticeLength, 0);
        shape.lineTo(diagonalVerticeLength + verticeLength, 0);
        shape.lineTo(2 * diagonalVerticeLength + verticeLength, diagonalVerticeLength);
        shape.lineTo(2 * diagonalVerticeLength + verticeLength, diagonalVerticeLength + verticeLength);
        shape.lineTo(diagonalVerticeLength + verticeLength, 2 * diagonalVerticeLength + verticeLength);
        shape.lineTo(diagonalVerticeLength, 2 * diagonalVerticeLength + verticeLength);
        shape.lineTo(0, diagonalVerticeLength + verticeLength);
        shape.lineTo(0, diagonalVerticeLength);
        shape.lineTo(diagonalVerticeLength, 0);

        // Create hole
        shape.absarc(padWidth / 2, padWidth / 2, pad.drill / 2,
            1.25 * Math.PI, 1.2501 * Math.PI, true)
    } else if (pad.shape == "long") {
        shape.moveTo(0, 0);
        shape.arc(padWidth / 2, 0, padWidth / 2, Math.PI, 2 * Math.PI, false);
        shape.lineTo(padWidth, padWidth);
        shape.arc(padWidth / -2, 0, padWidth / 2, 0, Math.PI, false);
        shape.lineTo(0, 0)

        // Create hole
        shape.absarc(padWidth / 2, padWidth / 2, pad.drill / 2,
            1.25 * Math.PI, 1.2501 * Math.PI, true)
    } else {
        console.error("Unknown pad shape", pad)
    }

    const geometry = new ShapeGeometry(shape);
    const padLayer = board.layers.find(it => it.name == "Pads")
    const material = new MeshBasicMaterial({
        color: layerToColor(board.layers, padLayer?.number ?? "0"),
        transparent: true,
        opacity: opacity
    });
    material.side = DoubleSide;
    const mesh = new Mesh(geometry, material);

    mesh.position.x -= 0.5 * padWidth;
    mesh.position.y -= 0.5 * padWidth;

    mesh.position.x += pad.x
    mesh.position.y += pad.y
    return mesh
}

const createDrill = (board: Eagle.Board, pad: Eagle.Pad, opacity: number) => {
    const geometry = new CylinderGeometry(
        pad.drill / 2,
        pad.drill / 2,
        pcbThickness,
        32,
        1,
        false);
    const material = new MeshBasicMaterial({color: 0x95833d, transparent: true, opacity: opacity});
    material.side = DoubleSide;
    const mesh = new Mesh(geometry, material);

    mesh.rotateX(0.5 * Math.PI)
    mesh.position.z -= 0.5 * pcbThickness;

    mesh.position.x += pad.x
    mesh.position.y += pad.y
    return mesh
}
