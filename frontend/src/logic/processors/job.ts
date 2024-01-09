import {Job} from "../types.ts";

type GerberJob = {
    Header: {
        Comment: string
        CreationDate: string
        GenerationSoftware: {
            Application: string
            Vendor: string
            Version: string
        }
        Part: string
    }
    Overall: {
        BoardThickness: number
        LayerNumber: number
        Name: {
            ProjectId: string
        }
        Owner: string
        Size: {
            X: number
            Y: number
        }
    }
}

export const processJobFile = (content: string): Job => {
    const data = JSON.parse(content) as GerberJob;

    return {
        title: data.Overall.Name.ProjectId,
        width: data.Overall.Size.X,
        height: data.Overall.Size.Y,
    }
}