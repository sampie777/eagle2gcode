import {createContext, useContext} from "solid-js";
import {Checklist} from "../logic/types/checklist";
import {Gcode} from "../logic/generators/gcode";

const checklist = (): Checklist => [
    {
        title: "Computer",
        items: [
            {text: "Use two ground planes in EAGLE. One with the settings width=4, isolate=12. This will make sure the ground plane reaches everywhere. And the other with the settings width=10, isolate=12. The will make sure the ground thermal pads are thick enough.", checked: true},
            {text: "Export EAGLE files using the CAM processor (disable Cutouts in Profile).", checked: true},
            {text: "Generate Flatcam commands using this GUI and paste them into Flatcam.", checked: true},
            {text: "Wait until Flatcam completes running the commands.", checked: true},
            {
                text: "On the next screen in the GUI, upload the generated .gcode files and the drill file.",
                checked: true
            },
            {text: "On the next screen, check that the generated traces. Modify the settings if necessary."},
            {text: "Download the gCode files."},
        ]
    },
    {
        title: "Etch preparation",
        items: [
            {text: "Saw the board. Leave an extra 1 mm spacing on each side."},
            {text: "With a permanent marker, put a small marking on the non copper side of the board in the corner so you will remember it's alignment when inserting it into the clamp of the printer."},
            {text: "Clean the board with alcohol."},
            {text: "Cover the board with ink from a permanent marker."},
            {text: "Mount scratcher tool on printer."},
            {text: "Install the clamp in the printer."},
            {text: "Secure the board in the clamp with the copper side up."},
        ]
    },
    {
        title: "Etch printing",
        items: [
            {text: "Home all axis."},
            {text: `Start the '${Gcode.outputFileNames.etching_bottom}' print (or top if you're doing double sided PCBs).`},
        ]
    },
    {
        title: "Etch using chemicals",
        items: [
            {text: "Turn printer off."},
            {text: "Remove board from clamp. Prevent touching the ink surface as much as possible."},
            {text: "Gentle blow off any copper dust."},
            {text: "Put the board in an etching solution."},
            {text: "Remove board from etching solution after it looks good."},
            {text: "Wash the board with water to remove the solution."},
            {text: "Remove the ink from the board."},
        ]
    },
    {
        title: "[AUTO] Drilling preparation (see manual method below)",
        items: [
            {text: "Fit Dremel drill on the printer."},
            {text: "Secure the board in the clamp with copper side up."},
            {text: "Turn on the printer."},
            {text: "Find the drill alignment holes on the board, as specified in the GUI."},
            {text: "Drill these holes manually and as accurate as possible."},
            {text: "Remove board from clamp."},
            {text: "(Optional for better drill alignment:) Put tape on top of the board top flat surface (not the sides!)."},
            {text: "Secure the board in the clamp with normal side up."},
            {text: "Home printer."},
            {text: "Get the locations of the drill for the alignment holes."},
            {text: "Insert these locations into the GUI (Drills > Offset calculation)."},
        ]
    },
    {
        title: "[AUTO] Drilling",
        items: [
            {text: "Align print head Z-axis with board surface by adjusting the Z end-stop."},
            {
                text: `Start the '${Gcode.outputFileNames.drills_top}' print.\n`
                    + "IMPORTANT: Remove Z-stop after homing."
                    + "During the start of this print (after homing), set Z-offset to -3.0.\n"
            },
            {text: "Check the first few holes, they should match the alignment hole locations."},
            {text: "After print, reset Z-offset to 0.0."},
            {text: "Turn off Dremel tool."},
            {text: "Secure Z-stop back in place."},
            {text: "Remove tape from board."},
        ]
    },
    {
        title: "[MANUAL] Drilling",
        items: [
            {text: "First, punch small holes in the center of each pad where it must be drilled. This will help align the drill bit during drilling."},
            {text: "Mount the Dremel tool in your column drill."},
            {text: "Set the Dremel tool speed to 10."},
            {text: "Mount the correct size drill bit in the tool."},
            {text: "Manually drill each hole."},
            {text: "Turn off Dremel tool."},
            {text: "Remove drill bit."},
            {text: "Repeat process for each drill size."},
        ]
    },
    {
        title: "Silkscreen",
        items: [
            {text: "Reset Z-offset to 0.0."},
            {text: "Mount scratcher tool on printer."},
            {text: "Put some extra weight on the scratcher."},
            {text: "Secure the board in the clamp with normal side up."},
            {text: "Home printer."},
            {text: "Get the locations of the drill for the alignment holes."},
            {text: "Insert these locations into the GUI (Silkscreen > Offset calculation)."},
            {text: `Start the '${Gcode.outputFileNames.silkscreen_top}' print.`},
            {text: "Check the first few holes, they should match the alignment hole locations."},
            {text: "Turn off printer."},
        ]
    },
    {
        title: "Solder mask (WIP)",
        items: [
            {text: "Remove board from clamp."},
            {text: "Clean the copper side of the bord with wool/alcohol."},
            {text: "Cover the board with the temperature resistant paint marker."},
            {text: "Make sure to let the marker dry really well."},
            {text: "Cover the board with tape."},
            {text: "Secure board in clamp (copper side up)."},
            {text: "Turn on the printer."},
            {text: "Adjust X axis screw for the holes."},
            {text: "Turn on Dremel to 14000 RPM."},
            {text: "Start 6_cut_solder_mask print."},
            {text: "After print: remove cutout tape from the pads."},
            {text: "Wipe board with alcohol to remove paint from pads."},
            {text: "Turn off printer and Dremel tool."},
            {text: "Remove board from clamp."},
        ]
    }
]

const resetChecklist = (to: Checklist) => {
    to.splice(0)
    checklist().forEach(it => to.push(it))
}

const defaultValue = checklist()
export const ChecklistContext = createContext<{ checklist: Checklist, resetChecklist: () => void }>({
    checklist: defaultValue,
    resetChecklist: () => resetChecklist(defaultValue)
});

export const useChecklist = () => useContext(ChecklistContext)