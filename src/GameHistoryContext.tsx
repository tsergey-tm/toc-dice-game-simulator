import React, {PropsWithChildren, useContext, useState} from "react";
import {GameResult} from "./GameResultContext";

export class HistoryResult {

    throughputs: number[] = [];
    wips: number[] = [];
    controls: number[] = [];

    isShowed: boolean = false;

    store(gameResult: GameResult) {

        this.throughputs = structuredClone(gameResult.throughputs);
        this.wips = structuredClone(gameResult.wips);
        this.controls = structuredClone(gameResult.controls);
    }

    clone(): HistoryResult {
        const historyResult = new HistoryResult();

        historyResult.isShowed = this.isShowed;
        historyResult.throughputs = structuredClone(this.throughputs);
        historyResult.wips = structuredClone(this.wips);
        historyResult.controls = structuredClone(this.controls);

        return historyResult;
    }
}

export type SetHistoryResult = (historyResult: HistoryResult) => void;

export type HistoryResultContextType = {
    historyResult: HistoryResult;
    setHistoryResult: SetHistoryResult;
}
export const HistoryResultContext = React.createContext<HistoryResultContextType | undefined>(undefined);
export const HistoryResultContextProvider = ({children}: PropsWithChildren<{}>) => {

    const [historyResult, setHistoryResult] = useState<HistoryResult>(new HistoryResult());

    return (
        <HistoryResultContext.Provider value={{historyResult, setHistoryResult}}>
            {children}
        </HistoryResultContext.Provider>
    );
};

export const useHistoryResultContext = () => {
    const context = useContext(HistoryResultContext);

    if (!context) {
        throw new Error('useHistoryResultContext must be used inside the HistoryResultContextProvider');
    }

    return context;
};