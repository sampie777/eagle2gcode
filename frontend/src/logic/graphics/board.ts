import {
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Path,
  Scene,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3
} from "three";
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Eagle } from "../types/eagle";

const pcbThickness = 1;

// --- Add Cache Mechanisms ---
const materialCache = new Map<string, MeshBasicMaterial>();
const getMaterial = (color: number, opacity: number) => {
  const key = `${color}-${opacity}`;
  if (!materialCache.has(key)) {
    materialCache.set(key, new MeshBasicMaterial({ color: color, transparent: true, opacity: opacity, side: DoubleSide }));
  }
  return materialCache.get(key)!;
};

const drillGeometryCache = new Map<number, CylinderGeometry>();
const getDrillGeometry = (drillSize: number) => {
  if (!drillGeometryCache.has(drillSize)) {
    drillGeometryCache.set(drillSize, new CylinderGeometry(drillSize / 2, drillSize / 2, pcbThickness, 16, 1, false));
  }
  return drillGeometryCache.get(drillSize)!;
};

export const drawBoard = (scene: Scene, board: Eagle.Board, opacity: number) => {
  if (opacity == 0) return;
  drawOutline(board, scene, opacity);

  // We will collect all geometries into buckets grouped by Color,
  // so we only create one Mesh per distinct material.
  const geometryBuckets = new Map<number, BufferGeometry[]>();

  const addToBucket = (color: number, geometry: BufferGeometry) => {
    if (!geometryBuckets.has(color)) geometryBuckets.set(color, []);
    geometryBuckets.get(color)!.push(geometry);
  };

  drawSignals(board, addToBucket);
  drawComponents(board, addToBucket);

  // Merge all geometries in each bucket and add them to the scene
  geometryBuckets.forEach((geometries, color) => {
    if (geometries.length > 0) {
      const mergedGeometry = mergeGeometries(geometries);
      if (mergedGeometry) {
        const material = getMaterial(color, opacity);
        scene.add(new Mesh(mergedGeometry, material));
      }
    }
  });
};

const colors: Record<number, number> = {
  4: 0xa00909,
  2: 0x31b079,
  7: 0x9f9f9f,
  24: 0x88763e
}

const layerToColor = (layers: Eagle.Layer[], layer: string) => {
  const layerNum = layers.find(it => it.number == layer)?.color;
  return layerNum !== undefined ? (colors[layerNum] ?? 0x888888) : 0x888888;
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
  const material = new MeshBasicMaterial({ color: 0x0e442d, transparent: true, opacity: 0.8 * opacity });
  material.side = DoubleSide;
  scene.add(new Mesh(geometry, material))
}

const findPackage = (board: Eagle.Board, component: Eagle.Component): Eagle.Package | undefined => {
  // Search by URN first (official libraries), then fallback to name (custom libraries)
  const library = board.libraries.find(it =>
    (component.library_urn && it.urn === component.library_urn) ||
    (it.name === component.library)
  );

  if (library == null) return;
  return library.packages.find(it => it.name === component.package);
};

const drawSignals = (board: Eagle.Board, addToBucket: (color: number, geom: BufferGeometry) => void) => {
  board.signals.forEach(signal => {
    signal.wires.forEach(wire => {
      const { geometry, color } = createWireGeometry(board, wire);
      addToBucket(color, geometry);
    })
  })
}

const drawComponents = (board: Eagle.Board, addToBucket: (color: number, geom: BufferGeometry) => void) => {
  board.components.forEach(component => {
    const pack = findPackage(board, component);

    // Add a warning so missing packages don't fail silently
    if (pack == null) {
      console.warn(`Missing package for component:`, component);
      return;
    }

    // Create a matrix to apply the component's rotation and position to its internal parts
    const matrix = new Matrix4();
    if (component.rotation) {
        matrix.makeRotationZ(component.rotation * 2 * Math.PI);
    }
    matrix.setPosition(new Vector3(component.x, component.y, 0));

    pack.wires.forEach(it => {
        const { geometry, color } = createWireGeometry(board, it);
        geometry.applyMatrix4(matrix);
        addToBucket(color, geometry);
    })

    pack.pads.forEach(it => {
        const { geometry, color } = createPadGeometry(board, it);
        geometry.applyMatrix4(matrix);
        addToBucket(color, geometry);
    })

    pack.pads.forEach(it => {
        const { geometry, color } = createDrillGeometry(it);
        geometry.applyMatrix4(matrix);
        addToBucket(color, geometry);
    })
  })
}

const createWireGeometry = (board: Eagle.Board, wire: Eagle.Wire) => {
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

  // Transform geometry directly instead of wrapping in a Mesh
  geometry.rotateZ(between.angle());
  geometry.translate(from.x, from.y, 0);

  const color = layerToColor(board.layers, wire.layer);
  return { geometry, color };
}

const createPadGeometry = (board: Eagle.Board, pad: Eagle.Pad) => {
  const padWidth = pad.drill * 1.8;
  const shape = new Shape();

  // Handle true null, undefined, or the literal string "null"
  const shapeType = pad.shape === "null" || !pad.shape ? "round" : pad.shape;

  if (shapeType == "octagon") {
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
  } else if (shapeType == "long") {
    shape.moveTo(0, 0);
    shape.arc(padWidth / 2, 0, padWidth / 2, Math.PI, 2 * Math.PI, false);
    shape.lineTo(padWidth, padWidth);
    shape.arc(padWidth / -2, 0, padWidth / 2, 0, Math.PI, false);
    shape.lineTo(0, 0);
  } else if (shapeType == "square") {
    shape.moveTo(0, 0);
    shape.lineTo(padWidth, 0);
    shape.lineTo(padWidth, padWidth);
    shape.lineTo(0, padWidth);
    shape.lineTo(0, 0);
  } else if (shapeType == "round") {
    shape.moveTo(padWidth, padWidth / 2);
    shape.absarc(padWidth / 2, padWidth / 2, padWidth / 2, 0, 2 * Math.PI, false);
  } else {
    console.error("Unknown pad shape", pad)
  }

  // PROPER THREE.JS HOLE: Create a separate path and push it to shape.holes
  const hole = new Path();
  hole.absarc(padWidth / 2, padWidth / 2, pad.drill / 2, 0, 2 * Math.PI, true);
  shape.holes.push(hole);

  const geometry = new ShapeGeometry(shape);

  // Transform geometry directly to match pad location
  geometry.translate(-0.5 * padWidth + pad.x, -0.5 * padWidth + pad.y, 0);

  const padLayer = board.layers.find(it => it.name == "Pads")
  const color = layerToColor(board.layers, padLayer?.number ?? "0");

  return { geometry, color };
}

const createDrillGeometry = (pad: Eagle.Pad) => {
  // Clone the cached template so we don't mutate it
  const geometry = getDrillGeometry(pad.drill).clone();

  geometry.rotateX(0.5 * Math.PI);
  geometry.translate(pad.x, pad.y, -0.5 * pcbThickness);

  return { geometry, color: 0x95833d };
}