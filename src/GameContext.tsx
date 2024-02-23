import React, {PropsWithChildren, useContext, useState} from "react";
import {GameResult, useGameResultContext} from "./GameResultContext";
import {Buffer} from "buffer";
import {gunzipSync, gzipSync} from 'fflate';
import i18n from "./i18n";

const decode = (str: string): string => Buffer.from(
    gunzipSync(
        Buffer.from(
            str.replaceAll("-", "+")
                .replaceAll("_", "/")
                .replaceAll(".", "=")
            , 'base64'
        )
    )
).toString('utf8');

const encode = (str: string): string =>
    Buffer.from(gzipSync(Buffer.from(str)))
        .toString('base64')
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", ".");

export abstract class PlaceParam {
    type: string;
    name: string = ""
    errors: string[] = [];

    protected constructor(type: string) {

        this.type = type;
    }

    abstract validate(): void;

    abstract clone(): PlaceParam;

    equals(obj: PlaceParam) {
        return obj.type === this.type;
    }

    abstract fillFromJson(value: any): PlaceParam;

    abstract toJson(): any;
}


export class BufferParam extends PlaceParam {

    public static readonly LETTER = "B";

    start: number = 4;
    limit: number = 0;

    constructor() {
        super(BufferParam.LETTER);
    }

    fillFromJson(value: any): PlaceParam {

        if (value.hasOwnProperty('s')) {
            this.start = value.s;
        }
        if (value.hasOwnProperty('l')) {
            this.limit = value.l;
        }
        if (value.hasOwnProperty('n')) {
            this.name = value.n;
        }

        return this;
    }

    toJson(): any {
        return {'t': this.type, 's': this.start, 'l': this.limit, 'n': this.name};
    }

    validate() {
        this.errors = [];
        if (this.start < 0) {
            this.errors.push(i18n.t('GameContext.BufferParam.start_below_zero'));
        }
        if (this.limit < 0) {
            this.errors.push(i18n.t('GameContext.BufferParam.limit_below_zero'));
        }
    }

    clone(): PlaceParam {
        const res = new BufferParam();
        res.limit = this.limit;
        res.start = this.start;
        res.name = this.name;
        return res;
    }

    equals(obj: PlaceParam): boolean {

        if (!super.equals(obj)) {
            return false;
        }

        const obj1 = obj as BufferParam;

        return obj1.limit === this.limit && obj1.start === this.start;
    }
}

export abstract class MoverParam extends PlaceParam {

    secondaryFrom: number = 0;
    workersName: string = "";
    random: boolean = false;

    protected constructor(type: string) {
        super(type);
    }

    validate() {
        this.errors = [];
        if (this.secondaryFrom < 0) {
            this.errors.push(i18n.t('GameContext.MoverParam.secondary_below_zero'));
        }
    }

    equals(obj: PlaceParam): boolean {
        if (!super.equals(obj)) {
            return false;
        }

        const obj1 = obj as MoverParam;

        return obj1.secondaryFrom === this.secondaryFrom;
    }
}

export class ForkliftParam extends MoverParam {

    public static readonly LETTER = "F";

    volume: number = 6;
    stepMod: number = 1;
    stepDiv: number = 1;

    constructor() {
        super(ForkliftParam.LETTER);
    }

    fillFromJson(value: any): PlaceParam {

        if (value.hasOwnProperty('s')) {
            this.secondaryFrom = value.s;
        }
        if (value.hasOwnProperty('v')) {
            this.volume = value.v;
        }
        if (value.hasOwnProperty('m')) {
            this.stepMod = value.m;
        }
        if (value.hasOwnProperty('d')) {
            this.stepDiv = value.d;
        }
        if (value.hasOwnProperty('n')) {
            this.name = value.n;
        }
        if (value.hasOwnProperty('w')) {
            this.workersName = value.w;
        }
        if (value.hasOwnProperty('r')) {
            this.random = value.r;
        }

        return this;
    }

    toJson(): any {

        return {
            't': this.type,
            'v': this.volume,
            'm': this.stepMod,
            'd': this.stepDiv,
            'n': this.name,
            'w': this.workersName,
            's': this.secondaryFrom,
            'r': this.random
        };
    }

