import {createContext, useContext} from "solid-js";
import {Checklist} from "../logic/types/checklist.ts";
import {Gcode} from "../logic/generators/gcode.ts";

const checklist = (): Checklist => [
    {
        title: "Computer",
        items: [
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
            {text: "Remove the ink from the board."}
        ]
    },
    {
        title: "Drilling preparation",
        items: [
            {text: "Fit Dremel drill on the printer."},
            {text: "Secure the board in the clamp with copper side up."},
            {text: "Turn on the printer."},
            {text: "Find the drill alignment holes on the board, as specified in the GUI."},
            {text: "Drill these holes manually and as accurate as possible."},
            {text: "Remove board from clamp."},
            {text: "(Optional for better drill alignment:) Put tape on top of the board top flat surface (not the sides!)."},
            {text: "Secure the board in the clamp with normal side up."},
            {text: `Home printer.`},
            {text: `Make sure the alignment holes are in the correct location (see GUI for expected coordinates).`},
        ]
    },
    {
        title: "Drilling",
        items: [
            {text: "Align print head Z-axis with board surface by adjusting the Z end-stop."},
            {
                text: `Start the '${Gcode.outputFileNames.drills_top}' print.`
                    + "During the start of this print, set Z-offset to -3.0."
                    + "\nIMPORTANT: And remove Z-stop after homing."
            },
            {text: "After print, reset Z-offset to 0.0."},
            {text: "Turn off Dremel tool."},
            {text: "Secure Z-stop back in place."},
            {text: "Remove tape from board."}
        ]
    },
    {
        title: "Silkscreen (WIP)",
        items: [
            {text: "Measure distance from clamp left side to left side of profile."},
            {text: "Make sure this distance is available on the right side of the board."},
            {text: "Flip over board and make sure the correct distance is maintained between the clamp and the profile."},
            {text: "Start 2_check_holes_cnc print if silkscreen is on copper side."},
            {text: "Start 4_check_mirrored_holes_cnc print if silkscreen is on non-copper side."},
            {text: "Adjust X axis screw for the holes."},
            {text: "Restart X_check_holes print and repeat as needed."},
            {text: "Reset Z-offset to 0.0."},
            {text: "Turn on Dremel to 14000 RPM."},
            {text: "Start 5_draw_silkscreen print."},
            {text: "Turn off printer and Dremel tool."}
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
            {text: "Remove board from clamp."}
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