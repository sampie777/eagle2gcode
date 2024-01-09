export const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getFileExtension = (file: string) => {
    const parts = file.split(".");
    if (parts.length <= 1) {
        return "";
    }
    return "." + parts[parts.length - 1].toLowerCase();
}

export const runAsync = (callback: () => any) => setTimeout(callback, 0);

export const capitalize = (word: string) => {
    if (word.length === 0) {
        return word;
    }

    if (word.length === 1) {
        return word.toUpperCase();
    }

    return word.charAt(0).toUpperCase() + word.substring(1);
}