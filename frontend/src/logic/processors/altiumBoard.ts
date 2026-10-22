import { Eagle } from "../types/eagle";

export const isAltiumBoardFile = (content: string): boolean => {
  return content.includes("PCB 6.0 Binary File") ||
         content.includes("FileHeaderSix") ||
         content.includes("|RECORD=Board") ||
         content.includes("|POLYGONTYPE=Polygon");
};

const parseMil = (s: string | undefined): number => {
  if (!s) return 0;
  const trimmed = s.trim();
  if (trimmed.toLowerCase().endsWith("mm")) {
    return parseFloat(trimmed) / 0.0254;
  }
  return parseFloat(trimmed.replace(/mil/i, "")) || 0;
};

export const createAltiumPackage = (pattern: string): Eagle.Package => {
  const p = pattern.toUpperCase();
  const wires: Eagle.Wire[] = [];
  const pads: Eagle.Pad[] = [];

  const addBox = (w: number, h: number, layer = "21", width = 0.15) => {
    const hw = w / 2;
    const hh = h / 2;
    wires.push({ layer, x1: -hw, y1: -hh, x2: hw, y2: -hh, width, curve: null });
    wires.push({ layer, x1: hw, y1: -hh, x2: hw, y2: hh, width, curve: null });
    wires.push({ layer, x1: hw, y1: hh, x2: -hw, y2: hh, width, curve: null });
    wires.push({ layer, x1: -hw, y1: hh, x2: -hw, y2: -hh, width, curve: null });
  };

  if (p.includes("0805") || p.includes("2012")) {
    addBox(2.0, 1.25);
    pads.push({ name: "1", x: -0.85, y: 0, drill: 0.6, shape: "square", rotation: 0 });
    pads.push({ name: "2", x: 0.85, y: 0, drill: 0.6, shape: "square", rotation: 0 });
  } else if (p.includes("0603") || p.includes("1608")) {
    addBox(1.6, 0.8);
    pads.push({ name: "1", x: -0.7, y: 0, drill: 0.5, shape: "square", rotation: 0 });
    pads.push({ name: "2", x: 0.7, y: 0, drill: 0.5, shape: "square", rotation: 0 });
  } else if (p.includes("1206") || p.includes("3216")) {
    addBox(3.2, 1.6);
    pads.push({ name: "1", x: -1.4, y: 0, drill: 0.8, shape: "square", rotation: 0 });
    pads.push({ name: "2", x: 1.4, y: 0, drill: 0.8, shape: "square", rotation: 0 });
  } else if (p.includes("SOT95") || p.includes("SOT-23") || p.includes("SOT23") || p.includes("SOT25") || p.includes("SOT-25")) {
    addBox(2.9, 1.6);
    pads.push({ name: "1", x: -1.3, y: -0.95, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "2", x: -1.3, y: 0, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "3", x: -1.3, y: 0.95, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "4", x: 1.3, y: 0.95, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "5", x: 1.3, y: -0.95, drill: 0.5, shape: "long", rotation: 0 });
  } else if (p.includes("SM02B") || p.includes("JST") || p.includes("HEADER") || p.includes("CONN")) {
    addBox(6.0, 4.25);
    pads.push({ name: "1", x: 1.8, y: -0.625, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "2", x: 1.8, y: 0.625, drill: 0.5, shape: "long", rotation: 0 });
    pads.push({ name: "TAB1", x: -1.3, y: -2.5, drill: 0.8, shape: "long", rotation: 0 });
    pads.push({ name: "TAB2", x: -1.3, y: 2.5, drill: 0.8, shape: "long", rotation: 0 });
  } else {
    addBox(3.0, 2.0);
    pads.push({ name: "1", x: -1.0, y: 0, drill: 0.6, shape: "square", rotation: 0 });
    pads.push({ name: "2", x: 1.0, y: 0, drill: 0.6, shape: "square", rotation: 0 });
  }

  return {
    name: pattern,
    urn: "",
    library_version: "1",
    wires,
    pads,
    text: [],
    rectangles: [],
  };
};

