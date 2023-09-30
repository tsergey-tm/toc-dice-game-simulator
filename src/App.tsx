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
                    {showEditor &&
                        <div className="EditorDiv">
                            <div className="EditorHelp"><span className="EditorHelpSign">&#8263;</span>
                                <div className="HelpContent">
                                    <p>Три типа блока. Каждому блоку можно дать название, которое будет отображаться в
                                        результатах. У активных блоков можно указать тип работников, например,
                                        разработчики, тестировщики и т.п.</p>
                                    <p>Буфер: пассивный блок, хранит элементы, настраивается значение на старте и лимит,
                                        который не превышать активные блоки.</p>
                                    <p>Перекладчик: активный блок, перемещает элементы.<br/>Два режима работы:
                                        <ul>
                                            <li>Самостоятельный: перекладывает указанный объем элементов каждый N шаг из
                                                M шагов. Например если N = 2 и M = 5, то во второй шаг из каждых пяти
                                            </li>
                                            <li>Ведомый: перекладывает объем элементов который переложил ведущий блок
                                            </li>
                                        </ul>
                                    </p>
                                    <p>Процессор: активный блок, перемещает элементы.<br/>Два режима работы:
                                        <ul>
                                            <li>Самостоятельный: перекладывает объем элементов который получится
                                                случайным распределением между минимальной и максимальной мощностью.
                                                Например для обычной игральной кости значения мощности 1-6
                                            </li>
                                            <li>Ведомый:
                                                <ul>
                                                    <li>Не выбран "Тот же": перекладывает объем элементов который выпал
                                                        у ведущего блока, но не больше чем распределение его собственной
                                                        мощности.
                                                    </li>
                                                    <li>Выбран "Тот же": ведущий блок работает и в этой колонке.
                                                        Приоритет отдаётся наиболее старым элементам.
                                                        Если у ведущего указан тип работников, то в результатах будет
                                                        показаны они и в этой колонке
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </p>
                                </div>
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
                </GameContextProvider>
            </GameResultContextProvider>
        </div>
    );
}

export default App;
