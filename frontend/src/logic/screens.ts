export enum Screens {
    FlatcamCommandGeneration = 0,
    ProjectFilesImport,
    Viewer,
}

export type ScreenProps = {
    onBack?: () => void
    onNext?: () => void
}