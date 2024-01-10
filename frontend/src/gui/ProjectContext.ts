import {createContext, useContext} from "solid-js";
import {Project} from "../logic/types/project.ts";

export const emptyProject: Project = {
    isLoaded: false,
    board: {
        layers: [],
        libraries: [],
        plain: [],
        components: [],
        signals: [],
    },
    job: {
        title: "No project loaded",
        width: 0,
        height: 0,
    },
    profile: [],
    copper_top: [],
    copper_bottom: [],
    soldermask_top: [],
    soldermask_bottom: [],
    silkscreen_top: [],
    silkscreen_bottom: [],
    drills: [],
};

export const exampleProject: Project = {
    isLoaded: true,
    board: {
        layers: [
            {
                number: "1",
                name: "Top",
                color: 4,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "16",
                name: "Bottom",
                color: 1,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "17",
                name: "Pads",
                color: 2,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "18",
                name: "Vias",
                color: 2,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "19",
                name: "Unrouted",
                color: 6,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "20",
                name: "Dimension",
                color: 24,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "21",
                name: "tPlace",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "22",
                name: "bPlace",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "23",
                name: "tOrigins",
                color: 15,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "24",
                name: "bOrigins",
                color: 15,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "25",
                name: "tNames",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "26",
                name: "bNames",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "27",
                name: "tValues",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "28",
                name: "bValues",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "29",
                name: "tStop",
                color: 7,
                fill: 3,
                visible: false,
                active: true
            },
            {
                number: "30",
                name: "bStop",
                color: 7,
                fill: 6,
                visible: false,
                active: true
            },
            {
                number: "31",
                name: "tCream",
                color: 7,
                fill: 4,
                visible: false,
                active: true
            },
            {
                number: "32",
                name: "bCream",
                color: 7,
                fill: 5,
                visible: false,
                active: true
            },
            {
                number: "33",
                name: "tFinish",
                color: 6,
                fill: 3,
                visible: false,
                active: true
            },
            {
                number: "34",
                name: "bFinish",
                color: 6,
                fill: 6,
                visible: false,
                active: true
            },
            {
                number: "35",
                name: "tGlue",
                color: 7,
                fill: 4,
                visible: false,
                active: true
            },
            {
                number: "36",
                name: "bGlue",
                color: 7,
                fill: 5,
                visible: false,
                active: true
            },
            {
                number: "37",
                name: "tTest",
                color: 7,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "38",
                name: "bTest",
                color: 7,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "39",
                name: "tKeepout",
                color: 4,
                fill: 11,
                visible: true,
                active: true
            },
            {
                number: "40",
                name: "bKeepout",
                color: 1,
                fill: 11,
                visible: true,
                active: true
            },
            {
                number: "41",
                name: "tRestrict",
                color: 4,
                fill: 10,
                visible: true,
                active: true
            },
            {
                number: "42",
                name: "bRestrict",
                color: 1,
                fill: 10,
                visible: true,
                active: true
            },
            {
                number: "43",
                name: "vRestrict",
                color: 2,
                fill: 10,
                visible: true,
                active: true
            },
            {
                number: "44",
                name: "Drills",
                color: 7,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "45",
                name: "Holes",
                color: 7,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "46",
                name: "Milling",
                color: 3,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "47",
                name: "Measures",
                color: 7,
                fill: 1,
                visible: false,
                active: true
            },
            {
                number: "48",
                name: "Document",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "49",
                name: "Reference",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "51",
                name: "tDocu",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "52",
                name: "bDocu",
                color: 7,
                fill: 1,
                visible: true,
                active: true
            },
            {
                number: "88",
                name: "SimResults",
                color: 9,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "89",
                name: "SimProbes",
                color: 9,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "90",
                name: "Modules",
                color: 5,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "91",
                name: "Nets",
                color: 2,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "92",
                name: "Busses",
                color: 1,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "93",
                name: "Pins",
                color: 2,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "94",
                name: "Symbols",
                color: 4,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "95",
                name: "Names",
                color: 7,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "96",
                name: "Values",
                color: 7,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "97",
                name: "Info",
                color: 7,
                fill: 1,
                visible: false,
                active: false
            },
            {
                number: "98",
                name: "Guide",
                color: 6,
                fill: 1,
                visible: false,
                active: false
            }
        ],
        libraries: [
            {
                name: "rcl",
                urn: "urn:adsk.eagle:library:334",
                packages: [
                    {
                        name: "C025-040X050",
                        urn: "urn:adsk.eagle:footprint:23139/1",
                        library_version: "11",
                        wires: [
                            {
                                layer: "21",
                                x1: -2.159,
                                y1: 1.905,
                                x2: 2.159,
                                y2: 1.905,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.159,
                                y1: -1.905,
                                x2: -2.159,
                                y2: -1.905,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.413,
                                y1: 1.651,
                                x2: 2.413,
                                y2: -1.651,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.413,
                                y1: 1.651,
                                x2: -2.413,
                                y2: -1.651,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.159,
                                y1: 1.905,
                                x2: 2.413,
                                y2: 1.651,
                                width: 0.1524,
                                curve: -90
                            },
                            {
                                layer: "21",
                                x1: -2.413,
                                y1: 1.651,
                                x2: -2.159,
                                y2: 1.905,
                                width: 0.1524,
                                curve: -90
                            },
                            {
                                layer: "21",
                                x1: 2.159,
                                y1: -1.905,
                                x2: 2.413,
                                y2: -1.651,
                                width: 0.1524,
                                curve: 90
                            },
                            {
                                layer: "21",
                                x1: -2.413,
                                y1: -1.651,
                                x2: -2.159,
                                y2: -1.905,
                                width: 0.1524,
                                curve: 90
                            },
                            {
                                layer: "51",
                                x1: 0.762,
                                y1: 0,
                                x2: 0.381,
                                y2: 0,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0.381,
                                y1: 0,
                                x2: 0.254,
                                y2: 0,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0.254,
                                y1: 0,
                                x2: 0.254,
                                y2: 0.762,
                                width: 0.254,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0.254,
                                y1: 0,
                                x2: 0.254,
                                y2: -0.762,
                                width: 0.254,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -0.254,
                                y1: 0.762,
                                x2: -0.254,
                                y2: 0,
                                width: 0.254,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -0.254,
                                y1: 0,
                                x2: -0.254,
                                y2: -0.762,
                                width: 0.254,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -0.254,
                                y1: 0,
                                x2: -0.381,
                                y2: 0,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "51",
                                x1: -0.381,
                                y1: 0,
                                x2: -0.762,
                                y2: 0,
                                width: 0.1524,
                                curve: null
                            }
                        ],
                        pads: [
                            {
                                name: "1",
                                x: -1.27,
                                y: 0,
                                drill: 0.8128,
                                shape: "octagon",
                                rotation: null
                            },
                            {
                                name: "2",
                                x: 1.27,
                                y: 0,
                                drill: 0.8128,
                                shape: "octagon",
                                rotation: null
                            }
                        ],
                        text: [
                            {
                                x: -2.286,
                                y: 2.159,
                                size: 1.27,
                                ratio: 10,
                                layer: "25",
                                rotation: null,
                                value: ">NAME"
                            },
                            {
                                x: -2.286,
                                y: -3.429,
                                size: 1.27,
                                ratio: 10,
                                layer: "27",
                                rotation: null,
                                value: ">VALUE"
                            }
                        ],
                        rectangles: []
                    },
                    {
                        name: "0204/7",
                        urn: "urn:adsk.eagle:footprint:22998/1",
                        library_version: "11",
                        wires: [
                            {
                                layer: "51",
                                x1: 3.81,
                                y1: 0,
                                x2: 2.921,
                                y2: 0,
                                width: 0.508,
                                curve: null
                            },
                            {
                                layer: "51",
                                x1: -3.81,
                                y1: 0,
                                x2: -2.921,
                                y2: 0,
                                width: 0.508,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.54,
                                y1: 0.762,
                                x2: -2.286,
                                y2: 1.016,
                                width: 0.1524,
                                curve: -90
                            },
                            {
                                layer: "21",
                                x1: -2.54,
                                y1: -0.762,
                                x2: -2.286,
                                y2: -1.016,
                                width: 0.1524,
                                curve: 90
                            },
                            {
                                layer: "21",
                                x1: 2.286,
                                y1: -1.016,
                                x2: 2.54,
                                y2: -0.762,
                                width: 0.1524,
                                curve: 90
                            },
                            {
                                layer: "21",
                                x1: 2.286,
                                y1: 1.016,
                                x2: 2.54,
                                y2: 0.762,
                                width: 0.1524,
                                curve: -90
                            },
                            {
                                layer: "21",
                                x1: -2.54,
                                y1: -0.762,
                                x2: -2.54,
                                y2: 0.762,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.286,
                                y1: 1.016,
                                x2: -1.905,
                                y2: 1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -1.778,
                                y1: 0.889,
                                x2: -1.905,
                                y2: 1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.286,
                                y1: -1.016,
                                x2: -1.905,
                                y2: -1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -1.778,
                                y1: -0.889,
                                x2: -1.905,
                                y2: -1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.778,
                                y1: 0.889,
                                x2: 1.905,
                                y2: 1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.778,
                                y1: 0.889,
                                x2: -1.778,
                                y2: 0.889,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.778,
                                y1: -0.889,
                                x2: 1.905,
                                y2: -1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.778,
                                y1: -0.889,
                                x2: -1.778,
                                y2: -0.889,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.286,
                                y1: 1.016,
                                x2: 1.905,
                                y2: 1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.286,
                                y1: -1.016,
                                x2: 1.905,
                                y2: -1.016,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.54,
                                y1: -0.762,
                                x2: 2.54,
                                y2: 0.762,
                                width: 0.1524,
                                curve: null
                            }
                        ],
                        pads: [
                            {
                                name: "1",
                                x: -3.81,
                                y: 0,
                                drill: 0.8128,
                                shape: "octagon",
                                rotation: null
                            },
                            {
                                name: "2",
                                x: 3.81,
                                y: 0,
                                drill: 0.8128,
                                shape: "octagon",
                                rotation: null
                            }
                        ],
                        text: [
                            {
                                x: -2.54,
                                y: 1.2954,
                                size: 0.9906,
                                ratio: 10,
                                layer: "25",
                                rotation: null,
                                value: ">NAME"
                            },
                            {
                                x: -1.6256,
                                y: -0.4826,
                                size: 0.9906,
                                ratio: 10,
                                layer: "27",
                                rotation: null,
                                value: ">VALUE"
                            }
                        ],
                        rectangles: [
                            {
                                layer: "21",
                                x1: 2.54,
                                y1: -0.254,
                                x2: 2.921,
                                y2: 0.254
                            },
                            {
                                layer: "21",
                                x1: -2.921,
                                y1: -0.254,
                                x2: -2.54,
                                y2: 0.254
                            }
                        ]
                    }
                ]
            },
            {
                name: "pinhead",
                urn: "urn:adsk.eagle:library:325",
                packages: [
                    {
                        name: "1X02",
                        urn: "urn:adsk.eagle:footprint:22309/1",
                        library_version: "4",
                        wires: [
                            {
                                layer: "21",
                                x1: -1.905,
                                y1: 1.27,
                                x2: -0.635,
                                y2: 1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -0.635,
                                y1: 1.27,
                                x2: 0,
                                y2: 0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0,
                                y1: 0.635,
                                x2: 0,
                                y2: -0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0,
                                y1: -0.635,
                                x2: -0.635,
                                y2: -1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.54,
                                y1: 0.635,
                                x2: -2.54,
                                y2: -0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -1.905,
                                y1: 1.27,
                                x2: -2.54,
                                y2: 0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -2.54,
                                y1: -0.635,
                                x2: -1.905,
                                y2: -1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: -0.635,
                                y1: -1.27,
                                x2: -1.905,
                                y2: -1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0,
                                y1: 0.635,
                                x2: 0.635,
                                y2: 1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0.635,
                                y1: 1.27,
                                x2: 1.905,
                                y2: 1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.905,
                                y1: 1.27,
                                x2: 2.54,
                                y2: 0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.54,
                                y1: 0.635,
                                x2: 2.54,
                                y2: -0.635,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 2.54,
                                y1: -0.635,
                                x2: 1.905,
                                y2: -1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 1.905,
                                y1: -1.27,
                                x2: 0.635,
                                y2: -1.27,
                                width: 0.1524,
                                curve: null
                            },
                            {
                                layer: "21",
                                x1: 0.635,
                                y1: -1.27,
                                x2: 0,
                                y2: -0.635,
                                width: 0.1524,
                                curve: null
                            }
                        ],
                        pads: [
                            {
                                name: "1",
                                x: -1.27,
                                y: 0,
                                drill: 1.016,
                                shape: "long",
                                rotation: 0.25
                            },
                            {
                                name: "2",
                                x: 1.27,
                                y: 0,
                                drill: 1.016,
                                shape: "long",
                                rotation: 0.25
                            }
                        ],
                        text: [
                            {
                                x: -2.6162,
                                y: 1.8288,
                                size: 1.27,
                                ratio: 10,
                                layer: "25",
                                rotation: null,
                                value: ">NAME"
                            },
                            {
                                x: -2.54,
                                y: -3.175,
                                size: 1.27,
                                ratio: 0,
                                layer: "27",
                                rotation: null,
                                value: ">VALUE"
                            }
                        ],
                        rectangles: [
                            {
                                layer: "51",
                                x1: -1.524,
                                y1: -0.254,
                                x2: -1.016,
                                y2: 0.254
                            },
                            {
                                layer: "51",
                                x1: 1.016,
                                y1: -0.254,
                                x2: 1.524,
                                y2: 0.254
                            }
                        ]
                    }
                ]
            }
        ],
        plain: [
            {
                layer: "20",
                x1: 0,
                y1: 0,
                x2: 15.24,
                y2: 0,
                width: 0,
                curve: null
            },
            {
                layer: "20",
                x1: 15.24,
                y1: 0,
                x2: 15.24,
                y2: 16.51,
                width: 0,
                curve: null
            },
            {
                layer: "20",
                x1: 15.24,
                y1: 16.51,
                x2: 0,
                y2: 16.51,
                width: 0,
                curve: null
            },
            {
                layer: "20",
                x1: 0,
                y1: 16.51,
                x2: 0,
                y2: 0,
                width: 0,
                curve: null
            }
        ],
        components: [
            {
                name: "C1",
                library: "rcl",
                library_urn: "urn:adsk.eagle:library:334",
                package: "C025-040X050",
                x: 10.16,
                y: 3.81,
                rotation: null,
                attributes: [
                    {
                        layer: "25",
                        display: true,
                        name: "NAME",
                        x: 7.874,
                        y: 5.969,
                        size: 1.27,
                        ratio: 10,
                        rotation: null,
                        value: null
                    },
                    {
                        layer: "27",
                        display: false,
                        name: "POPULARITY",
                        x: 25.4,
                        y: 1.27,
                        size: 1.778,
                        ratio: null,
                        rotation: null,
                        value: "4"
                    },
                    {
                        layer: "27",
                        display: false,
                        name: "SPICEPREFIX",
                        x: 25.4,
                        y: 1.27,
                        size: 1.778,
                        ratio: null,
                        rotation: null,
                        value: "C"
                    },
                    {
                        layer: "27",
                        display: true,
                        name: "VALUE",
                        x: 7.874,
                        y: 0.381,
                        size: 1.27,
                        ratio: 10,
                        rotation: null,
                        value: null
                    }
                ],
                smashed: true
            },
            {
                name: "LED",
                library: "pinhead",
                library_urn: "urn:adsk.eagle:library:325",
                package: "1X02",
                x: 10.16,
                y: 11.43,
                rotation: null,
                attributes: [
                    {
                        layer: "25",
                        display: true,
                        name: "NAME",
                        x: 7.5438,
                        y: 13.2588,
                        size: 1.27,
                        ratio: 10,
                        rotation: null,
                        value: null
                    },
                    {
                        layer: "27",
                        display: false,
                        name: "POPULARITY",
                        x: 26.67,
                        y: 2.54,
                        size: 1.778,
                        ratio: null,
                        rotation: null,
                        value: "98"
                    },
                    {
                        layer: "27",
                        display: true,
                        name: "VALUE",
                        x: 7.62,
                        y: 8.255,
                        size: 1.27,
                        ratio: null,
                        rotation: null,
                        value: null
                    }
                ],
                smashed: true
            },
            {
                name: "R1",
                library: "rcl",
                library_urn: "urn:adsk.eagle:library:334",
                package: "0204/7",
                x: 3.81,
                y: 7.62,
                rotation: 0.25,
                attributes: [
                    {
                        layer: "25",
                        display: true,
                        name: "NAME",
                        x: 2.5146,
                        y: 5.08,
                        size: 0.9906,
                        ratio: 10,
                        rotation: 0.25,
                        value: null
                    },
                    {
                        layer: "27",
                        display: false,
                        name: "POPULARITY",
                        x: 17.78,
                        y: 25.4,
                        size: 1.778,
                        ratio: null,
                        rotation: 0.25,
                        value: "79"
                    },
                    {
                        layer: "27",
                        display: false,
                        name: "SPICEPREFIX",
                        x: 17.78,
                        y: 25.4,
                        size: 1.778,
                        ratio: null,
                        rotation: 0.25,
                        value: "R"
                    },
                    {
                        layer: "27",
                        display: true,
                        name: "VALUE",
                        x: 4.2926,
                        y: 5.9944,
                        size: 0.9906,
                        ratio: 10,
                        rotation: 0.25,
                        value: null
                    }
                ],
                smashed: true
            }
        ],
        signals: [
            {
                name: "+5V",
                wires: [],
                contacts: [
                    {
                        component: "LED",
                        pad: "1"
                    }
                ]
            },
            {
                name: "N$1",
                wires: [
                    {
                        layer: "1",
                        x1: 11.43,
                        y1: 3.81,
                        x2: 11.43,
                        y2: 7.62,
                        width: 0.508,
                        curve: null
                    },
                    {
                        layer: "1",
                        x1: 11.43,
                        y1: 7.62,
                        x2: 11.43,
                        y2: 11.43,
                        width: 0.508,
                        curve: null
                    },
                    {
                        layer: "1",
                        x1: 3.81,
                        y1: 11.43,
                        x2: 7.62,
                        y2: 7.62,
                        width: 0.508,
                        curve: null
                    },
                    {
                        layer: "1",
                        x1: 7.62,
                        y1: 7.62,
                        x2: 11.43,
                        y2: 7.62,
                        width: 0.508,
                        curve: null
                    }
                ],
                contacts: [
                    {
                        component: "LED",
                        pad: "2"
                    },
                    {
                        component: "R1",
                        pad: "2"
                    },
                    {
                        component: "C1",
                        pad: "2"
                    }
                ]
            },
            {
                name: "GND",
                wires: [
                    {
                        layer: "1",
                        x1: 3.81,
                        y1: 3.81,
                        x2: 8.89,
                        y2: 3.81,
                        width: 0.508,
                        curve: null
                    }
                ],
                contacts: [
                    {
                        component: "C1",
                        pad: "1"
                    },
                    {
                        component: "R1",
                        pad: "1"
                    }
                ]
            }
        ]
    },
    job: {
        title: "untitled",
        width: 15.24,
        height: 16.51
    },
    profile: [
        {
            x: 0,
            y: 0,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 15.24,
            y: 0,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 15.24,
            y: 16.51,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 0,
            y: 16.51,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 0,
            y: 0,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        }
    ],
    copper_top: [
        {
            x: 8.89,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 11.43,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 8.89,
            y: 10.668000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 8.89,
            y: 12.192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 11.43,
            y: 12.192,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 11.43,
            y: 10.668000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 3.81,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 112.5
            }
        },
        {
            x: 3.81,
            y: 11.43,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 112.5
            }
        },
        {
            x: 11.43,
            y: 7.62,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 11.43,
            y: 3.81,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 11.43,
            y: 7.62,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 11.43,
            y: 11.43,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 7.62,
            y: 7.62,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 3.81,
            y: 11.43,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 7.62,
            y: 7.62,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 11.43,
            y: 7.62,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 8.89,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        },
        {
            x: 3.81,
            y: 3.81,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.508
            }
        }
    ],
    copper_bottom: [
        {
            x: 8.89,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 11.43,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 8.89,
            y: 10.668000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 8.89,
            y: 12.192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 11.43,
            y: 12.192,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 11.43,
            y: 10.668000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.524
            }
        },
        {
            x: 3.81,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 112.5
            }
        },
        {
            x: 3.81,
            y: 11.43,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.429621,
                vertices: 8,
                rotation: 112.5
            }
        }
    ],
    soldermask_top: [
        {
            x: 8.89,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 11.43,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 8.89,
            y: 10.668000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 8.89,
            y: 12.192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 11.43,
            y: 12.192,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 11.43,
            y: 10.668000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 3.81,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 112.5
            }
        },
        {
            x: 3.81,
            y: 11.43,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 112.5
            }
        }
    ],
    soldermask_bottom: [
        {
            x: 8.89,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 11.43,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 22.5
            }
        },
        {
            x: 8.89,
            y: 10.668000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 8.89,
            y: 12.192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 11.43,
            y: 12.192,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 11.43,
            y: 10.668000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 1.7272
            }
        },
        {
            x: 3.81,
            y: 3.81,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 112.5
            }
        },
        {
            x: 3.81,
            y: 11.43,
            operation: "flash",
            aperture: {
                shape: "polygon",
                diameter: 1.649562,
                vertices: 8,
                rotation: 112.5
            }
        }
    ],
    silkscreen_top: [
        {
            x: 8.001000000000001,
            y: 5.715,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.319,
            y: 5.715,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.319,
            y: 1.905,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.001000000000001,
            y: 1.905,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.573,
            y: 2.1590000000000003,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.573,
            y: 5.461,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747000000000001,
            y: 5.461,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747000000000001,
            y: 2.1590000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.319,
            y: 5.715,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.329,
            y: 5.7148,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3389,
            y: 5.7142,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3489,
            y: 5.7132000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3587,
            y: 5.7119,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3686,
            y: 5.710100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.378300000000001,
            y: 5.708,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3879,
            y: 5.705500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3975,
            y: 5.7026,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4069,
            y: 5.6993,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4162,
            y: 5.6957,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4253,
            y: 5.6917,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4343,
            y: 5.6873000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.443100000000001,
            y: 5.6826,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4517,
            y: 5.6776,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4601,
            y: 5.6722,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.468300000000001,
            y: 5.6665,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4762,
            y: 5.6605,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.484,
            y: 5.654100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4914,
            y: 5.6475,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.498600000000001,
            y: 5.6406,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.505500000000001,
            y: 5.6334,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5121,
            y: 5.626,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.518500000000001,
            y: 5.6182,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5245,
            y: 5.6103000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5302,
            y: 5.6021,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5356,
            y: 5.5937,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.540600000000001,
            y: 5.585100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.545300000000001,
            y: 5.576300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.549700000000001,
            y: 5.5673,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.553700000000001,
            y: 5.5582,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.557300000000001,
            y: 5.548900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5606,
            y: 5.5395,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.563500000000001,
            y: 5.5299000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.566,
            y: 5.520300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.568100000000001,
            y: 5.5106,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5699,
            y: 5.5007,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.571200000000001,
            y: 5.4909,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5722,
            y: 5.4809,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5728,
            y: 5.471,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.573,
            y: 5.461,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.001000000000001,
            y: 5.715,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9910000000000005,
            y: 5.7148,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9811000000000005,
            y: 5.7142,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.971100000000001,
            y: 5.7132000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9613000000000005,
            y: 5.7119,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9514000000000005,
            y: 5.710100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9417,
            y: 5.708,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9321,
            y: 5.705500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9225,
            y: 5.7026,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9131,
            y: 5.6993,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9038,
            y: 5.6957,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8947,
            y: 5.6917,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.885700000000001,
            y: 5.6873000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8769,
            y: 5.6826,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8683000000000005,
            y: 5.6776,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8599000000000006,
            y: 5.6722,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8517,
            y: 5.6665,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.843800000000001,
            y: 5.6605,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.836,
            y: 5.654100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.828600000000001,
            y: 5.6475,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.821400000000001,
            y: 5.6406,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.814500000000001,
            y: 5.6334,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8079,
            y: 5.626,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.801500000000001,
            y: 5.6182,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7955000000000005,
            y: 5.6103000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7898000000000005,
            y: 5.6021,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.784400000000001,
            y: 5.5937,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.779400000000001,
            y: 5.585100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7747,
            y: 5.576300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.770300000000001,
            y: 5.5673,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7663,
            y: 5.5582,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.762700000000001,
            y: 5.548900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7594,
            y: 5.5395,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7565,
            y: 5.5299000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7540000000000004,
            y: 5.520300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7519,
            y: 5.5106,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.750100000000001,
            y: 5.5007,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7488,
            y: 5.4909,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747800000000001,
            y: 5.4809,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7472,
            y: 5.471,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747000000000001,
            y: 5.461,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.319,
            y: 1.905,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.329,
            y: 1.9052,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3389,
            y: 1.9058000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3489,
            y: 1.9068,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3587,
            y: 1.9081000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3686,
            y: 1.9099000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.378300000000001,
            y: 1.9120000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3879,
            y: 1.9145,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.3975,
            y: 1.9174,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4069,
            y: 1.9207,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4162,
            y: 1.9243000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4253,
            y: 1.9283000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4343,
            y: 1.9327,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.443100000000001,
            y: 1.9374,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4517,
            y: 1.9424000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4601,
            y: 1.9478000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.468300000000001,
            y: 1.9535,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4762,
            y: 1.9595,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.484,
            y: 1.9659000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.4914,
            y: 1.9725000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.498600000000001,
            y: 1.9794,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.505500000000001,
            y: 1.9866000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5121,
            y: 1.994,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.518500000000001,
            y: 2.0018000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5245,
            y: 2.0097,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5302,
            y: 2.0179,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5356,
            y: 2.0263,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.540600000000001,
            y: 2.0349,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.545300000000001,
            y: 2.0437000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.549700000000001,
            y: 2.0527,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.553700000000001,
            y: 2.0618000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.557300000000001,
            y: 2.0711,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5606,
            y: 2.0805000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.563500000000001,
            y: 2.0901,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.566,
            y: 2.0997,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.568100000000001,
            y: 2.1094,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5699,
            y: 2.1193,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.571200000000001,
            y: 2.1291,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5722,
            y: 2.1391,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.5728,
            y: 2.149,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.573,
            y: 2.1590000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.001000000000001,
            y: 1.905,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9910000000000005,
            y: 1.9052,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9811000000000005,
            y: 1.9058000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.971100000000001,
            y: 1.9068,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9613000000000005,
            y: 1.9081000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9514000000000005,
            y: 1.9099000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9417,
            y: 1.9120000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9321,
            y: 1.9145,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9225,
            y: 1.9174,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9131,
            y: 1.9207,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.9038,
            y: 1.9243000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8947,
            y: 1.9283000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.885700000000001,
            y: 1.9327,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8769,
            y: 1.9374,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8683000000000005,
            y: 1.9424000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8599000000000006,
            y: 1.9478000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8517,
            y: 1.9535,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.843800000000001,
            y: 1.9595,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.836,
            y: 1.9659000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.828600000000001,
            y: 1.9725000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.821400000000001,
            y: 1.9794,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.814500000000001,
            y: 1.9866000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.8079,
            y: 1.994,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.801500000000001,
            y: 2.0018000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7955000000000005,
            y: 2.0097,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7898000000000005,
            y: 2.0179,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.784400000000001,
            y: 2.0263,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.779400000000001,
            y: 2.0349,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7747,
            y: 2.0437000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.770300000000001,
            y: 2.0527,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7663,
            y: 2.0618000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.762700000000001,
            y: 2.0711,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7594,
            y: 2.0805000000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7565,
            y: 2.0901,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7540000000000004,
            y: 2.0997,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7519,
            y: 2.1094,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.750100000000001,
            y: 2.1193,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7488,
            y: 2.1291,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747800000000001,
            y: 2.1391,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.7472,
            y: 2.149,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.747000000000001,
            y: 2.1590000000000003,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.414,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.541,
            y: 3.81,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.414,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 10.414,
            y: 4.572,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 10.414,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 10.414,
            y: 3.048,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 9.906,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 9.906,
            y: 4.572,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 9.906,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 9.906,
            y: 3.048,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.254
            }
        },
        {
            x: 9.906,
            y: 3.81,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 9.779,
            y: 3.81,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.445500000000001,
            y: 6.032500000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1915,
            y: 6.032500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1815,
            y: 6.0327,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1716,
            y: 6.0333000000000006,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1616,
            y: 6.0343,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1518,
            y: 6.0356000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1419,
            y: 6.0374,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.132200000000001,
            y: 6.0395,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1226,
            y: 6.042000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.113,
            y: 6.0449,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1036,
            y: 6.0482000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0943,
            y: 6.0518,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0852,
            y: 6.0558000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0762,
            y: 6.0602,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.067400000000001,
            y: 6.064900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0588,
            y: 6.0699000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0504,
            y: 6.0753,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.042200000000001,
            y: 6.081,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0343,
            y: 6.087000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0265,
            y: 6.0934,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0191,
            y: 6.1000000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0119,
            y: 6.1069,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.005,
            y: 6.1141000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9984,
            y: 6.1215,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.992,
            y: 6.129300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.986000000000001,
            y: 6.1372,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.980300000000001,
            y: 6.1454,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.974900000000001,
            y: 6.1538,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9699,
            y: 6.1624,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9652,
            y: 6.171200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.960800000000001,
            y: 6.1802,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9568,
            y: 6.1893,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.953200000000001,
            y: 6.1986,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9499,
            y: 6.208,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.947,
            y: 6.2176,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.944500000000001,
            y: 6.227200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9424,
            y: 6.2369,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.940600000000001,
            y: 6.2468,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9393,
            y: 6.256600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.938300000000001,
            y: 6.2666,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9377,
            y: 6.2765,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9375,
            y: 6.2865,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9375,
            y: 6.9215,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9377,
            y: 6.931500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.938300000000001,
            y: 6.941400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9393,
            y: 6.9514000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.940600000000001,
            y: 6.961200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9424,
            y: 6.971100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.944500000000001,
            y: 6.9808,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.947,
            y: 6.9904,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9499,
            y: 7,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.953200000000001,
            y: 7.0094,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9568,
            y: 7.0187,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.960800000000001,
            y: 7.0278,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9652,
            y: 7.0368,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9699,
            y: 7.0456,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.974900000000001,
            y: 7.054200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.980300000000001,
            y: 7.062600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.986000000000001,
            y: 7.0708,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.992,
            y: 7.0787,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.9984,
            y: 7.0865,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.005,
            y: 7.0939000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0119,
            y: 7.101100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0191,
            y: 7.1080000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0265,
            y: 7.1146,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0343,
            y: 7.121,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.042200000000001,
            y: 7.127000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0504,
            y: 7.132700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0588,
            y: 7.1381000000000006,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.067400000000001,
            y: 7.1431000000000004,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0762,
            y: 7.1478,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0852,
            y: 7.152200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.0943,
            y: 7.1562,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1036,
            y: 7.159800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.113,
            y: 7.1631,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1226,
            y: 7.166,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.132200000000001,
            y: 7.168500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1419,
            y: 7.1706,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1518,
            y: 7.1724000000000006,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1616,
            y: 7.1737,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1716,
            y: 7.1747000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1815,
            y: 7.1753,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1915,
            y: 7.1755,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.445500000000001,
            y: 7.1755,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.8937,
            y: 6.9215,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.2112,
            y: 7.1755,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.2112,
            y: 6.032500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.8937,
            y: 6.032500000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.5287,
            y: 6.032500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.525,
            y: 12.700000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.255,
            y: 12.700000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 9.525,
            y: 12.700000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.16,
            y: 12.065000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.16,
            y: 10.795,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 9.525,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.62,
            y: 10.795,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.62,
            y: 12.065000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.255,
            y: 12.700000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.62,
            y: 10.795,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 8.255,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 9.525,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.16,
            y: 12.065000000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.795,
            y: 12.700000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.065000000000001,
            y: 12.700000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.700000000000001,
            y: 12.065000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.700000000000001,
            y: 10.795,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 12.065000000000001,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.795,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 10.16,
            y: 10.795,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 7.6073,
            y: 13.3223,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.6073,
            y: 14.465300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 7.6073,
            y: 13.3223,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.1153,
            y: 13.3223,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.597900000000001,
            y: 13.3223,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.1059,
            y: 13.3223,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.597900000000001,
            y: 13.3223,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.597900000000001,
            y: 14.465300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.1059,
            y: 14.465300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.978900000000001,
            y: 13.9573,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 8.597900000000001,
            y: 13.9573,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.586,
            y: 14.465300000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.586,
            y: 13.3223,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.586,
            y: 14.465300000000001,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.903500000000001,
            y: 14.465300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9146,
            y: 14.465100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.925600000000001,
            y: 14.464500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9367,
            y: 14.463600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.947700000000001,
            y: 14.462200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9586,
            y: 14.460500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9695,
            y: 14.458400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9803,
            y: 14.455900000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.991,
            y: 14.453000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0016,
            y: 14.449800000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0121,
            y: 14.446200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.022400000000001,
            y: 14.442200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0326,
            y: 14.4379,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0427,
            y: 14.433200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0526,
            y: 14.4281,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0623,
            y: 14.4228,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0717,
            y: 14.417100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.081000000000001,
            y: 14.411000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0901,
            y: 14.4047,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.099,
            y: 14.398000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1076,
            y: 14.391,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1159,
            y: 14.383700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1241,
            y: 14.3762,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1319,
            y: 14.368400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1394,
            y: 14.3602,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.146700000000001,
            y: 14.3519,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1537,
            y: 14.343300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.160400000000001,
            y: 14.3344,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1667,
            y: 14.3253,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1728,
            y: 14.316,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1785,
            y: 14.306600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1838,
            y: 14.2969,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1889,
            y: 14.287,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1936,
            y: 14.276900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1979,
            y: 14.2667,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2019,
            y: 14.256400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2055,
            y: 14.2459,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2087,
            y: 14.2353,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2116,
            y: 14.2246,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2141,
            y: 14.2138,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2162,
            y: 14.202900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2179,
            y: 14.192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2193,
            y: 14.181000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2202,
            y: 14.1699,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2208,
            y: 14.158900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.221,
            y: 14.1478,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.221,
            y: 13.639800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2208,
            y: 13.6287,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2202,
            y: 13.617700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2193,
            y: 13.6066,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2179,
            y: 13.595600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2162,
            y: 13.5847,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2141,
            y: 13.5738,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2116,
            y: 13.563,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2087,
            y: 13.5523,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2055,
            y: 13.5417,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.2019,
            y: 13.5312,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1979,
            y: 13.520900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1936,
            y: 13.5107,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1889,
            y: 13.5006,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1838,
            y: 13.4907,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1785,
            y: 13.481,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1728,
            y: 13.4716,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1667,
            y: 13.4623,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.160400000000001,
            y: 13.4532,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1537,
            y: 13.4443,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.146700000000001,
            y: 13.4357,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1394,
            y: 13.4274,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1319,
            y: 13.4192,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1241,
            y: 13.4114,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1159,
            y: 13.4039,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.1076,
            y: 13.396600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.099,
            y: 13.389600000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0901,
            y: 13.382900000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.081000000000001,
            y: 13.3766,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0717,
            y: 13.3705,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0622,
            y: 13.3648,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0526,
            y: 13.3595,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0427,
            y: 13.3544,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0326,
            y: 13.3497,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.022400000000001,
            y: 13.345400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0121,
            y: 13.3414,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 10.0016,
            y: 13.337800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.991,
            y: 13.3346,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9803,
            y: 13.331700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9695,
            y: 13.3292,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9586,
            y: 13.327100000000002,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.947700000000001,
            y: 13.3254,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9367,
            y: 13.324,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.925600000000001,
            y: 13.3231,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.9146,
            y: 13.3225,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.903500000000001,
            y: 13.3223,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 9.586,
            y: 13.3223,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.127
            }
        },
        {
            x: 2.794,
            y: 5.3340000000000005,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7942,
            y: 5.324,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7948,
            y: 5.3141,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7958000000000003,
            y: 5.3041,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7971,
            y: 5.294300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7989,
            y: 5.284400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.801,
            y: 5.2747,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8035,
            y: 5.2651,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8064,
            y: 5.2555000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8097000000000003,
            y: 5.2461,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8133000000000004,
            y: 5.236800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8173,
            y: 5.2277000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8217000000000003,
            y: 5.2187,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8264,
            y: 5.2099,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8314,
            y: 5.2013,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8368,
            y: 5.1929,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8425000000000002,
            y: 5.1847,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8485,
            y: 5.1768,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8549,
            y: 5.1690000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8615,
            y: 5.1616,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8684000000000003,
            y: 5.1544,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8756,
            y: 5.1475,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.883,
            y: 5.1409,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8908,
            y: 5.1345,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8987000000000003,
            y: 5.1285,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9069000000000003,
            y: 5.122800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9153000000000002,
            y: 5.1174,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9239,
            y: 5.1124,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9327,
            y: 5.1077,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9417,
            y: 5.1033,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9508,
            y: 5.0993,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9601,
            y: 5.0957,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9695,
            y: 5.0924000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9791000000000003,
            y: 5.0895,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9887,
            y: 5.087000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9984,
            y: 5.0849,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0083,
            y: 5.0831,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0181,
            y: 5.0818,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0281000000000002,
            y: 5.0808,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0380000000000003,
            y: 5.0802000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.048,
            y: 5.08,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.572,
            y: 5.08,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.582,
            y: 5.0802000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.5919,
            y: 5.0808,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6019000000000005,
            y: 5.0818,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6117,
            y: 5.0831,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6216,
            y: 5.0849,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6313,
            y: 5.087000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6409,
            y: 5.0895,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6505,
            y: 5.0924000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6599,
            y: 5.0957,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6692,
            y: 5.0993,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6783,
            y: 5.1033,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6873000000000005,
            y: 5.1077,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6961,
            y: 5.1124,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7047,
            y: 5.1174,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7131,
            y: 5.122800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7213,
            y: 5.1285,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7292000000000005,
            y: 5.1345,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.737,
            y: 5.1409,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.744400000000001,
            y: 5.1475,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7516,
            y: 5.1544,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.758500000000001,
            y: 5.1616,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7651,
            y: 5.1690000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7715000000000005,
            y: 5.1768,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7775,
            y: 5.1847,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7832,
            y: 5.1929,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.788600000000001,
            y: 5.2013,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7936000000000005,
            y: 5.2099,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7983,
            y: 5.2187,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.802700000000001,
            y: 5.2277000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8067,
            y: 5.236800000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8103,
            y: 5.2461,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8136,
            y: 5.2555000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8165000000000004,
            y: 5.2651,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.819,
            y: 5.2747,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8211,
            y: 5.284400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.822900000000001,
            y: 5.294300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8242,
            y: 5.3041,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.825200000000001,
            y: 5.3141,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8258,
            y: 5.324,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 5.3340000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 9.906,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8258,
            y: 9.916,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.825200000000001,
            y: 9.9259,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8242,
            y: 9.9359,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.822900000000001,
            y: 9.9457,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8211,
            y: 9.9556,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.819,
            y: 9.965300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8165000000000004,
            y: 9.9749,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8136,
            y: 9.9845,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8103,
            y: 9.9939,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8067,
            y: 10.0032,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.802700000000001,
            y: 10.0123,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7983,
            y: 10.0213,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7936000000000005,
            y: 10.030100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.788600000000001,
            y: 10.0387,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7832,
            y: 10.0471,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7775,
            y: 10.0553,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7715000000000005,
            y: 10.0632,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7651,
            y: 10.071,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.758500000000001,
            y: 10.0784,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7516,
            y: 10.085600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.744400000000001,
            y: 10.092500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.737,
            y: 10.0991,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7292000000000005,
            y: 10.105500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7213,
            y: 10.111500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7131,
            y: 10.1172,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.7047,
            y: 10.1226,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6961,
            y: 10.127600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6873000000000005,
            y: 10.1323,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6783,
            y: 10.136700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6692,
            y: 10.1407,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6599,
            y: 10.144300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6505,
            y: 10.1476,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6409,
            y: 10.150500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6313,
            y: 10.153,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6216,
            y: 10.155100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6117,
            y: 10.1569,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.6019000000000005,
            y: 10.1582,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.5919,
            y: 10.1592,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.582,
            y: 10.1598,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.572,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.048,
            y: 10.16,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0380000000000003,
            y: 10.1598,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0281000000000002,
            y: 10.1592,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0181,
            y: 10.1582,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.0083,
            y: 10.1569,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9984,
            y: 10.155100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9887,
            y: 10.153,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9791000000000003,
            y: 10.150500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9695,
            y: 10.1476,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9601,
            y: 10.144300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9508,
            y: 10.1407,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9417,
            y: 10.136700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9327,
            y: 10.1323,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9239,
            y: 10.127600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9153000000000002,
            y: 10.1226,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9069000000000003,
            y: 10.1172,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8987000000000003,
            y: 10.111500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8908,
            y: 10.105500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.883,
            y: 10.0991,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8756,
            y: 10.092500000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8684000000000003,
            y: 10.085600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8615,
            y: 10.0784,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8549,
            y: 10.071,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8485,
            y: 10.0632,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8425000000000002,
            y: 10.0553,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8368,
            y: 10.0471,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8314,
            y: 10.0387,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8264,
            y: 10.030100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8217000000000003,
            y: 10.0213,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8173,
            y: 10.0123,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8133000000000004,
            y: 10.0032,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8097000000000003,
            y: 9.9939,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8064,
            y: 9.9845,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.8035,
            y: 9.9749,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.801,
            y: 9.965300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7989,
            y: 9.9556,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7971,
            y: 9.9457,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7958000000000003,
            y: 9.9359,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7948,
            y: 9.9259,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.7942,
            y: 9.916,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 9.906,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.048,
            y: 5.08,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.572,
            y: 5.08,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 5.3340000000000005,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 5.715,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9210000000000003,
            y: 5.8420000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 5.715,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 5.3340000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 5.715,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.699,
            y: 5.8420000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9210000000000003,
            y: 9.398,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 9.525,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9210000000000003,
            y: 9.398,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.9210000000000003,
            y: 5.8420000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.699,
            y: 9.398,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 9.525,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.699,
            y: 9.398,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.699,
            y: 5.8420000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 9.525,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 2.794,
            y: 9.906,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 9.906,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.8260000000000005,
            y: 9.525,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 4.572,
            y: 10.16,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.048,
            y: 10.16,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1524
            }
        },
        {
            x: 3.81,
            y: 10.3505,
            operation: "flash",
            aperture: {
                shape: "rectangle",
                width: 0.508,
                height: 0.381
            }
        },
        {
            x: 3.81,
            y: 4.8895,
            operation: "flash",
            aperture: {
                shape: "rectangle",
                width: 0.508,
                height: 0.381
            }
        },
        {
            x: 2.4638,
            y: 5.1308,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5748,
            y: 5.1308,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5748,
            y: 5.3777,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5750000000000002,
            y: 5.3875,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5756000000000001,
            y: 5.3973,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5766,
            y: 5.407100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5779,
            y: 5.4168,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5797,
            y: 5.4265,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5818,
            y: 5.436100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5843,
            y: 5.4455,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5872000000000002,
            y: 5.4549,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5904,
            y: 5.4642,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5941,
            y: 5.4733,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.598,
            y: 5.4823,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6024,
            y: 5.4911,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6071,
            y: 5.499700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6121,
            y: 5.5082,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6174000000000002,
            y: 5.5164,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6231,
            y: 5.5244,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6291,
            y: 5.5322000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6354000000000002,
            y: 5.5397,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6420000000000001,
            y: 5.547000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6489,
            y: 5.554,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6560000000000001,
            y: 5.560700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6634,
            y: 5.567200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6711,
            y: 5.573300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.679,
            y: 5.5792,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6871,
            y: 5.584700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.6954,
            y: 5.5899,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7040000000000002,
            y: 5.5947000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7127000000000001,
            y: 5.599200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7216,
            y: 5.603400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7306000000000001,
            y: 5.607200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7398,
            y: 5.610600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7491,
            y: 5.613700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7586000000000002,
            y: 5.6164000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7681,
            y: 5.6187000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7778,
            y: 5.6207,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7874,
            y: 5.6222,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7972000000000001,
            y: 5.6234,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8070000000000002,
            y: 5.6242,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8168000000000002,
            y: 5.6246,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8266,
            y: 5.6246,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8364,
            y: 5.6242,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8462,
            y: 5.6234,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.856,
            y: 5.6222,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8656000000000001,
            y: 5.6207,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8753000000000002,
            y: 5.6187000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8848,
            y: 5.6164000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.8943,
            y: 5.613700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9036000000000002,
            y: 5.610600000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9128,
            y: 5.607200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9218000000000002,
            y: 5.603400000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9307,
            y: 5.599200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9394,
            y: 5.5947000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9480000000000002,
            y: 5.5899,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9563000000000001,
            y: 5.584700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9644000000000001,
            y: 5.5792,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9723000000000002,
            y: 5.573300000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9800000000000002,
            y: 5.567200000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9874,
            y: 5.560700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.9945000000000002,
            y: 5.554,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0014000000000003,
            y: 5.547000000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.008,
            y: 5.5397,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0143,
            y: 5.5322000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0203,
            y: 5.5244,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0260000000000002,
            y: 5.5164,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0313,
            y: 5.5082,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0363,
            y: 5.499700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.041,
            y: 5.4911,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0454,
            y: 5.4823,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0493,
            y: 5.4733,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.053,
            y: 5.4642,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0562,
            y: 5.4549,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0591,
            y: 5.4455,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0616,
            y: 5.436100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0637000000000003,
            y: 5.4265,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0655,
            y: 5.4168,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0668,
            y: 5.407100000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0678,
            y: 5.3973,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0684,
            y: 5.3875,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0686,
            y: 5.3777,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0687,
            y: 5.3777,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0687,
            y: 5.1308,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.0687,
            y: 5.4271,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.4638,
            y: 5.624700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.7724,
            y: 6.0158000000000005,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 1.5748,
            y: 6.262700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.4638,
            y: 6.262700000000001,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.4638,
            y: 6.0158000000000005,
            operation: "closed",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        },
        {
            x: 2.4638,
            y: 6.5097000000000005,
            operation: "open",
            aperture: {
                shape: "circle",
                diameter: 0.1016
            }
        }
    ],
    silkscreen_bottom: [],
    drills: [
        {
            x: 8.89,
            y: 11.43,
            size: 1.016
        },
        {
            x: 11.43,
            y: 11.43,
            size: 1.016
        },
        {
            x: 8.89,
            y: 3.81,
            size: 0.813
        },
        {
            x: 11.43,
            y: 3.81,
            size: 0.813
        },
        {
            x: 3.81,
            y: 3.81,
            size: 0.813
        },
        {
            x: 3.81,
            y: 11.43,
            size: 0.813
        }
    ]
}

export const ProjectContext = createContext<Project>(emptyProject);

export const useProject = () => useContext(ProjectContext)