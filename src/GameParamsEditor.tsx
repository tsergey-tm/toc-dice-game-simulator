import React, {FC} from "react";
import {useGameContext} from "./GameContext";
import "./GameParamsEditor.css"
import {Adder, StepEditor} from "./StepEditors";
import {useTranslation} from "react-i18next";

export type HideEditorCallback = () => void;


export const GameParamsEditor: FC<{ hideEditor: HideEditorCallback }> = ({hideEditor}) => {

    const {initParams, setInitParams} = useGameContext();
    const {t} = useTranslation();

    function changeIterations(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.iterations = Number(value);
        setInitParams(newInitParams);
    }

    function changeExpectedThroughput(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.expectedThroughput = Number(value);
        setInitParams(newInitParams);
    }

    function changeWarehouseName(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.warehouseName = value;
        setInitParams(newInitParams);
    }

    function changeStoreName(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.storeName = value;
        setInitParams(newInitParams);
    }

    return <div className="GameParamsEditor" key="GameParamsEditor">
        <div><strong>{t('GameParamsEditor.iterations')}</strong><br/>
            <input type="number" min={1} max={1000} value={initParams.iterations}
                   onChange={event => changeIterations(event.target.value)}/><br/><br/>
            <button disabled={initParams.errors().length > 0} id="runGame" className="RunGameButton"
                    onClick={event => hideEditor()}
            >{t('GameParamsEditor.close_editor')}
            </button>
        </div>
        <div className="GameParamsEditorBox"><strong>{t('GameParamsEditor.warehouse')}</strong><br/><br/>
            {t('GameParamsEditor.name')}:<br/>
            <input type="text" value={initParams.warehouseName} size={10}
                   onChange={event => changeWarehouseName(event.target.value)}
            />
            <br/><br/>&#x221e;
        </div>
        {initParams.placeParams.map((value, index) => index + 1)
            .flatMap(value => [-value, value])
            .map(value => (<StepEditor index={value}/>))}
        <Adder index={initParams.placeParams.length + 1} key={"add-" + (initParams.placeParams.length + 1)}/>
        <div className="GameParamsEditorBox"><strong>{t('GameParamsEditor.output')}</strong><br/><br/>
            {t('GameParamsEditor.name')}:<br/>
            <input type="text" value={initParams.storeName} size={10}
                   onChange={event => changeStoreName(event.target.value)}
            /><br/><br/>
            {t('GameParamsEditor.expected_throughput')}<br/>
            <input type="number" min={1} max={10000}
                   value={initParams.expectedThroughput}
                   onChange={event => changeExpectedThroughput(event.target.value)}/><br/>
        </div>
    </div>;
}