import { createContext, createSignal, useContext } from "solid-js";
import { Checklist } from "../logic/types/checklist";
import { Gcode } from "../logic/generators/gcode";
import { CadType } from "../logic/flatcam";
import { Persistency } from "../logic/utils/persistency";

export const getEagleChecklist = (): Checklist => [
  {
    title: "Computer",
    items: [
      { text: "Use two ground planes in EAGLE. One with the settings width=4, isolate=12. This will make sure the ground plane reaches everywhere. And the other with the settings width=10, isolate=12. This will make sure the ground thermal pads are thick enough." },
      { text: "Export EAGLE files using the CAM processor (disable Cutouts in Profile)." },
      { text: "Generate Flatcam commands using this GUI and paste them into Flatcam." },
      { text: "Wait until Flatcam completes running the commands." },
      { text: "On the next screen in the GUI, upload the generated .gcode files and the drill file." },
      { text: "On the next screen, check that the generated traces. Modify the settings if necessary." },
      { text: "Download the gCode files." },
    ]
  },
  {
    title: "Etch preparation",
    items: [
      { text: "Saw the board. This leaves an extra 1 mm spacing on each side." },
      { text: "Clean the board with steel wool." },
      { text: "Clean the board with alcohol. From now on, don't touch the board with your fingers until you're ready to remove the ink!" },
      { text: "Clean the board with micro fibre." },
      { text: "Cover the board with permanent marker ink (from a marker or a refill bottle)." },
      { text: "With a permanent marker, put a small marking on the non copper side of the board in the corner so you will remember its alignment when inserting it into the clamp of the printer." },
      { text: "Mount scratcher tool on printer." },
      { text: "Install the clamp in the printer." },
      { text: "Secure the board in the clamp with the copper side up." },
    ]
  },
  {
    title: "Etch printing",
    items: [
      { text: "Home all axis." },
      { text: `Start the '${Gcode.outputFileNames.etching_bottom}' print (or top if you're doing double sided PCBs).` },
    ]
  },
  {
    title: "Etch using chemicals",
    items: [
      { text: "Turn printer off." },
      { text: "Remove board from clamp. Prevent touching the ink surface as much as possible!" },
      { text: "Gentle blow off any copper dust." },
      { text: "Put the board in an etching solution." },
      { text: "Remove board from etching solution after it looks good." },
      { text: "Wash the board with water to remove the solution." },
      { text: "Remove the ink from the board." },
    ]
  },
  {
    title: "[AUTO] Drilling preparation (see manual method below)",
    items: [
      { text: "Fit Dremel drill on the printer." },
      { text: "Secure the board in the clamp with copper side up." },
      { text: "Turn on the printer." },
      { text: "Find the drill alignment holes on the board, as specified in the GUI." },
      { text: "Drill these holes manually and as accurate as possible." },
      { text: "Remove board from clamp." },
      { text: "(Optional for better drill alignment:) Put tape on top of the board top flat surface (not the sides!)." },
      { text: "Secure the board in the clamp with normal side up." },
      { text: "Home printer." },
      { text: "Get the locations of the drill for the alignment holes." },
      { text: "Insert these locations into the GUI (Drills > Offset calculation)." },
    ]
  },
  {
    title: "[AUTO] Drilling",
    items: [
      { text: "Align print head Z-axis with board surface by adjusting the Z end-stop." },
      {
        text: `Start the '${Gcode.outputFileNames.drills_top}' print.\n`
          + "IMPORTANT: Remove Z-stop after homing.\n"
          + "During the start of this print (after homing), set Z-offset to -3.0.\n"
      },
      { text: "Check the first few holes, they should match the alignment hole locations." },
      { text: "After print, reset Z-offset to 0.0." },
      { text: "Turn off Dremel tool." },
      { text: "Secure Z-stop back in place." },
      { text: "Remove tape from board." },
    ]
  },
  {
    title: "[MANUAL] Drilling",
    items: [
      { text: "First, punch small holes in the center of each pad where it must be drilled. This will help align the drill bit during drilling." },
      { text: "Mount the Dremel tool in your column drill." },
      { text: "Set the Dremel tool speed to 10." },
      { text: "Mount the correct size drill bit in the tool." },
      { text: "Manually drill each hole." },
      { text: "Turn off Dremel tool." },
      { text: "Remove drill bit." },
      { text: "Repeat process for each drill size." },
    ]
  },
  {
    title: "Silkscreen",
    items: [
      { text: "Reset Z-offset to 0.0." },
      { text: "Mount scratcher tool on printer." },
      { text: "Put some extra weight on the scratcher." },
      { text: "Secure the board in the clamp with normal side up." },
      { text: "Home printer." },
      { text: "Get the locations of the drill for the alignment holes." },
      { text: "Insert these locations into the GUI (Silkscreen > Offset calculation)." },
      { text: `Start the '${Gcode.outputFileNames.silkscreen_top}' print.` },
      { text: "Check the first few holes, they should match the alignment hole locations." },
      { text: "Turn off printer." },
    ]
  },
  {
    title: "Solder mask (WIP)",
    items: [
      { text: "Remove board from clamp." },
      { text: "Clean the copper side of the bord with wool/alcohol." },
      { text: "Cover the board with the temperature resistant paint marker." },
      { text: "Make sure to let the marker dry really well." },
      { text: "Cover the board with tape." },
      { text: "Secure board in clamp (copper side up)." },
      { text: "Turn on the printer." },
      { text: "Adjust X axis screw for the holes." },
      { text: "Turn on Dremel to 14000 RPM." },
      { text: "Start 6_cut_solder_mask print." },
      { text: "After print: remove cutout tape from the pads." },
      { text: "Wipe board with alcohol to remove paint from pads." },
      { text: "Turn off printer and Dremel tool." },
      { text: "Remove board from clamp." },
    ]
  }
];

