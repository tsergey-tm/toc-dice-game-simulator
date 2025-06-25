import React, {FC} from "react";
import {
    BufferParam,
    ForkliftParam,
    InitParams,
    MoverParam,
    PlaceParam,
    ProcessorParam,
    useGameContext
} from "./GameContext";
import "./StepEditor.css"
import {useTranslation} from "react-i18next";

export type IndexParam = {
    index: number;
}


function deleteParam(newInitParams: InitParams, index: number) {

    newInitParams.placeParams.splice(index, 1);

    for (const el of newInitParams.placeParams) {
        if (el.type === ProcessorParam.LETTER || el.type === ForkliftParam.LETTER) {
            if ((el as MoverParam).secondaryFrom === index + 1) {
                (el as MoverParam).secondaryFrom = 0;
            } else if ((el as MoverParam).secondaryFrom > index) {
                (el as MoverParam).secondaryFrom--;
            }
        }
    }

    return newInitParams;
}

function makeSecondaryProcessor(newInitParams: InitParams, index: number) {

    for (const el of newInitParams.placeParams) {
        if (el.type === ProcessorParam.LETTER && (el as ProcessorParam).secondaryFrom === index + 1) {
            (el as ProcessorParam).secondaryFrom = 0;
            (el as ProcessorParam).union = false;
        }
    }

    return newInitParams;
}

export const Adder: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();
    const {t} = useTranslation();

    function addStep(element: PlaceParam) {

        let newInitParams: InitParams = initParams.clone();
        const insertPos = indexParam.index - 1;
        newInitParams.placeParams.splice(insertPos, 0, element);

        for (const el of newInitParams.placeParams) {
            if (el.type === ProcessorParam.LETTER || el.type === ForkliftParam.LETTER) {
                if ((el as MoverParam).secondaryFrom >= indexParam.index) {
                    (el as MoverParam).secondaryFrom++;
                }
            }
        }
        setInitParams(newInitParams);
    }


    function addBuffer() {
        addStep(new BufferParam());
    }

    function addForklift() {
        addStep(new ForkliftParam());
    }

    function addProcessor() {
        addStep(new ProcessorParam());
    }

    return <div className="GameParamsEditorAdder"><span>+</span>
        <ul>
            <li onClick={() => addBuffer()}>{t('StepEditor.add_buffer')}</li>
            <li onClick={() => addForklift()}>{t('StepEditor.add_forklift')}</li>
            <li onClick={() => addProcessor()}>{t('StepEditor.add_processor')}</li>
        </ul>
    </div>
}

export const BufferEditor: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();
    const {t} = useTranslation();

    function setStart(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as BufferParam).start = Number(value);
        setInitParams(newInitParams);
    }

    function setLimit(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as BufferParam).limit = Number(value);
        setInitParams(newInitParams);
    }

    function setName(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as BufferParam).name = value;
        setInitParams(newInitParams);
    }

    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorBufferEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title={t('StepEditor.BufferEditor.delete')}
        >&#x267B;</span>&nbsp; &nbsp;
        <strong>{t('StepEditor.BufferEditor.buffer', {num: indexParam.index})}</strong><br/><br/>
        {t('StepEditor.BufferEditor.name')}:<br/>
        <input type="text"
               value={initParams.placeParams[indexParam.index - 1].name} size={10}
               onChange={event => setName(event.target.value)}
        /><br/><br/>
        {t('StepEditor.BufferEditor.start')}: <input type="number"
                                                     value={(initParams.placeParams[indexParam.index - 1] as BufferParam).start}
                                                     min={0} max={1000} title={t('StepEditor.BufferEditor.start_hint')}
                                                     onChange={event => setStart(event.target.value)}/><br/>
        {t('StepEditor.BufferEditor.limit')}: <input type="number"
                                                     value={(initParams.placeParams[indexParam.index - 1] as BufferParam).limit}
                                                     min={0} max={1000}
                                                     title={t('StepEditor.BufferEditor.limit_hint')}
                                                     onChange={event => setLimit(event.target.value)}/><br/>
        {initParams.placeParams[indexParam.index - 1].errors?.length > 0 &&
            <span className="Error"
                  title={initParams.placeParams[indexParam.index - 1].errors.join('\n')}
            >&#x26A0;</span>
        }
    </div>;
}

