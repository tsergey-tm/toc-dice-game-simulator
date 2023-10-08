import React, {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";
import {GameResult, SetGameResult, useGameResultContext} from "./GameResultContext";
import "./GameLauncher.css"
import {useTranslation} from "react-i18next";

export type ShowEditorCallback = () => void;

export type GameRunCallback = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => void;

export type GameParamsEditorParams = {
    runGame: GameRunCallback;
    showEditor: ShowEditorCallback;
}


export const GameLauncher: FC<GameParamsEditorParams> = (params: GameParamsEditorParams) => {

    const {initParams, setInitParams} = useGameContext();
    const {gameResult, setGameResult} = useGameResultContext();
    const {t} = useTranslation();


    function changeExpectedThroughput(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.expectedThroughput = Number(value);
        setInitParams(newInitParams);
    }

    return <div className="GameLauncher">
        <button disabled={initParams.errors().length > 0} id="runGame" className="RunGameButton"
                onClick={() => params.runGame(initParams, gameResult, setGameResult)}
        >{t('launcher.run', {iterations: initParams.iterations})}</button>
        &nbsp; &nbsp;{t('GameLauncher.expected_throughput')}:
        <input type="number" min={1} max={10000}
               value={initParams.expectedThroughput}
               onChange={event => changeExpectedThroughput(event.target.value)}/>
        &nbsp; &nbsp;
        <button onClick={() => params.showEditor()}
                className="ShowGameEditorButton">{t('GameLauncher.show_editor')}</button>
    </div>;
}