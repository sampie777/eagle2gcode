import {createContext, useContext} from "solid-js";
import {Checklist} from "../logic/types/checklist.ts";

const checklist = (): Checklist => [
    {
        title: "Computer",
        items: [
            {
                text: "Export EAGLE files (disable Cutouts in Profile)",
                checked: false
            },
            {
                text: "Run FlatCAM scripts",
                checked: false
            },
            {
                text: "Modify GCode files",
                checked: false
            }
        ]
    },
    {
        title: "Preparation",
        items: [
            {
                text: "Mount scratcher tool on printer",
                checked: false
            },
            {
                text: "Saw the board",
                checked: false
            },
            {
                text: "Set clamp",
                checked: false
            },
            {
                text: "Clean board",
                checked: false
            },
            {
                text: "Cover the board with ink from a permanent marker",
                checked: false
            },
            {
                text: "Secure board in clamp",
                checked: false
            },
            {
                text: "Align print head Z-axis with board surface",
                checked: false
            },
            {
                text: "Adjust Z offset screw for Z-axis homing alignment with board surface",
                checked: false
            },
            {
                text: "Backup manual mesh by taking a photo of it",
                checked: false
            },
            {
                text: "Perform a manual mesh across board",
                checked: false
            }
        ]
    },
    {
        title: "Print traces",
        items: [
            {
                text: "Home all axis",
                checked: false
            },
            {
                text: "Reset Z-offset to 0.0",
                checked: false
            },
            {
                text: "Turn on scratching tool (optional)",
                checked: false
            },
            {
                text: "Start 0_draw_traces print",
                checked: false
            }
        ]
    },
    {
        title: "Etch",
        items: [
            {
                text: "Turn printer off",
                checked: false
            },
            {
                text: "Remove board from clamp",
                checked: false
            },
            {
                text: "Gentle blow off any copper dust",
                checked: false
            },
            {
                text: "Put board in etching solution",
                checked: false
            },
            {
                text: "Remove board from etching solution",
                checked: false
            },
            {
                text: "Clean the board",
                checked: false
            },
            {
                text: "Remove the ink from the board",
                checked: false
            }
        ]
    },
    {
        title: "Drilling",
        items: [
            {
                text: "Start 1_pre_drill_holes print (optional, not recommended)",
                checked: false
            },
            {
                text: "Remove board from clamp",
                checked: false
            },
            {
                text: "Put tape on top of the board (copper side) (not the sides!)",
                checked: false
            },
            {
                text: "Change Dremel bit",
                checked: false
            },
            {
                text: "Secure board in clamp (copper side up)",
                checked: false
            },
            {
                text: "Align print head Z-axis with board surface",
                checked: false
            },
            {
                text: "Turn on the printer",
                checked: false
            },
            {
                text: "Home X and Y axis",
                checked: false
            },
            {
                text: "Start 2_check_holes_cnc print",
                checked: false
            },
            {
                text: "Adjust X axis screw for the holes",
                checked: false
            },
            {
                text: "Restart 2_check_holes print and repeat as needed",
                checked: false
            },
            {
                text: "Home X and Y axis",
                checked: false
            },
            {
                text: "Start 3_drill_holes print",
                checked: false
            },
            {
                text: "During the start of this print, set Z-offset to -3.0",
                checked: false
            },
            {
                text: "And remove Z-stop after homing",
                checked: false
            },
            {
                text: "After print, reset Z-offset to 0.0",
                checked: false
            },
            {
                text: "Turn off Dremel tool",
                checked: false
            },
            {
                text: "Secure Z-stop back in place",
                checked: false
            },
            {
                text: "Remove tape from board",
                checked: false
            }
        ]
    },
    {
        title: "Silkscreen",
        items: [
            {
                text: "Measure distance from clamp left side to left side of profile",
                checked: false
            },
            {
                text: "Make sure this distance is available on the right side of the board",
                checked: false
            },
            {
                text: "Flip over board and make sure the correct distance is maintained between the clamp and the profile",
                checked: false
            },
            {
                text: "Start 2_check_holes_cnc print if silkscreen is on copper side.",
                checked: false
            },
            {
                text: "Start 4_check_mirrored_holes_cnc print if silkscreen is on non-copper side",
                checked: false
            },
            {
                text: "Adjust X axis screw for the holes",
                checked: false
            },
            {
                text: "Restart X_check_holes print and repeat as needed",
                checked: false
            },
            {
                text: "Reset Z-offset to 0.0",
                checked: false
            },
            {
                text: "Turn on Dremel to 14000 RPM",
                checked: false
            },
            {
                text: "Start 5_draw_silkscreen print",
                checked: false
            },
            {
                text: "Turn off printer and Dremel tool",
                checked: false
            }
        ]
    },
    {
        title: "Solder mask",
        items: [
            {
                text: "Remove board from clamp",
                checked: false
            },
            {
                text: "Clean the copper side of the bord with wool/alcohol",
                checked: false
            },
            {
                text: "Cover the board with the temperature resistant paint marker",
                checked: false
            },
            {
                text: "Make sure to let the marker dry really well",
                checked: false
            },
            {
                text: "Cover the board with tape",
                checked: false
            },
            {
                text: "Secure board in clamp (copper side up)",
                checked: false
            },
            {
                text: "Turn on the printer",
                checked: false
            },
            {
                text: "Adjust X axis screw for the holes",
                checked: false
            },
            {
                text: "Turn on Dremel to 14000 RPM",
                checked: false
            },
            {
                text: "Start 6_cut_solder_mask print",
                checked: false
            },
            {
                text: "After print: remove cutout tape from the pads",
                checked: false
            },
            {
                text: "Wipe board with alcohol to remove paint from pads",
                checked: false
            },
            {
                text: "Turn off printer and Dremel tool",
                checked: false
            },
            {
                text: "Remove board from clamp",
                checked: false
            }
        ]
    }
]

const resetChecklist = (to: Checklist) => {
    to.splice(0)
    checklist().forEach(it => to.push(it))
}

const defaultValue = checklist()
export const ChecklistContext = createContext<{checklist: Checklist, resetChecklist: () => void}>({
    checklist: defaultValue,
    resetChecklist: () => resetChecklist(defaultValue)
});

export const useChecklist = () => useContext(ChecklistContext)