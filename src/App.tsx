import React from 'react';
import './App.css';
import {GameContextProvider, InitParams} from "./GameContext";
import {GameParamsEditor, GameRunEvent} from "./GameParamsEditor";
import {GameResult, GameResultContextProvider, SetGameResult} from "./GameResultContext";
import {GameRunner} from "./Game";
import {GameTable} from "./GameTable";
import {LastGameGraph} from "./LastGameGraph";
import {TotalGameGraph} from "./TotalGameGraph";
import {PredefinedGames} from "./PredefinedGames";

const runGame: GameRunEvent = (initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) => {
    new GameRunner(initParams, gameResult, setGameResult).run();
}

function App() {
    return (
        <div className="App">
            <GameResultContextProvider key="GameResultContextProvider">
                <GameContextProvider key="GameContextProvider">
                    <PredefinedGames key="PredefinedGames"/>
                    <GameParamsEditor runGame={runGame} key="GameParamsEditor"/>
                    <TotalGameGraph key="TotalGameGraph"/>
                    <LastGameGraph key="LastGameGraph"/>
                    <GameTable key="GameTable"/>
                </GameContextProvider>
            </GameResultContextProvider>
        </div>
    );
}

export default App;