export const ProcessorEditor: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();
    const {t} = useTranslation();

    function setUnion(value: boolean) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).union = value;
        setInitParams(newInitParams);
    }

    function setRandom(value: boolean) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).random = value;
        setInitParams(newInitParams);
    }

    function setMin(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).min = Number(value);
        setInitParams(newInitParams);
    }

    function setMax(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).max = Number(value);
        setInitParams(newInitParams);
    }

    function setSecondaryFrom(value: string) {
        const val: number = Number(value);

        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).secondaryFrom = val;
        if (
            (val === 0) &&
            (newInitParams.placeParams[indexParam.index - 1].type === ProcessorParam.LETTER)
        ) {
            (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).union = false;
        }
        makeSecondaryProcessor(newInitParams, indexParam.index - 1);
        setInitParams(newInitParams);
    }

    function setName(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).name = value;
        setInitParams(newInitParams);
    }

    function setWorkedName(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).workersName = value;
        setInitParams(newInitParams);
    }

    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorProcessorEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title={t('StepEditor.ProcessorEditor.delete')}
        >&#x267B;</span>&nbsp; &nbsp;
        <strong>{t('StepEditor.ProcessorEditor.processor', {num: indexParam.index})}</strong><br/><br/>
        {t('StepEditor.ProcessorEditor.name')}:<br/>
        <input type="text"
               value={initParams.placeParams[indexParam.index - 1].name} size={10}
               onChange={event => setName(event.target.value)}
        /><br/>
        {((initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom === 0 ||
                !(initParams.placeParams[indexParam.index - 1] as ProcessorParam).union) &&
            <span>{t('StepEditor.ProcessorEditor.workers')}:<br/>
        <input type="text"
               value={(initParams.placeParams[indexParam.index - 1] as MoverParam).workersName} size={10}
               onChange={event => setWorkedName(event.target.value)}
        /><br/></span>}
        <br/>
        <select value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom}
                onChange={e => setSecondaryFrom(e.target.value)}
                title={t('StepEditor.ProcessorEditor.type.hint')}
        >
            <option key={"prs-" + indexParam.index + "-val-0"}
                    value={0}>{t('StepEditor.ProcessorEditor.type.primary')}
            </option>
            {
                initParams.placeParams
                    .map((value, index) => index + 1)
                    .filter(value => value !== indexParam.index)
                    .filter(value => initParams.placeParams[value - 1].type === ProcessorParam.LETTER)
                    .filter(value => (initParams.placeParams[value - 1] as ProcessorParam).secondaryFrom === 0)
                    .map(value =>
                        <option
                            key={"pro-" + indexParam.index + "-val-" + value}
                            value={value}>{t('StepEditor.ProcessorEditor.type.secondary', {name: value})}</option>)
            }
        </select><br/>
        {(initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom !== 0 &&
            (<span><input type="checkbox"
                          checked={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).union}
                          id={"unioncb-" + indexParam.index} min={0} max={100}
                          onChange={event => setUnion(event.target.checked)}
                          title={t('StepEditor.ProcessorEditor.union.hint')}
            /><label htmlFor={"unioncb-" + indexParam.index}
                     title={t('StepEditor.ProcessorEditor.union.hint')}
            >{t('StepEditor.ProcessorEditor.union.text')}</label><br/></span>)}
        {((initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom === 0 ||
                !(initParams.placeParams[indexParam.index - 1] as ProcessorParam).union) &&
            <span>{t('StepEditor.ProcessorEditor.min')}: <input type="number"
                                                                value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).min}
                                                                min={0} max={100}
                                                                title={t('StepEditor.ProcessorEditor.min_title')}
                                                                onChange={event => setMin(event.target.value)}
            /><br/>
                {t('StepEditor.ProcessorEditor.max')}: <input type="number"
                                                              value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).max}
                                                              min={0} max={100}
                                                              title={t('StepEditor.ProcessorEditor.max_title')}
                                                              onChange={event => setMax(event.target.value)}
                /><br/></span>}
        <span><input type="checkbox" checked={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).random}
                     id={"randomcb-" + indexParam.index}
                     onChange={event => setRandom(event.target.checked)}
                     title={t('StepEditor.ProcessorEditor.random.hint')}
        /><label htmlFor={"randomcb-" + indexParam.index}
                 title={t('StepEditor.ProcessorEditor.random.hint')}
        >{t('StepEditor.ProcessorEditor.random.text')}</label><br/></span>
        {initParams.placeParams[indexParam.index - 1].errors?.length > 0 &&
            <span className="Error"
                  title={initParams.placeParams[indexParam.index - 1].errors.join('\n')}
            >&#x26A0;</span>
        }
    </div>;
}

