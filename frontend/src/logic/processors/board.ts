import { Eagle } from "../types/eagle";
import { processEagleBoardFile } from "./eagleBoard";
import { isAltiumBoardFile, processAltiumBoardFile } from "./altiumBoard";

export { processEagleBoardFile } from "./eagleBoard";
export { isAltiumBoardFile, processAltiumBoardFile, createAltiumPackage } from "./altiumBoard";

export const processBoardFile = (content: string): Eagle.Board => {
  if (isAltiumBoardFile(content)) {
    return processAltiumBoardFile(content);
  }
  return processEagleBoardFile(content);
};