    validate() {
        super.validate();
        if (this.volume < 1) {
            this.errors.push(i18n.t('GameContext.ForkliftParam.volume_below_one'));
        }
        if (this.stepMod < 1) {
            this.errors.push(i18n.t('GameContext.ForkliftParam.step_mod_below_one'));
        }
        if (this.stepDiv < 1) {
            this.errors.push(i18n.t('GameContext.ForkliftParam.step_div_below_one'));
        }
        if (this.stepMod > this.stepDiv) {
            this.errors.push(i18n.t('GameContext.ForkliftParam.step_div_below_step_mod'));
        }
    }

    clone(): PlaceParam {
        const res = new ForkliftParam();
        res.secondaryFrom = this.secondaryFrom;
        res.name = this.name;
        res.workersName = this.workersName;
        res.random = this.random;
        res.volume = this.volume;
        res.stepDiv = this.stepDiv;
        res.stepMod = this.stepMod;
        return res;
    }

    equals(obj: PlaceParam): boolean {
        if (!super.equals(obj)) {
            return false;
        }

        const obj1 = obj as ForkliftParam;

        return obj1.volume === this.volume && obj1.stepMod === this.stepMod && obj1.stepDiv === this.stepDiv;
    }
}

export class ProcessorParam extends MoverParam {

    public static readonly LETTER = "P";

    min: number = 1;
    max: number = 6;
    union: boolean = false;

    constructor() {
        super(ProcessorParam.LETTER);
    }

    fillFromJson(value: any): PlaceParam {

        if (value.hasOwnProperty('s')) {
            this.secondaryFrom = value.s;
        }
        if (value.hasOwnProperty('i')) {
            this.min = value.i;
        }
        if (value.hasOwnProperty('a')) {
            this.max = value.a;
        }
        if (value.hasOwnProperty('u')) {
            this.union = value.u;
        }
        if (value.hasOwnProperty('n')) {
            this.name = value.n;
        }
        if (value.hasOwnProperty('w')) {
            this.workersName = value.w;
        }
        if (value.hasOwnProperty('r')) {
            this.random = value.r;
        }

        return this;
    }

    toJson(): any {

        return {
            't': this.type,
            'i': this.min,
            'a': this.max,
            'u': this.union,
            'n': this.name,
            'w': this.workersName,
            's': this.secondaryFrom,
            'r': this.random
        };
    }

    validate() {
        super.validate();
        if (this.min < 0) {
            this.errors.push(i18n.t('GameContext.ProcessorParam.min_below_zero'));
        }
        if (this.max < 1) {
            this.errors.push(i18n.t('GameContext.ProcessorParam.max_below_one'));
        }
        if (this.min > this.max) {
            this.errors.push(i18n.t('GameContext.ProcessorParam.max_below_min'));
        }
    }

    clone(): PlaceParam {
        const res = new ProcessorParam();
        res.secondaryFrom = this.secondaryFrom;
        res.name = this.name;
        res.workersName = this.workersName;
        res.random = this.random;
        res.min = this.min;
        res.max = this.max;
        res.union = this.union;
        return res;
    }

    equals(obj: PlaceParam): boolean {
        if (!super.equals(obj)) {
            return false;
        }

        const obj1 = obj as ProcessorParam;

        return obj1.min === this.min && obj1.max === this.max && obj1.union === this.union;
    }
}


export class InitParams {
    iterations: number = 200;
    expectedThroughput: number = 600;
    placeParams: PlaceParam[] = [];
    warehouseName: string = "";
    storeName: string = "";

    static parse(initStr: string): InitParams {

        try {
            const jsonStr = decode(initStr);

            const json = JSON.parse(jsonStr);
            const res = new InitParams();
            if (json.hasOwnProperty('i')) {
                res.iterations = json.i;
            }
            if (json.hasOwnProperty('t')) {
                res.expectedThroughput = json.t;
            }
            if (json.hasOwnProperty('w')) {
                res.warehouseName = json.w;
            }
            if (json.hasOwnProperty('s')) {
                res.storeName = json.s;
            }

            if (json.hasOwnProperty('p')) {
                const pars: any[] = json.p;

                pars.forEach(value => {
                    if (value.t === BufferParam.LETTER) {
                        res.placeParams.push(new BufferParam().fillFromJson(value));
                    } else if (value.t === ForkliftParam.LETTER) {
                        res.placeParams.push(new ForkliftParam().fillFromJson(value));
                    } else if (value.t === ProcessorParam.LETTER) {
                        res.placeParams.push(new ProcessorParam().fillFromJson(value));
                    }
                })
            }

            res.validate()
            return res;
        } catch (err) {
            console.log(err)
            return new InitParams();
        }
    }

