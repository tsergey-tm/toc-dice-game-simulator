import React, {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";
import {GameResult, SetGameResult, useGameResultContext} from "./GameResultContext";
import "./GameLauncher.css"
import {useTranslation} from "react-i18next";
import {useHistoryResultContext} from "./GameHistoryContext";

export type ShowEditorCallback = () => void;

export type GameRunCallback = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => void;

export type GameParamsEditorParams = {
    runGame: GameRunCallback;
    showEditor: ShowEditorCallback;
}


export const GameLauncher: FC<GameParamsEditorParams> = (params: GameParamsEditorParams) => {

    const {initParams, setInitParams} = useGameContext();
    const {gameResult, setGameResult} = useGameResultContext();
    const {historyResult, setHistoryResult} = useHistoryResultContext();
    const {t} = useTranslation();


    function changeExpectedThroughput(value: string) {
        let newInitParams = initParams.clone();
        newInitParams.expectedThroughput = Number(value);
        setInitParams(newInitParams);
    }

    function showEditor() {
        if (historyResult.isShowed) {
            let newHistoryResult = historyResult.clone();
            newHistoryResult.isShowed = !newHistoryResult.isShowed;
            setHistoryResult(newHistoryResult);
        }
        params.showEditor();
    }

    function changeComparisonShow() {
        let newHistoryResult = historyResult.clone();
        newHistoryResult.isShowed = !newHistoryResult.isShowed;
        setHistoryResult(newHistoryResult);
    }

    function storeComparison() {
        let newHistoryResult = historyResult.clone();
        newHistoryResult.store(gameResult);
        setHistoryResult(newHistoryResult);
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
        <button onClick={() => showEditor()}
                className="ShowGameEditorButton">{t('GameLauncher.show_editor')}</button>
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <button onClick={() => storeComparison()}
                className="StoreButton">{t('GameLauncher.comparison_store')}</button>
        &nbsp; &nbsp;
        {historyResult.throughputs.length > 0 ? <button onClick={() => changeComparisonShow()}
                                                        className="StoreButton">{historyResult.isShowed ?
            t('GameLauncher.comparison_hide') :
            t('GameLauncher.comparison_show')}</button> : <span/>}
    </div>;
}