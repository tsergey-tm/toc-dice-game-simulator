import React, {PropsWithChildren, useContext, useState} from "react";
import {GameResult, useGameResultContext} from "./GameResultContext";

const VALUES_SEPARATOR = ',';
const PARAMS_SEPARATOR = ";";

export abstract class PlaceParam {

    type: string;

    errors: string[] = [];

    protected constructor(type: string) {

        this.type = type;
    }

    public static makeFromInitStr(initStr: string): PlaceParam | undefined {
        const type = initStr.charAt(0).toUpperCase();
        const iStr = initStr.slice(1);

        switch (type) {
            case BufferParam.LETTER:
                return new BufferParam().setInitStr(iStr);
            case ForkliftParam.LETTER:
                return new ForkliftParam().setInitStr(iStr);
            case ProcessorParam.LETTER:
                return new ProcessorParam().setInitStr(iStr);
            default:
                return undefined;
        }
    }

    public abstract toInitString(): string;

    public abstract validate(): void;

    public abstract clone(): PlaceParam;
}


export class BufferParam extends PlaceParam {

    public static readonly LETTER = "B";

    start: number = 4;
    limit: number = 0;

    constructor() {
        super(BufferParam.LETTER);
    }

    setInitStr(initStr: string): BufferParam {

        const pars = initStr.split(VALUES_SEPARATOR);

        this.start = (pars.length > 0) ? parseInt(pars[0]) : 0;
        this.limit = (pars.length > 1) ? parseInt(pars[1]) : 0;

        if (this.start < 0) {
            this.start = 0;
        }
        if (this.limit < 0) {
            this.limit = 0;
        }

        return this;
    }

    toInitString(): string {
        return BufferParam.LETTER + this.start + VALUES_SEPARATOR + this.limit;
    }

    validate() {
        this.errors = [];
        if (this.start < 0) {
            this.errors.push("Стартовое значение меньше ноля");
        }
        if (this.limit < 0) {
            this.errors.push("Значение лимита меньше ноля");
        }
    }

    clone(): PlaceParam {
        const res = new BufferParam();
        res.limit = this.limit;
        res.start = this.start;
        return res;
    }
}

export abstract class SecondaryFromParam extends PlaceParam {

    secondaryFrom: number = 0;

    protected constructor(type: string) {
        super(type);
    }

    setSecondaryFrom(secondaryFrom: number) {
        this.secondaryFrom = secondaryFrom;

        if (this.secondaryFrom < 0) {
            this.secondaryFrom = 0;
        }

        return this;
    }

    validate() {
        this.errors = [];
        if (this.secondaryFrom < 0) {
            this.errors.push("Неправильное значение ссылки на ведущего");
        }
    }
}

export class ForkliftParam extends SecondaryFromParam {

    public static readonly LETTER = "F";

    volume: number = 6;
    stepMod: number = 1;
    stepDiv: number = 1;

    constructor() {
        super(ForkliftParam.LETTER);
    }

    setInitStr(initStr: string) {
        const pars = initStr.split(VALUES_SEPARATOR);

        this.setSecondaryFrom((pars.length > 0) ? parseInt(pars[0]) : 0);

        this.volume = (pars.length > 1) ? parseInt(pars[1]) : 6;
        this.stepMod = (pars.length > 2) ? parseInt(pars[2]) : 1;
        this.stepDiv = (pars.length > 3) ? parseInt(pars[3]) : 1;

        if (this.volume < 1) {
            this.volume = 1;
        }
        if (this.stepMod < 1) {
            this.stepMod = 1;
        }
        if (this.stepDiv < 1) {
            this.stepDiv = 1;
        }
        if (this.stepMod > this.stepDiv) {
            this.stepMod = this.stepDiv;
        }

        return this;
    }

    toInitString(): string {
        return ForkliftParam.LETTER + this.secondaryFrom + VALUES_SEPARATOR + this.volume + VALUES_SEPARATOR + this.stepMod + VALUES_SEPARATOR + this.stepDiv;
    }

