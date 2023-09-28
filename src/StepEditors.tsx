import {FC} from "react";
import {
    BufferParam,
    ForkliftParam,
    InitParams,
    PlaceParam,
    ProcessorParam,
    SecondaryFromParam,
    useGameContext
} from "./GameContext";
import "./StepEditor.css"

export type IndexParam = {
    index: number;
}

function deleteParam(newInitParams: InitParams, index: number) {

    newInitParams.placeParams.splice(index, 1);

    for (const el of newInitParams.placeParams) {
        if (el.type === ProcessorParam.LETTER || el.type === ForkliftParam.LETTER) {
            if ((el as SecondaryFromParam).secondaryFrom === index + 1) {
                (el as SecondaryFromParam).secondaryFrom = 0;
            } else if ((el as SecondaryFromParam).secondaryFrom > index) {
                (el as SecondaryFromParam).secondaryFrom--;
            }
        }
    }

    return newInitParams;
}

export const Adder: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();

    function addStep(element: PlaceParam) {

        let newInitParams: InitParams = initParams.clone();
        const insertPos = indexParam.index - 1;
        newInitParams.placeParams.splice(insertPos, 0, element);

        for (const el of newInitParams.placeParams) {
            if (el.type === ProcessorParam.LETTER || el.type === ForkliftParam.LETTER) {
                if ((el as SecondaryFromParam).secondaryFrom >= indexParam.index) {
                    (el as SecondaryFromParam).secondaryFrom++;
                }
            }
        }
        setInitParams(newInitParams);
    }


    function addBuffer() {
        addStep(new BufferParam().setInitStr("4,0"));
    }

    function addForklift() {
        addStep(new ForkliftParam().setInitStr("0,100,1,1"));
    }

    function addProcessor() {
        addStep(new ProcessorParam().setInitStr("0,1,6"));
    }

    return <div className="GameParamsEditorAdder"><span>+</span>
        <ul>
            <li onClick={() => addBuffer()}>Добавить буффер</li>
            <li onClick={() => addForklift()}>Добавить перекладчик</li>
            <li onClick={() => addProcessor()}>Добавить процессор</li>
        </ul>
    </div>
}
export const BufferEditor: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();

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

    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorBufferEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title="Удалить"
        >&#x267B;</span>&#32;
        <strong>Буфер&nbsp;{indexParam.index}</strong><br/>
        Старт: <input type="number" value={(initParams.placeParams[indexParam.index - 1] as BufferParam).start}
                      min={0} max={1000} title="Число элементов в начале"
                      onChange={event => setStart(event.target.value)}/><br/>
        Лимит: <input type="number" value={(initParams.placeParams[indexParam.index - 1] as BufferParam).limit}
                      min={0} max={1000} title="Если больше 0, то максимальное число элементов в буфере"
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

    function setUnion(value: boolean) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ProcessorParam).union = value;
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
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as SecondaryFromParam).secondaryFrom = Number(value);
        setInitParams(newInitParams);
    }

    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorProcessorEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title="Удалить"
        >&#x267B;</span>&#32;
        <strong>Процессор&nbsp;{indexParam.index}</strong><br/>
        <select value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom}
                onChange={e => setSecondaryFrom(e.target.value)}
                title="Самостоятельный узел берёт настройки из параметров ниже&#13;
                    Ведомый берёт число элементов для перемещения от ведущего, но не больше собственной случайной мощности"
        >
            <option key={"prs-" + indexParam.index + "-val-0"} value={0}>Самостоятельный</option>
            {
                initParams.placeParams
                    .map((value, index) => index + 1)
                    .filter(value => value !== indexParam.index)
                    .filter(value => initParams.placeParams[value - 1].type === ProcessorParam.LETTER)
                    .filter(value => (initParams.placeParams[value - 1] as ProcessorParam).secondaryFrom === 0)
                    .map(value =>
                        <option
                            key={"pro-" + indexParam.index + "-val-" + value}
                            value={value}>{"Ведомый от " + value}</option>)
            }
        </select><br/>
        {(initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom !== 0 &&
            (<span><input type="checkbox"
                          checked={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).union}
                          id={"unioncb-" + indexParam.index} min={0} max={100}
                          onChange={event => setUnion(event.target.checked)}
                          title="Разделяет ресурс на несколько колонок.&#13;Ведущий процессор работает и в этом шаге."
            /><label htmlFor={"unioncb-" + indexParam.index}
                     title="Разделяет ресурс на несколько колонок.&#13;Ведущий процессор работает и в этом шаге."
            >Тот же</label><br/></span>)}
        {((initParams.placeParams[indexParam.index - 1] as ProcessorParam).secondaryFrom === 0 ||
                !(initParams.placeParams[indexParam.index - 1] as ProcessorParam).union) &&
            <span>Мин: <input type="number"
                              value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).min}
                              min={0} max={100} onChange={event => setMin(event.target.value)}
            /><br/>
            Макс: <input type="number"
                         value={(initParams.placeParams[indexParam.index - 1] as ProcessorParam).max}
                         min={0} max={100} onChange={event => setMax(event.target.value)}
                /><br/></span>}
        {initParams.placeParams[indexParam.index - 1].errors?.length > 0 &&
            <span className="Error"
                  title={initParams.placeParams[indexParam.index - 1].errors.join('\n')}
            >&#x26A0;</span>
        }
    </div>;
}

export const ForkliftEditor: FC<IndexParam> = (indexParam) => {

    const {initParams, setInitParams} = useGameContext();

    function setVolume(value: string) {
        let newInitParams = initParams.clone();
        (newInitParams.placeParams[indexParam.index - 1] as ForkliftParam).volume = Number(value);
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
        (newInitParams.placeParams[indexParam.index - 1] as SecondaryFromParam).secondaryFrom = Number(value);
        setInitParams(newInitParams);
    }

    function delStep() {
        setInitParams(deleteParam(initParams.clone(), indexParam.index - 1));
    }

    return <div
        className={"GameParamsEditorForkliftEditor" + (initParams.placeParams[indexParam.index - 1].errors?.length ? " Error" : "")}>
        <span className="Delete"
              onClick={() => delStep()}
              title="Удалить"
        >&#x267B;</span>&#32;
        <strong>Перекладчик&nbsp;{indexParam.index}</strong><br/>
        <select value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).secondaryFrom}
                onChange={e => setSecondaryFrom(e.target.value)}
                title="Самостоятельный узел берёт настройки из параметров ниже&#13;
                    Ведомый берёт число элементов для перемещения от ведущего"
        >
            <option key={"fls-" + indexParam.index + "-val-0"} value={0}>Самостоятельный</option>
            {
                initParams.placeParams
                    .map((value, index) => index + 1)
                    .filter(value => (initParams.placeParams[value - 1].type === ProcessorParam.LETTER) && (value !== indexParam.index))
                    .map(value =>
                        <option
                            key={"pro-" + indexParam.index + "-val-" + value}
                            value={value}>{"Ведомый от " + value}</option>)
            }
        </select><br/>
        {(initParams.placeParams[indexParam.index - 1] as ForkliftParam).secondaryFrom === 0 &&
            <span>Объём: <input type="number"
                                value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).volume}
                                min={0} max={100} onChange={event => setVolume(event.target.value)}/><br/>
        Работает:<br/>
        <input type="number" value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).stepMod}
               min={0} max={100} onChange={event => setStepMod(event.target.value)}/>
        /
        <input type="number" value={(initParams.placeParams[indexParam.index - 1] as ForkliftParam).stepDiv}
               min={0} max={100} onChange={event => setStepDiv(event.target.value)}/><br/></span>
        }
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