export const getAltiumChecklist = (): Checklist => [
  {
    title: "Computer",
    items: [
      { text: "In Altium Designer, ensure polygon pours / ground planes are properly repoured before export." },
      { text: "In Gerber / Fabrication Outputs setup, ensure units are set to Millimeters (mm) instead of Inches (Gerber Units: Millimeters, Format: 4:4 or higher)." },
      { text: "Export Altium Gerber files (Profile, Copper Signal Top/Bot, Legend Top/Bot, Soldermask Top/Bot) and NC Drill files." },
      { text: "Generate Flatcam commands using this GUI (Altium tab) and paste them into Flatcam." },
      { text: "Wait until Flatcam completes running the commands." },
      { text: "On the next screen in the GUI, upload the generated .gcode files and the drill file." },
      { text: "On the next screen, check that the generated traces. Modify the settings if necessary." },
      { text: "Download the gCode files." },
    ]
  },
  {
    title: "Etch preparation",
    items: [
      { text: "Saw the board. This leaves an extra 1 mm spacing on each side." },
      { text: "Clean the board with steel wool." },
      { text: "Clean the board with alcohol. From now on, don't touch the board with your fingers until you're ready to remove the ink!" },
      { text: "Clean the board with micro fibre." },
      { text: "Cover the board with permanent marker ink (from a marker or a refill bottle)." },
      { text: "With a permanent marker, put a small marking on the non copper side of the board in the corner so you will remember its alignment when inserting it into the clamp of the printer." },
      { text: "Mount scratcher tool on printer." },
      { text: "Install the clamp in the printer." },
      { text: "Secure the board in the clamp with the copper side up." },
    ]
  },
  {
    title: "Etch printing",
    items: [
      { text: "Home all axis." },
      { text: `Start the '${Gcode.outputFileNames.etching_bottom}' print (or top if you're doing double sided PCBs).` },
    ]
  },
  {
    title: "Etch using chemicals",
    items: [
      { text: "Turn printer off." },
      { text: "Remove board from clamp. Prevent touching the ink surface as much as possible!" },
      { text: "Gentle blow off any copper dust." },
      { text: "Put the board in an etching solution." },
      { text: "Remove board from etching solution after it looks good." },
      { text: "Wash the board with water to remove the solution." },
      { text: "Remove the ink from the board." },
    ]
  },
  {
    title: "[AUTO] Drilling preparation (see manual method below)",
    items: [
      { text: "Fit Dremel drill on the printer." },
      { text: "Secure the board in the clamp with copper side up." },
      { text: "Turn on the printer." },
      { text: "Find the drill alignment holes on the board, as specified in the GUI." },
      { text: "Drill these holes manually and as accurate as possible." },
      { text: "Remove board from clamp." },
      { text: "(Optional for better drill alignment:) Put tape on top of the board top flat surface (not the sides!)." },
      { text: "Secure the board in the clamp with normal side up." },
      { text: "Home printer." },
      { text: "Get the locations of the drill for the alignment holes." },
      { text: "Insert these locations into the GUI (Drills > Offset calculation)." },
    ]
  },
  {
    title: "[AUTO] Drilling",
    items: [
      { text: "Align print head Z-axis with board surface by adjusting the Z end-stop." },
      {
        text: `Start the '${Gcode.outputFileNames.drills_top}' print.\n`
          + "IMPORTANT: Remove Z-stop after homing.\n"
          + "During the start of this print (after homing), set Z-offset to -3.0.\n"
      },
      { text: "Check the first few holes, they should match the alignment hole locations." },
      { text: "After print, reset Z-offset to 0.0." },
      { text: "Turn off Dremel tool." },
      { text: "Secure Z-stop back in place." },
      { text: "Remove tape from board." },
    ]
  },
  {
    title: "[MANUAL] Drilling",
    items: [
      { text: "First, punch small holes in the center of each pad where it must be drilled. This will help align the drill bit during drilling." },
      { text: "Mount the Dremel tool in your column drill." },
      { text: "Set the Dremel tool speed to 10." },
      { text: "Mount the correct size drill bit in the tool." },
      { text: "Manually drill each hole." },
      { text: "Turn off Dremel tool." },
      { text: "Remove drill bit." },
      { text: "Repeat process for each drill size." },
    ]
  },
  {
    title: "Silkscreen",
    items: [
      { text: "Reset Z-offset to 0.0." },
      { text: "Mount scratcher tool on printer." },
      { text: "Put some extra weight on the scratcher." },
      { text: "Secure the board in the clamp with normal side up." },
      { text: "Home printer." },
      { text: "Get the locations of the drill for the alignment holes." },
      { text: "Insert these locations into the GUI (Silkscreen > Offset calculation)." },
      { text: `Start the '${Gcode.outputFileNames.silkscreen_top}' print.` },
      { text: "Check the first few holes, they should match the alignment hole locations." },
      { text: "Turn off printer." },
    ]
  },
  {
    title: "Solder mask (WIP)",
    items: [
      { text: "Remove board from clamp." },
      { text: "Clean the copper side of the bord with wool/alcohol." },
      { text: "Cover the board with the temperature resistant paint marker." },
      { text: "Make sure to let the marker dry really well." },
      { text: "Cover the board with tape." },
      { text: "Secure board in clamp (copper side up)." },
      { text: "Turn on the printer." },
      { text: "Adjust X axis screw for the holes." },
      { text: "Turn on Dremel to 14000 RPM." },
      { text: "Start 6_cut_solder_mask print." },
      { text: "After print: remove cutout tape from the pads." },
      { text: "Wipe board with alcohol to remove paint from pads." },
      { text: "Turn off printer and Dremel tool." },
      { text: "Remove board from clamp." },
    ]
  }
];