    validate() {
        super.validate();
        if (this.volume < 0) {
            this.errors.push("Значение объёма меньше одного");
        }
        if (this.stepMod < 0) {
            this.errors.push("Значение каждого N-ого шага меньше единицы");
        }
        if (this.stepDiv < 0) {
            this.errors.push("Значение из числа шагов меньше единицы");
        }
        if (this.stepMod > this.stepDiv) {
            this.errors.push("Значение каждого N-ого шага больше числа шагов");
        }
    }

    clone(): PlaceParam {
        const res = new ForkliftParam();
        res.secondaryFrom = this.secondaryFrom;
        res.volume = this.volume;
        res.stepDiv = this.stepDiv;
        res.stepMod = this.stepMod;
        return res;
    }
}

export class ProcessorParam extends SecondaryFromParam {

    public static readonly LETTER = "P";

    min: number = 1;
    max: number = 6;
    union: boolean = false;

    constructor() {
        super(ProcessorParam.LETTER);
    }

    setInitStr(initStr: string) {
        const pars = initStr.split(VALUES_SEPARATOR);

        this.setSecondaryFrom((pars.length > 0) ? parseInt(pars[0]) : 0);

        this.min = (pars.length > 1) ? parseInt(pars[1]) : 0;
        this.max = (pars.length > 2) ? parseInt(pars[2]) : 0;
        this.union = (pars.length > 3) ? (parseInt(pars[3]) > 0) : false;

        if (this.min < 0) {
            this.min = 0;
        }
        if (this.max < 1) {
            this.max = 1;
        }

        return this;
    }

    toInitString(): string {
        return ProcessorParam.LETTER + this.secondaryFrom + VALUES_SEPARATOR + this.min + VALUES_SEPARATOR + this.max
            + VALUES_SEPARATOR + (this.union ? 1 : 0);
    }

    validate() {
        super.validate();
        if (this.min < 0) {
            this.errors.push("Значение минимальной производительности меньше ноля");
        }
        if (this.max < 1) {
            this.errors.push("Значение максимальной производительности меньше одного");
        }
        if (this.min > this.max) {
            this.errors.push("Значение минимальной производительности больше максимальной");
        }
    }

    clone(): PlaceParam {
        const res = new ProcessorParam();
        res.secondaryFrom = this.secondaryFrom;
        res.min = this.min;
        res.max = this.max;
        res.union = this.union;
        return res;
    }
}


export class InitParams {

    iterations: number = 200;
    expectedThroughput: number = 600;
    placeParams: PlaceParam[] = [];

    setInitStr(initStr: string) {

        let placeParams: PlaceParam[] = [];

        let strs = initStr.split(PARAMS_SEPARATOR);
        if (strs.length > 0) {

            let number = parseInt(strs[0]);
            if (!Number.isNaN(number)) {
                this.iterations = number;
                strs.shift();
            }
            number = parseInt(strs[0]);
            if (!Number.isNaN(number)) {
                this.expectedThroughput = number;
                strs.shift();
            }

            for (let strParam of strs) {
                if (strParam !== undefined) {
                    const param = PlaceParam.makeFromInitStr(strParam);
                    if (param !== undefined) {
                        placeParams.push(param);
                    }
                }
            }
        }

        placeParams.forEach((value, index) => {
            if ((value.type === ForkliftParam.LETTER) || (value.type === ProcessorParam.LETTER)) {
                const sfp = value as SecondaryFromParam;
                const sec = sfp.secondaryFrom;
                if ((sec > 0) && ((index === sec - 1) || (placeParams[sec - 1]?.type !== ProcessorParam.LETTER))) {
                    sfp.secondaryFrom = 0;
                }
            }
        });

        placeParams.forEach((value, index) => {
            if (value.type === ProcessorParam.LETTER) {
                const sfp = value as SecondaryFromParam;
                const sec = sfp.secondaryFrom;
                if ((sec > 0) && ((placeParams[sec - 1] as ProcessorParam).secondaryFrom !== 0)) {
                    sfp.secondaryFrom = 0;
                }
            }
        });

        this.placeParams = placeParams;

        this.validate();

        return this;
    }

