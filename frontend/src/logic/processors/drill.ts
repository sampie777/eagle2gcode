import { Drill } from "../types/cam";
import { Gerber } from "./gerberutils";

export const processExcellonDrillFile = (content: string): Drill[] => {
  const result: Drill[] = [];
  const toolSizes: { [key: string]: number } = {};
  let unitFactor = 1 / 1000;
  let lastLocation = { x: 0, y: 0 };
  let lastTool = "";

  const storeFactor = (line: string) => {
    const match = line.match(/^(.+),(.+),(.+)$/);
    if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`);

    const [_, unit, tz, factor] = match;
    unitFactor = 1 / Math.pow(10, factor.split(".")[1].length);
    if (unit.toLowerCase() != "metric") {
      unitFactor /= 39.3701;  // mil to mm
    }
  };

  const storeNewTool = (line: string) => {
    const match = line.match(/^T(\d+)C(.*?)$/);
    if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`);

    const [_, tool, size] = match;
    toolSizes[tool] = +size;
  };

  const useNewLocation = (line: string) => {
    const match = line.match(/^X(-?\d+)Y(-?\d+)$/);
    if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`);

    const [_, x, y] = match;
    lastLocation = { x: +x * unitFactor, y: +y * unitFactor };

    result.push({
      x: lastLocation.x,
      y: lastLocation.y,
      size: toolSizes[lastTool],
    });
  };

  const useNewTool = (line: string) => {
    const match = line.match(/^T(\d+)$/);
    if (match == null) throw new Error(`Could not process line due to unknown structure: '${line}'`);

    const [_, tool] = match;
    lastTool = tool;
  };

  content
    .split("\n")
    .forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^.+,.+,\d+\.\d+/)) return storeFactor(trimmed);
      if (trimmed.match(/^T\d+C\d+/)) return storeNewTool(trimmed);
      if (trimmed.match(/^[XY]\d+/)) return useNewLocation(trimmed);
      if (trimmed.match(/^T\d+$/)) return useNewTool(trimmed);
    });

  return result;
};

export const processGerberDrillFile = (content: string): Drill[] => {
  const config = Gerber.preprocessGerberFile(content);
  const result: Drill[] = [];
  let currentApertureId = "";
  let currentX = 0;
  let currentY = 0;

  const getToolSize = (apertureId: string): number => {
    const ap = config.apertures[apertureId];
    if (!ap) return 0.8;
    if ("diameter" in ap) return ap.diameter;
    if ("width" in ap) return ap.width;
    return 0.8;
  };

  content
    .replace(/%/g, "")
    .split("\n")
    .forEach(rawLine => {
      const line = rawLine.trim();
      if (!line) return;

      // Standalone Flash: D03* or D3*
      if (line === "D03*" || line === "D3*") {
        result.push({
          x: currentX,
          y: currentY,
          size: getToolSize(currentApertureId),
        });
        return;
      }

      // Aperture selection, e.g. D26* (standard aperture numbers in Gerber start at D10)
      const apertureMatch = line.match(/^D(\d+)\*?$/);
      if (apertureMatch) {
        const num = +apertureMatch[1];
        if (num >= 10) {
          currentApertureId = apertureMatch[1];
        }
        return;
      }

      // Coordinate move or flash: X...Y...D02* or X...Y...D03* or X...D02*, etc.
      const coordMatch = line.match(/^(?:X(-?\d+))?(?:Y(-?\d+))?(?:D0?([123]))?\*?$/);
      if (coordMatch && (coordMatch[1] !== undefined || coordMatch[2] !== undefined)) {
        if (coordMatch[1] !== undefined) {
          currentX = +coordMatch[1] * config.unitFactor;
        }
        if (coordMatch[2] !== undefined) {
          currentY = +coordMatch[2] * config.unitFactor;
        }

        const op = coordMatch[3];
        if (op === "3") {
          result.push({
            x: currentX,
            y: currentY,
            size: getToolSize(currentApertureId),
          });
        }
      }
    });

  return result;
};

export const processDrillFile = (content: string): Drill[] => {
  // If it contains Gerber format markers like %FS or %MO or %ADD, treat as Gerber drill
  if (content.includes("%FS") || content.includes("%MO") || content.includes("%ADD")) {
    return processGerberDrillFile(content);
  }
  return processExcellonDrillFile(content);
};
