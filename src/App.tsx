import React, {useState} from 'react';
import './App.css';
import {GameContextProvider, InitParams} from "./GameContext";
import {GameParamsEditor, HideEditorCallback} from "./GameParamsEditor";
import {GameResult, GameResultContextProvider, SetGameResult} from "./GameResultContext";
import {GameRunner} from "./Game";
import {GameTable} from "./GameTable";
import {LastGameGraph} from "./LastGameGraph";
import {TotalGameGraph} from "./TotalGameGraph";
import {PredefinedGames} from "./PredefinedGames";
import {GameLauncher, GameRunCallback, ShowEditorCallback} from "./GameLauncher";
import ReactModal from 'react-modal';
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "./i18n";
import {HistoryResultContextProvider} from "./GameHistoryContext";

const runGame: GameRunCallback = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult, count: number) => {

    setTimeout(() => {
        let _gameResult: GameResult = gameResult.clone();

        function _setGameResult(__gameResult: GameResult): void {
            _gameResult = __gameResult;
        }

        for (let i = 0; i < count; i++) {
            new GameRunner(initParams, _gameResult, _setGameResult).run();
        }
        setGameResult(_gameResult);
    }, 0);
}


function App() {

    const {t} = useTranslation();
    const [showEditor, setShowEditor] = useState(true);
    const [showHelp, setShowHelp] = useState(false);

    const showEditorCallback: ShowEditorCallback = () => setShowEditor(true);
    const hideEditorCallback: HideEditorCallback = () => setShowEditor(false);

    return (
        <div className="App">
            <GameResultContextProvider key="GameResultContextProvider">
                <GameContextProvider key="GameContextProvider">
                    <HistoryResultContextProvider key="GameContextProvider">
                        <LanguageSwitcher/>
                        {showEditor &&
                            <div className="EditorDiv">
                                <div className="EditorHelp">
                                    <button className="EditorHelpSign" title={t('EditorHelp.hint')}
                                            onClick={() => setShowHelp(true)}>&#8263;</button>
                                    <ReactModal isOpen={showHelp}>
                                        <button onClick={() => setShowHelp(false)}>{t('help.close')}</button>
                                        <div className="HelpContent"
                                             dangerouslySetInnerHTML={{__html: t('help.text')}}/>
                                        <button onClick={() => setShowHelp(false)}>{t('help.close')}</button>
                                    </ReactModal>
                                </div>
                                <PredefinedGames key="PredefinedGames"/>
                                <GameParamsEditor hideEditor={hideEditorCallback} key="GameParamsEditor"/>
                            </div>
                        }
                        {!showEditor && <div>
                            <GameLauncher runGame={runGame} showEditor={showEditorCallback} key="GameLauncher"/>
                            <TotalGameGraph key="TotalGameGraph"/>
                            <LastGameGraph key="LastGameGraph"/>
                        </div>}
                        <GameTable key="GameTable"/>
                    </HistoryResultContextProvider>
                </GameContextProvider>
            </GameResultContextProvider>
        </div>
    );
}

export default App;
