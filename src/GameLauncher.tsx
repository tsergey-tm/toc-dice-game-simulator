import React, {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";
import {GameResult, SetGameResult, useGameResultContext} from "./GameResultContext";
import "./GameLauncher.css"

export type ShowEditorCallback = () => void;

export type GameRunCallback = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => void;

export type GameParamsEditorParams = {
    runGame: GameRunCallback;
    showEditor: ShowEditorCallback;
}


export const GameLauncher: FC<GameParamsEditorParams> = (params: GameParamsEditorParams) => {

    const {initParams, setInitParams} = useGameContext();
    const {gameResult, setGameResult} = useGameResultContext();


    function changeExpectedThroughput(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.expectedThroughput = Number(value);
        setInitParams(newInitParams);
    }

    return <div className="GameLauncher">
        <button disabled={initParams.errors().length > 0} id="runGame" className="RunGameButton"
                onClick={event => params.runGame(initParams, gameResult, setGameResult)}
        >Запуск {initParams.iterations} итераций
        </button>
        &nbsp; &nbsp;Ожидание в колонке {initParams.storeName === "" ? "Выход" : initParams.storeName}:
        <input type="number" min={1} max={10000}
               value={initParams.expectedThroughput}
               onChange={event => changeExpectedThroughput(event.target.value)}/>
        &nbsp; &nbsp;
        <button onClick={event => params.showEditor()} className="ShowGameEditorButton">Показать редактор</button>
    </div>;
}