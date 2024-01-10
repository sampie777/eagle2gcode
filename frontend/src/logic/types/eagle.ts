export namespace Eagle {
    export type Wire = {
        layer: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        width: number,
        curve: number | null,
    }

    export type Pad = {
        name: string,
        x: number,
        y: number,
        drill: number,
        shape: string,
        rotation: string | null,
    }

    export type Rectangle = {
        layer: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    }

    export type Text = {
        x: number,
        y: number,
        size: number,
        ratio: number,
        layer: string | null,
        rotation: string | null,
        value: string,
    }

    export type Layer = {
        number: string
        name: string
        color: number
        fill: number
        visible: boolean
        active: boolean
    }

    export type Library = {
        name: string
        urn: string
        packages: Package[]
    }

    export type Package = {
        name: string
        urn: string
        library_version: string
        wires: Wire[]
        pads: Pad[]
        text: Text[]
        rectangles: Rectangle[]
    }

    export type Component = {
        name: string
        library: string
        library_urn: string
        package: string
        x: number
        y: number
        attributes: Attribute[]
    }

    export type Attribute = {
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

    export type Signal = {
        name: string
        wires: Wire[]
        contacts: Contact[]
    }

    export type Contact = {
        component: string
        pad: string
    }

    export type Board = {
        layers: Layer[]
        libraries: Library[]
        plain: Wire[]
        components: Component[]
        signals: Signal[]
    }
}