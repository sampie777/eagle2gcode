declare global {
    interface Element {
        getAttributeInt: (name: string) => number | null;
    }
}

Element.prototype.getAttributeInt = function (name: string): number | null {
    const value = this.getAttribute(name);
    if (value == null) return null;
    return +value
}

type Wire = {
    layer: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    curve: number | null,
}

type Pad = {
    name: string,
    x: number,
    y: number,
    drill: number,
    shape: string,
    rotation: string | null,
}

type Rectangle = {
    layer: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

type Text = {
    x: number,
    y: number,
    size: number,
    ratio: number,
    layer: string,
    rotation: string | null,
    value: string,
}

type Layer = {
    number: string
    name: string
    color: number
    fill: number
    visible: boolean
    active: boolean
}

type Library = {
    name: string
    urn: string
    packages: Package[]
}

type Package = {
    name: string
    urn: string
    library_version: string
    wires: Wire[]
    pads: Pad[]
    text: Text[]
    rectangles: Rectangle[]
}

type Component = {
    name: string
    library: string
    library_urn: string
    package: string
    x: number
    y: number
    attributes: Attribute[]
}

type Attribute = {
    layer: string
    display: boolean
    name: string
    x: number
    y: number
    size: number
    ratio: number | null
    rotation: string | null
    value: string | null
}

type Signal = {
    name: string
    wires: Wire[]
    contacts: Contact[]
}

type Contact = {
    element: string
    pad: number
}

function getWires(element: Element): Wire[] {
    return Array.from(element.getElementsByTagName("wire"))
        .map(it => ({
            layer: it.getAttribute("layer"),
            x1: it.getAttributeInt("x1") ?? 0,
            y1: it.getAttributeInt("y1") ?? 0,
            x2: it.getAttributeInt("x2") ?? 0,
            y2: it.getAttributeInt("y2") ?? 0,
            width: it.getAttributeInt("width") ?? 0,
            curve: it.getAttributeInt("curve"),
        }));
}

function getPads(element: Element): Pad[] {
    return Array.from(element.getElementsByTagName("pad"))
        .map(it => ({
            name: it.getAttribute("name"),
            x: it.getAttributeInt("x") ?? 0,
            y: it.getAttributeInt("y") ?? 0,
            drill: it.getAttributeInt("drill") ?? 0,
            shape: it.getAttribute("shape"),
            rotation: it.getAttribute("rot"),
        }));
}

function getRectangle(element: Element): Rectangle[] {
    return Array.from(element.getElementsByTagName("rectangle"))
        .map(it => ({
            layer: it.getAttribute("layer"),
            x1: it.getAttributeInt("x1") ?? 0,
            y1: it.getAttributeInt("y1") ?? 0,
            x2: it.getAttributeInt("x2") ?? 0,
            y2: it.getAttributeInt("y2") ?? 0,
        }));
}

function getText(element: Element): Text[] {
    return (Array.from(element.getElementsByTagName("text")) as Element[])
        .map(it => ({
            x: it.getAttributeInt("x") ?? 0,
            y: it.getAttributeInt("y") ?? 0,
            size: it.getAttributeInt("size") ?? 0,
            ratio: it.getAttributeInt("ratio") ?? 0,
            layer: it.getAttribute("shape"),
            rotation: it.getAttribute("rot"),
            value: it.textContent,
        }));
}

const getLayers = (xml: Document): Layer[] => {
    return Array.from(xml.getElementsByTagName("layers")[0].children)
        .map(it => ({
            number: it.getAttribute("number"),
            name: it.getAttribute("name"),
            color: it.getAttributeInt("color") ?? 0,
            fill: it.getAttributeInt("fill") ?? 0,
            visible: it.getAttribute("visible") == "yes",
            active: it.getAttribute("active") == "yes",
        }))
};

const getLibraries = (xml: Document): Library[] => {
    return Array.from(xml.getElementsByTagName("libraries")[0].children)
        .map(library => {
            const packages = Array.from(library.getElementsByTagName("package"))
                .map(pack => ({
                    name: pack.getAttribute("name"),
                    urn: pack.getAttribute("urn"),
                    library_version: pack.getAttribute("library_version"),
                    wires: getWires(pack),
                    pads: getPads(pack),
                    text: getText(pack),
                    rectangles: getRectangle(pack),
                }))

            return {
                name: library.getAttribute("name"),
                urn: library.getAttribute("urn"),
                packages: packages
            }
        })
};

const getPlain = (xml: Document): Wire[] => {
    return getWires(xml.getElementsByTagName("plain")[0])
};

const getComponents = (xml: Document): Component[] => {
    return Array.from(xml.getElementsByTagName("elements")[0].children)
        .map(component => {
            const attributes: Attribute[] = Array.from(component.getElementsByTagName("attribute"))
                .map(it => ({
                    layer: it.getAttribute("layer"),
                    display: it.getAttribute("display") != "off",
                    name: it.getAttribute("name"),
                    x: it.getAttributeInt("x") ?? 0,
                    y: it.getAttributeInt("y") ?? 0,
                    size: it.getAttributeInt("size") ?? 0,
                    ratio: it.getAttributeInt("ratio"),
                    rotation: it.getAttribute("rot"),
                    value: it.getAttribute("value"),
                }))

            return {
                name: component.getAttribute("name"),
                library: component.getAttribute("library"),
                library_urn: component.getAttribute("library_urn"),
                package: component.getAttribute("package"),
                x: component.getAttributeInt("x") ?? 0,
                y: component.getAttributeInt("y") ?? 0,
                attributes: attributes,
            }
        })
};

const getSignals = (xml: Document): Signal[] => {
    return Array.from(xml.getElementsByTagName("signals")[0].children)
        .map(signal => {
            const contacts: Contact[] = Array.from(signal.getElementsByTagName("contactref"))
                .map(it => ({
                    element: it.getAttribute("element"),
                    pad: it.getAttributeInt("pad") ?? 0,
                }))

            const wires = getWires(signal)

            return {
                name: signal.getAttribute("name"),
                wires: wires,
                contacts: contacts,
            }
        })
};

export const processBoardFile = (content: string) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(content, "text/xml");
    console.log(xml)

    console.log("layers", JSON.stringify(getLayers(xml)))
    console.log("libraries", JSON.stringify(getLibraries(xml)))
    console.log("plain", JSON.stringify(getPlain(xml)))
    console.log("components", JSON.stringify(getComponents(xml)))
    console.log("signals", JSON.stringify(getSignals(xml)))
}