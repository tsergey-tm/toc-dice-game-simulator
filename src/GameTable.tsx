import {FC} from "react";
import {useGameResultContext} from "./GameResultContext";
import {BufferParam, ForkliftParam, ProcessorParam, useGameContext} from "./GameContext";
import "./GameTable.css"

export const GameTable: FC = () => {

    const {initParams} = useGameContext();
    const {gameResult} = useGameResultContext();

    return <table className="GameTable">
        <thead>
        <tr>
            <th>#</th>
            <th>Склад<br/>&#x221e;</th>
            {initParams.placeParams.map((value, index) => {
                if (value.type === BufferParam.LETTER) {
                    const bufferParam = value as BufferParam;
                    return <th>Буфер {index + 1}{(bufferParam.limit > 0) ? (
                        <span><br/>с лимитом {bufferParam.limit}</span>) : ""}</th>;
                } else if (value.type === ForkliftParam.LETTER) {
                    const flParam = value as ForkliftParam;
                    let text = (<span/>);
                    if (flParam.secondaryFrom > 0) {
                        text = (<span><br/>ведомый от {flParam.secondaryFrom}</span>);
                    } else {
                        text = (<span>
                                <br/>переносит {flParam.volume}<br/>в {flParam.stepMod} шаг<br/>каждые {flParam.stepDiv}
                            </span>);
                    }

                    return <th>Перекладчик {index + 1}{text}
                    </th>;
                } else {
                    const prParam = value as ProcessorParam;
                    let secondaryText = (<span/>);
                    let powerText = (<span><br/>мощность {prParam.min}-{prParam.max}</span>);
                    if (prParam.secondaryFrom > 0) {
                        if (prParam.union) {
                            secondaryText = (<span><br/>тут работает {prParam.secondaryFrom}</span>);
                            powerText = <span/>;
                        } else {
                            secondaryText = (<span><br/>ведомый от {prParam.secondaryFrom}</span>);
                        }
                    }
                    return <th>Процессор {index + 1}{secondaryText}{powerText}</th>;
                }
            })}
            <th>Выход</th>
        </tr>
        </thead>
        <tbody>
        {gameResult.rows.map(
            (value, index) =>
                (<tr>
                    <td>{gameResult.rows.length - index}</td>
                    {
                        value.map(
                            cell =>
                                (cell.isBuffer) ? (<td><span>{cell.count}</span></td>) : (
                                    <td><span className="gridCount">{cell.count}</span><br/><span
                                        className="gridMay">{cell.may}</span></td>)
                        )
                    }
                </tr>)
        )}
        </tbody>
    </table>;
}