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

const runGame: GameRunCallback = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => {
    new GameRunner(initParams, gameResult, setGameResult).run();
}


function App() {

    const [showEditor, setShowEditor] = useState(true);

    const showEditorCallback: ShowEditorCallback = () => setShowEditor(true);
    const hideEditorCallback: HideEditorCallback = () => setShowEditor(false);

    return (
        <div className="App">
            <GameResultContextProvider key="GameResultContextProvider">
                <GameContextProvider key="GameContextProvider">
                    {showEditor && <div>
                        <PredefinedGames key="PredefinedGames"/>
                        <GameParamsEditor hideEditor={hideEditorCallback} key="GameParamsEditor"/>
                    </div>}
                    {!showEditor && <div>
                        <GameLauncher runGame={runGame} showEditor={showEditorCallback} key="GameLauncher"/>
                        <TotalGameGraph key="TotalGameGraph"/>
                        <LastGameGraph key="LastGameGraph"/>
                    </div>}
                    <GameTable key="GameTable"/>
                </GameContextProvider>
            </GameResultContextProvider>
        </div>
    );
}

export default App;