    toInitString(): string {

        const json: any = {
            'i': this.iterations,
            't': this.expectedThroughput,
            'w': this.warehouseName,
            's': this.storeName,
            'p': []
        };

        this.placeParams.forEach(value => json.p.push(value.toJson()));

        const jsonStr = JSON.stringify(json);

        return encode(jsonStr);
    }

    validate(): void {
        this.placeParams.forEach(value => value.validate());

        if (this.placeParams.length > 0) {
            if (this.placeParams[0].type === BufferParam.LETTER) {
                this.placeParams[0].errors.push(i18n.t('GameContext.InitParams.first_buffer'));
            }

            let prevType = this.placeParams[0].type;

            for (let i = 1; i < this.placeParams.length; i++) {
                if (prevType === this.placeParams[i].type) {
                    this.placeParams[i].errors.push(i18n.t('GameContext.InitParams.two_same_types'));
                } else if (prevType === ForkliftParam.LETTER && this.placeParams[i].type === ProcessorParam.LETTER) {
                    this.placeParams[i].errors.push(i18n.t('GameContext.InitParams.buffer_processor'));
                } else if (prevType === ProcessorParam.LETTER && this.placeParams[i].type === ForkliftParam.LETTER) {
                    this.placeParams[i].errors.push(i18n.t('GameContext.InitParams.buffer_forklift'));
                }
                prevType = this.placeParams[i].type;
            }

            const lastIndex = this.placeParams.length - 1;
            if (this.placeParams[lastIndex].type === BufferParam.LETTER) {
                this.placeParams[lastIndex].errors.push(i18n.t('GameContext.InitParams.buffer_store'));
            }
        }
    }

    clone(): InitParams {

        const res = new InitParams()

        res.iterations = this.iterations;
        res.expectedThroughput = this.expectedThroughput;
        res.warehouseName = this.warehouseName;
        res.storeName = this.storeName;
        this.placeParams.forEach(value => res.placeParams.push(value.clone()));

        return res;
    }

    errors(): string[] {

        let res: string[] = [];

        this.placeParams.forEach(value => res.push(...value.errors));

        return res;
    }

    canLeaveResults(prev: InitParams) {

        if (prev.iterations !== this.iterations) {
            return false;
        }

        if (prev.placeParams.length !== this.placeParams.length) {
            return false;
        }

        for (let i = 0; i < this.placeParams.length; i++) {
            if (!this.placeParams[i].equals(prev.placeParams[i])) {
                return false;
            }
        }

        return true;
    }
}

export type GameContextType = {
    initParams: InitParams;
    setInitParams: (initParams: InitParams) => void;
}
export const GameContext = React.createContext<GameContextType | undefined>(undefined);
export const GameContextProvider = ({children}: PropsWithChildren<{}>) => {

    const {setGameResult} = useGameResultContext();

    const defaultInitStr = ""

    const searchParams = new URLSearchParams(document.location.search);

    let initStr: string;
    if (searchParams.size > 0) {
        initStr = searchParams.keys().next().value;
    } else {
        initStr = defaultInitStr;
    }

    const [initParams, setInitParamsNative] = useState<InitParams>(InitParams.parse(initStr));

    let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + initParams.toInitString();
    window.history.pushState({path: newUrl}, '', newUrl);

    const setInitParams = (newInitParams: InitParams) => {
        newInitParams.validate();

        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + newInitParams.toInitString();
        window.history.pushState({path: newUrl}, '', newUrl);

        if (!initParams.canLeaveResults(newInitParams)) {
            setGameResult(new GameResult());
        }

        setInitParamsNative(newInitParams);
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
