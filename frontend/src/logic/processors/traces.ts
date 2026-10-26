import { Trace } from "../types/gcode";

export const processTraces = (content: string): Trace[] => {
  const result: Trace[] = [];
  let currentTrace: Trace | null = null;
  let currentX: number | undefined;
  let currentY: number | undefined;
  let isCutting = false;

  const lines = content.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("(") || line.startsWith(";")) continue;

    // Check Z movement / cut depth: G00/G01 or Z
    const zMatch = line.match(/(?:^|\s|G0?[01])Z(-?[0-9.]+)/i);
    if (zMatch) {
      const z = parseFloat(zMatch[1]);
      if (z <= 0) {
        // Tool plunge -> start cutting
        isCutting = true;
        currentTrace = [];
        if (currentX !== undefined && currentY !== undefined) {
          currentTrace.push({ enabled: true, x: currentX, y: currentY });
        }
        result.push(currentTrace);
      } else {
        // Tool retract -> finish cutting current trace
        if (isCutting && currentTrace) {
          // If this trace connects seamlessly to the previous trace, merge them
          if (result.length >= 2) {
            const prev = result[result.length - 2];
            const curr = result[result.length - 1];
            if (prev.length > 0 && curr.length > 0) {
              const prevLast = prev[prev.length - 1];
              const currFirst = curr[0];
              if (Math.abs(prevLast.x - currFirst.x) < 0.0001 && Math.abs(prevLast.y - currFirst.y) < 0.0001) {
                for (let i = 1; i < curr.length; i++) {
                  prev.push(curr[i]);
                }
                result.pop();
              }
            }
          }
        }
        isCutting = false;
        currentTrace = null;
      }
    }

    // Check XY movement: G00/G01 or line containing X/Y coordinates
    if (/^(?:G0?[01]|[XY]-?[0-9.])/i.test(line)) {
      const xMatch = line.match(/(?:^|\s|G0?[01])X(-?[0-9.]+)/i);
      const yMatch = line.match(/(?:^|\s|X[-0-9.]+)Y(-?[0-9.]+)/i);

      if (xMatch || yMatch) {
        if (xMatch) currentX = parseFloat(xMatch[1]);
        if (yMatch) currentY = parseFloat(yMatch[1]);

        if (isCutting && currentTrace && currentX !== undefined && currentY !== undefined) {
          const lastPoint = currentTrace[currentTrace.length - 1];
          if (!lastPoint || Math.abs(lastPoint.x - currentX) >= 0.0001 || Math.abs(lastPoint.y - currentY) >= 0.0001) {
            currentTrace.push({ enabled: true, x: currentX, y: currentY });
          }
        }
      }
    }
  }

  // Handle case where file ends without explicit retract
  if (result.length >= 2) {
    const prev = result[result.length - 2];
    const curr = result[result.length - 1];
    if (prev.length > 0 && curr.length > 0) {
      const prevLast = prev[prev.length - 1];
      const currFirst = curr[0];
      if (Math.abs(prevLast.x - currFirst.x) < 0.0001 && Math.abs(prevLast.y - currFirst.y) < 0.0001) {
        for (let i = 1; i < curr.length; i++) {
          prev.push(curr[i]);
        }
        result.pop();
      }
    }
  }

  return result.filter(t => t.length > 0);
};