    toInitString(): string {
        let res = this.iterations.toString() + PARAMS_SEPARATOR + this.expectedThroughput.toString();

        this.placeParams.forEach(value => res += PARAMS_SEPARATOR + value.toInitString());

        return res;
    }

    validate(): void {
        this.placeParams.forEach(value => value.validate());

        if (this.placeParams.length > 0) {
            if (this.placeParams[0].type === BufferParam.LETTER) {
                this.placeParams[0].errors.push("Первым элементом не может быть буфер")
            }

            let prevType = this.placeParams[0].type;

            for (let i = 1; i < this.placeParams.length; i++) {
                if (prevType === this.placeParams[i].type) {
                    this.placeParams[i].errors.push("Нельзя ставить два одинаковых типа объектов рядом");
                } else if (prevType === ForkliftParam.LETTER && this.placeParams[i].type === ProcessorParam.LETTER) {
                    this.placeParams[i].errors.push("Перед процессором должен быть буфер");
                } else if (prevType === ProcessorParam.LETTER && this.placeParams[i].type === ForkliftParam.LETTER) {
                    this.placeParams[i].errors.push("Перед перекладчиком должен быть буфер");
                }
                prevType = this.placeParams[i].type;
            }

            const lastIndex = this.placeParams.length - 1;
            if (this.placeParams[lastIndex].type === BufferParam.LETTER) {
                this.placeParams[lastIndex].errors.push("Перед выходом нельзя ставить буфер")
            }
        }

        let cycles = this.placeParams.map(value => {
            if ((value.type === ForkliftParam.LETTER) || (value.type === ProcessorParam.LETTER)) {
                return (value as SecondaryFromParam).secondaryFrom;
            } else {
                return 0;
            }
        });

        let removed: number[] = [];
        do {
            let cycles1 = new Array<number>(cycles.length).fill(0);

            cycles.forEach((value, index) => {
                if (value > 0) {
                    cycles1[value - 1] = cycles[value - 1];
                }
            })

            removed = cycles1.map((value, index) => cycles[index] - value).filter(value => value !== 0);

            cycles = cycles1;
        } while (removed.length);

        cycles.forEach((value, index) => {
            if (value > 0) {
                this.placeParams[index].errors.push("Участвует в циклической зависимости, надо её разорвать");
            }
        });

    }

    clone(): InitParams {

        const res = new InitParams()

        res.iterations = this.iterations;
        this.placeParams.forEach(value => res.placeParams.push(value.clone()));

        return res;
    }

    errors(): string[] {

        let res: string[] = [];

        this.placeParams.forEach(value => res.push(...value.errors));

        return res;
    }
}

export type GameContextType = {
    initParams: InitParams;
    setInitParams: (initParams: InitParams) => void;
}
export const GameContext = React.createContext<GameContextType | undefined>(undefined);
export const GameContextProvider = ({children}: PropsWithChildren<{}>) => {

    const {setGameResult} = useGameResultContext();

    const defaultInitStr = "200;600;F3,6,1,1;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0"

    const searchParams = new URLSearchParams(document.location.search);

    let initStr: string;
    if (searchParams.size > 0) {
        initStr = searchParams.keys().next().value;
    } else {
        initStr = defaultInitStr;
    }

    const [initParams, setInitParamsNative] = useState<InitParams>(new InitParams().setInitStr(initStr));

    let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + initParams.toInitString();
    window.history.pushState({path: newUrl}, '', newUrl);

    const setInitParams = (initParams: InitParams) => {
        initParams.validate();

        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + initParams.toInitString();
        window.history.pushState({path: newUrl}, '', newUrl);

        setGameResult(new GameResult());

        setInitParamsNative(initParams);
    }

    return (
        <GameContext.Provider value={{initParams, setInitParams}}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('useGameContext must be used inside the GameContextProvider');
    }

    return context;
};