export const getChecklistForCad = (cadType: CadType): Checklist => {
  return cadType === "altium" ? getAltiumChecklist() : getEagleChecklist();
};

const getInitialCad = (): CadType => {
  const loaded = Persistency.loadAll()?.cadType;
  if (loaded === "altium" || loaded === "eagle") return loaded;

  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("project.selectedCad");
    if (saved === "altium") return "altium";
  }
  return "eagle";
};

const getInitialChecklist = (): Checklist => {
  const loaded = Persistency.loadAll()?.checklist;
  if (loaded && Array.isArray(loaded) && loaded.length > 0) {
    return loaded;
  }
  return getChecklistForCad(getInitialCad());
};

const [activeCad, setActiveCad] = createSignal<CadType>(getInitialCad());
const [currentChecklist, setCurrentChecklist] = createSignal<Checklist>(getInitialChecklist());

export const resetChecklist = () => {
  setCurrentChecklist(getChecklistForCad(activeCad()));
};

export const setChecklistCad = (cad: CadType) => {
  setActiveCad(cad);
  setCurrentChecklist(getChecklistForCad(cad));
};

export const restoreChecklist = (savedChecklist?: Checklist, cad?: CadType) => {
  if (cad) {
    setActiveCad(cad);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("project.selectedCad", cad);
    }
  }
  if (savedChecklist && Array.isArray(savedChecklist) && savedChecklist.length > 0) {
    setCurrentChecklist(JSON.parse(JSON.stringify(savedChecklist)));
  } else if (cad) {
    setCurrentChecklist(getChecklistForCad(cad));
  }
};

export const ChecklistContext = createContext<{
  checklist: () => Checklist,
  activeCad: () => CadType,
  setCad: (cad: CadType) => void,
  resetChecklist: () => void,
  restoreChecklist: (savedChecklist?: Checklist, cad?: CadType) => void,
}>({
  checklist: currentChecklist,
  activeCad: activeCad,
  setCad: setChecklistCad,
  resetChecklist: resetChecklist,
  restoreChecklist: restoreChecklist,
});

export const useChecklist = () => useContext(ChecklistContext);