export const ForkliftEditor: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();
    const {t} = useTranslation();

    function setVolume(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ForkliftParam).volume = Number(value);
        setInitParams(newInitParams);
    }

    function setRandom(value: boolean) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ForkliftParam).random = value;
        setInitParams(newInitParams);
    }

    function setStepMod(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ForkliftParam).stepMod = Number(value);
        setInitParams(newInitParams);
    }

    function setStepDiv(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ForkliftParam).stepDiv = Number(value);
        setInitParams(newInitParams);
    }

    function setSecondaryFrom(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).secondaryFrom = Number(value);
        setInitParams(newInitParams);
    }

    function setName(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).name = value;
        setInitParams(newInitParams);
    }

    function setWorkedName(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as MoverParam).workersName = value;
        setInitParams(newInitParams);
    }


    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorForkliftEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title={t('StepEditor.ForkliftEditor.delete')}
        >&#x267B;</span>&nbsp; &nbsp;
        <strong>{t('StepEditor.ForkliftEditor.forklift', {num: indexParam.index})}</strong><br/><br/>
        {t('StepEditor.ForkliftEditor.name')}:<br/>
        <input type="text"
               value={initParams.placeParams[indexParam.index - 1].name} size={10}
               onChange={event => setName(event.target.value)}
        /><br/>
        {t('StepEditor.ForkliftEditor.workers')}:<br/>
        <input type="text"
               value={(initParams.placeParams[indexParam.index - 1] as MoverParam).workersName} size={10}
               onChange={event => setWorkedName(event.target.value)}
        /><br/><br/>
        <select value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).secondaryFrom}
                onChange={e => setSecondaryFrom(e.target.value)}
                title={t('StepEditor.ForkliftEditor.type.hint')}
        >
            <option key={"fls-" + indexParam.index + "-val-0"}
                    value={0}>{t('StepEditor.ForkliftEditor.type.primary')}</option>
            {
                initParams.placeParams
                    .map((value, index) => index + 1)
                    .filter(value => (initParams.placeParams[value - 1].type === ProcessorParam.LETTER) && (value !== indexParam.index))
                    .map(value =>
                        <option
                            key={"pro-" + indexParam.index + "-val-" + value}
                            value={value}>{t('StepEditor.ForkliftEditor.type.secondary', {name: value})}</option>)
            }
        </select><br/>
        {(initParams.placeParams[indexParam.index - 1] as ForkliftParam).secondaryFrom === 0 &&
            <span>{t('StepEditor.ForkliftEditor.volume')}: <input type="number"
                                                                  value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).volume}
                                                                  min={1} max={100}
                                                                  onChange={event => setVolume(event.target.value)}/><br/>
                {t('StepEditor.ForkliftEditor.worked')}:<br/>
        <input type="number" value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).stepMod}
               min={1} max={100} onChange={event => setStepMod(event.target.value)}/>
        /
        <input type="number" value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).stepDiv}
               min={1} max={100} onChange={event => setStepDiv(event.target.value)}/><br/></span>
        }
        <span><input type="checkbox" checked={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).random}
                     id={"randomcb-" + indexParam.index}
                     onChange={event => setRandom(event.target.checked)}
                     title={t('StepEditor.ForkliftEditor.random.hint')}
        /><label htmlFor={"randomcb-" + indexParam.index}
                 title={t('StepEditor.ForkliftEditor.random.hint')}
        >{t('StepEditor.ForkliftEditor.random.text')}</label><br/></span>
        {initParams.placeParams[indexParam.index - 1].errors?.length > 0 &&
            <span className="Error"
                  title={initParams.placeParams[indexParam.index - 1].errors.join('\n')}
            >&#x26A0;</span>
        }
    </div>;
}

export const StepEditor: FC<IndexParam> = (indexParam) => {

    const {initParams} = useGameContext();
    if (indexParam.index < 0) {
        return <Adder index={-indexParam.index} key={"add-" + (-indexParam.index)}/>;
    } else if (initParams.placeParams[indexParam.index - 1].type === ForkliftParam.LETTER) {
        return <ForkliftEditor index={indexParam.index} key={"fle-" + indexParam.index}/>;
    } else if (initParams.placeParams[indexParam.index - 1].type === ProcessorParam.LETTER) {
        return <ProcessorEditor index={indexParam.index} key={"pre-" + indexParam.index}/>;
    } else {
        return <BufferEditor index={indexParam.index} key={"bue-" + indexParam.index}/>;
    }
}
