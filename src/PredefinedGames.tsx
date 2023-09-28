import {FC} from "react";
import {InitParams, useGameContext} from "./GameContext";

export const PredefinedGames: FC = () => {

    const {setInitParams} = useGameContext();

    return <div>Готовые рецепты:
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0;B4,0;P0,1,6,0"))}>
            Сбалансированная система
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;P0,2,12,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B4,0;P0,1,6,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0"))}>
            Несбалансированная система
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;F9,100,1,1;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B20,0;P0,1,6,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0"))}>
            Барабан-Буфер-Канат
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;F9,100,1,1;B4,0;P0,3,18,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B20,0;P0,1,6,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0"))}>
            Барабан-Буфер-Канат с улучшением в избыточном ресурсе
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;F9,100,1,1;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0;B20,0;P0,4,6,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0"))}>
            Барабан-Буфер-Канат с улучшением в ограничении
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;F9,100,1,1;B8,0;P0,2,12,0;B8,0;P0,2,12,0;B8,0;P0,2,12,0;B40,0;P0,1,6,0;B8,0;P0,2,12,0;B8,0;P0,2,12,0"))}>
            Барабан-Буфер-Канат с большими буферами
        </button>
        <button
            onClick={event => setInitParams(new InitParams().setInitStr("200;700;P0,2,12,0;B4,4;P0,2,12,0;B4,4;P0,2,12,0;B20,20;P0,1,6,0;B4,0;P0,2,12,0;B4,0;P0,2,12,0"))}>
            Канбан
        </button>
    </div>;
}