export const processAltiumBoardFile = (content: string): Eagle.Board => {
  // 1. Extract board outline polygon
  let polyMatch = content.match(/\|POLYGONTYPE=Polygon[^|\x00]*(\|[^|\x00]+)*\|RECORD=Board[^|\x00]*/);
  if (!polyMatch) {
    polyMatch = content.match(/\|POLYGONTYPE=Polygon[^|\x00]*(\|[^|\x00]+)*/);
  }

  const rawVertices: { vx: number, vy: number, kind: number, cx: number, cy: number, sa: number, ea: number, r: number }[] = [];
  if (polyMatch) {
    const block = polyMatch[0];
    const props: Record<string, string> = {};
    for (const part of block.split("|")) {
      const eq = part.indexOf("=");
      if (eq !== -1) props[part.slice(0, eq)] = part.slice(eq + 1).trim();
    }

    let i = 0;
    while (props[`VX${i}`] !== undefined && props[`VY${i}`] !== undefined) {
      const vx = parseMil(props[`VX${i}`]);
      const vy = parseMil(props[`VY${i}`]);
      const kind = parseInt(props[`KIND${i}`] || "0", 10);
      const cx = props[`CX${i}`] ? parseMil(props[`CX${i}`]) : 0;
      const cy = props[`CY${i}`] ? parseMil(props[`CY${i}`]) : 0;
      const sa = props[`SA${i}`] ? parseFloat(props[`SA${i}`]) : 0;
      const ea = props[`EA${i}`] ? parseFloat(props[`EA${i}`]) : 0;
      const r = props[`R${i}`] ? parseMil(props[`R${i}`]) : 0;
      rawVertices.push({ vx, vy, kind, cx, cy, sa, ea, r });
      i++;
    }
  }

  // Calculate origin offset in mil (matches Gerber: minMil - 5mil border)
  let minMilX = Infinity, minMilY = Infinity;
  for (const v of rawVertices) {
    if (v.vx < minMilX) minMilX = v.vx;
    if (v.vy < minMilY) minMilY = v.vy;
  }
  const offsetMilX = minMilX !== Infinity ? minMilX - 5 : 0;
  const offsetMilY = minMilY !== Infinity ? minMilY - 5 : 0;

  const toMmX = (mil: number) => (mil - offsetMilX) * 0.0254;
  const toMmY = (mil: number) => (mil - offsetMilY) * 0.0254;

  // Build plain wires for outline
  const plain: Eagle.Wire[] = [];
  for (let j = 0; j < rawVertices.length; j++) {
    const curr = rawVertices[j];
    const next = rawVertices[(j + 1) % rawVertices.length];

    if (curr.kind === 1 && curr.r > 0) {
      let startA = curr.sa;
      let endA = curr.ea;
      if (endA < startA) endA += 360;
      const steps = Math.max(4, Math.round(Math.abs(endA - startA) / 15));
      let prevPt = { x: toMmX(curr.vx), y: toMmY(curr.vy) };
      for (let s = 1; s <= steps; s++) {
        const angleDeg = startA + (endA - startA) * (s / steps);
        const rad = (angleDeg * Math.PI) / 180;
        const ptMilX = curr.cx + curr.r * Math.cos(rad);
        const ptMilY = curr.cy + curr.r * Math.sin(rad);
        const nextPt = { x: toMmX(ptMilX), y: toMmY(ptMilY) };
        plain.push({
          layer: "20",
          x1: prevPt.x,
          y1: prevPt.y,
          x2: nextPt.x,
          y2: nextPt.y,
          width: 0.1,
          curve: null,
        });
        prevPt = nextPt;
      }
    } else {
      if (Math.abs(curr.vx - next.vx) > 0.001 || Math.abs(curr.vy - next.vy) > 0.001) {
        plain.push({
          layer: "20",
          x1: toMmX(curr.vx),
          y1: toMmY(curr.vy),
          x2: toMmX(next.vx),
          y2: toMmY(next.vy),
          width: 0.1,
          curve: null,
        });
      }
    }
  }

  // 2. Extract components
  const components: Eagle.Component[] = [];
  const compRe = /\|(?:[A-Z0-9_]+=[^|\x00]*\|)*SOURCEDESIGNATOR=([^|\x00]+)(?:\|[A-Z0-9_]+=[^|\x00]*)*/g;
  let m;
  const seenPatterns = new Set<string>();

  while ((m = compRe.exec(content)) !== null) {
    const parts = m[0].split("|");
    const obj: Record<string, string> = {};
    for (const p of parts) {
      const eq = p.indexOf("=");
      if (eq !== -1) obj[p.slice(0, eq)] = p.slice(eq + 1).trim();
    }

    const name = obj.SOURCEDESIGNATOR;
    if (!name) continue;

    const pattern = obj.PATTERN || "Generic";
    seenPatterns.add(pattern);

    const xMil = parseMil(obj.X);
    const yMil = parseMil(obj.Y);
    const rotDeg = parseFloat(obj.ROTATION || "0");
    const isBottom = (obj.LAYER || "").toUpperCase() === "BOTTOM";

    components.push({
      name,
      package: pattern,
      library: "Altium",
      library_urn: "",
      x: toMmX(xMil),
      y: toMmY(yMil),
      rotation: ((rotDeg % 360) + 360) % 360 / 360,
      mirror: isBottom,
      smashed: false,
      attributes: [],
    });
  }

  // 3. Build library packages
  const packages: Eagle.Package[] = Array.from(seenPatterns).map(createAltiumPackage);
  const libraries: Eagle.Library[] = [{
    name: "Altium",
    urn: "",
    packages,
  }];

  // 4. Standard layers
  const layers: Eagle.Layer[] = [
    { number: "1", name: "Top", color: 4, fill: 1, visible: true, active: true },
    { number: "16", name: "Bottom", color: 4, fill: 1, visible: true, active: true },
    { number: "17", name: "Pads", color: 2, fill: 1, visible: true, active: true },
    { number: "20", name: "Dimension", color: 24, fill: 1, visible: true, active: true },
    { number: "21", name: "tPlace", color: 7, fill: 1, visible: true, active: true },
    { number: "29", name: "tStop", color: 2, fill: 1, visible: true, active: true },
  ];

  return {
    layers,
    libraries,
    plain,
    components,
    signals: [],
  };
};
