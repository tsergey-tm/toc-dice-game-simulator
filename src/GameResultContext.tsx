import React, {PropsWithChildren, useContext, useState} from "react";


export class RowData {
    isBuffer: boolean;
    count: number;
    may: number;

    constructor(isBuffer: boolean, count: number, may: number) {
        this.isBuffer = isBuffer;
        this.count = count;
        this.may = may;
    }
}

export class AggrData {
    isBuffer: boolean;
    unionTo: number;
    count: number = 0;
    may: number = 0;

    constructor(isBuffer: boolean, unionTo: number) {
        this.isBuffer = isBuffer;
        this.unionTo = unionTo;
    }

    setCount(val: number) {
        this.count = val;
    }

    addCount(val: number) {
        this.count += val;
    }

    addMay(val: number) {
        this.may += val;
    }
}

export class GameResult {
    rows: RowData[][] = [];
    aggr: AggrData[] = [];
    times: number[] = [];

    throughputs: number[] = [];
    wips: number[] = [];
    controls: number[] = [];

    setAggr(aggr: AggrData[]) {
        this.aggr = aggr;
    }

    setRows(rows: RowData[][]) {
        this.rows = rows;

        if (this.rows.length > 0) {
            let val = this.rows[0][this.rows[0].length - 1].count;
            while (this.throughputs.length < val + 1) {
                this.throughputs.push(0);
            }
            this.throughputs[val]++;

            val = 0;
            this.rows[0]
                .map((value, index) => value.isBuffer ? index : -1)
                .filter(value => value > 0)
                .slice(0, -1)
                .forEach(value => val += this.rows[0][value].count);
            while (this.wips.length < val + 1) {
                this.wips.push(0);
            }
            this.wips[val]++;
        }

        return this;
    }

    setTimes(times: number[]) {
        this.times = times;

        if (this.times.length > 0) {

            this.times.forEach(value => {

                while (this.controls.length < value + 1) {
                    this.controls.push(0);
                }
                this.controls[value]++;
            });
        }

        return this;
    }

    clone(): GameResult {
        const gameResult = new GameResult();

        gameResult.throughputs = structuredClone(this.throughputs);
        gameResult.wips = structuredClone(this.wips);
        gameResult.controls = structuredClone(this.controls);

        return gameResult;
    }
}

export type SetGameResult = (gameResult: GameResult) => void;

export type GameResultContextType = {
    gameResult: GameResult;
    setGameResult: SetGameResult;
}
export const GameResultContext = React.createContext<GameResultContextType | undefined>(undefined);
export const GameResultContextProvider = ({children}: PropsWithChildren<{}>) => {

    const [gameResult, setGameResult] = useState<GameResult>(new GameResult());

    return (
        <GameResultContext.Provider value={{gameResult, setGameResult}}>
            {children}
        </GameResultContext.Provider>
    );
};

export const useGameResultContext = () => {
    const context = useContext(GameResultContext);

    if (!context) {
        throw new Error('useGameResultContext must be used inside the GameResultContextProvider');
    }

    return context;
};
