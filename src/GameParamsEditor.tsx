import React, {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";
import "./GameParamsEditor.css"
import {Adder, StepEditor} from "./StepEditors";
import {GameResult, SetGameResult, useGameResultContext} from "./GameResultContext";

export type GameRunEvent = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => void;

export type GameParamsEditorParams = {
    runGame: GameRunEvent;
}

export const GameParamsEditor: FC<GameParamsEditorParams> = (params: GameParamsEditorParams) => {

    const {initParams, setInitParams} = useGameContext();
    const {gameResult, setGameResult} = useGameResultContext();

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

    return <div className="GameParamsEditorInactiveEditor">
        <div><strong>Итераций</strong><br/>
            <input type="number" min={1} max={1000} value={initParams.iterations}
                   onChange={event => changeIterations(event.target.value)}/><br/>
            <button disabled={initParams.errors().length > 0} id="runGame" className="RunGameButton"
                    onClick={event => params.runGame(initParams, gameResult, setGameResult)}
            >Запуск
            </button>
        </div>
        <div className="GameParamsEditorBox"><strong>Склад</strong><br/>&#x221e;</div>
        {initParams.placeParams.map((value, index) => index + 1)
            .flatMap(value => [-value, value])
            .map(value => (<StepEditor index={value}/>))}
        <Adder index={initParams.placeParams.length + 1} key={"add-" + (initParams.placeParams.length + 1)}/>
        <div className="GameParamsEditorBox"><strong>Выход</strong><br/>
            Ожидание<br/><input type="number" min={1} max={10000} value={initParams.expectedThroughput}
                                onChange={event => changeExpectedThroughput(event.target.value)}/><br/>
        </div>
    </div>;
}