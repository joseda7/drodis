export interface WordItem {
    name: string;
    id: string;
    category: "Animal" | "Lugar" | "Alimento" | "Cosa" | "";
}

export interface Setup {
    drawTime?: number;
    lang?: "es" | "en";
    wordToDraw?: WordItem;
}

export type SetupContextType = {
    setup: Setup;
    setSetup: (obj:Setup) => void;
}

