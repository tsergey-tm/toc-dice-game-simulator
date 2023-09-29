import {FC, JSX} from "react";
import {useGameResultContext} from "./GameResultContext";
import {BufferParam, ForkliftParam, MoverParam, ProcessorParam, useGameContext} from "./GameContext";
import "./GameTable.css"

export const GameTable: FC = () => {

    const {initParams} = useGameContext();
    const {gameResult} = useGameResultContext();

    return <table className="GameTable" key="gameTable">
        <thead>
        <tr>
            <th>#</th>
            <th>
                <strong>{initParams.warehouseName === "" ? "Склад" : initParams.warehouseName}</strong><br/><br/>&#x221e;
            </th>
            {initParams.placeParams.map((value, index) => {
                if (value.type === BufferParam.LETTER) {

                    const bufferParam = value as BufferParam;

                    const name = bufferParam.name === "" ? ("Буфер " + (index + 1)) : bufferParam.name;

                    return <th><strong>{name}</strong>
                        {(bufferParam.limit > 0) ? (
                            <span><br/><br/>с лимитом {bufferParam.limit}</span>) : ""}</th>;
                } else if (value.type === ForkliftParam.LETTER) {

                    const flParam = value as ForkliftParam;

                    let secondaryText = (flParam.workersName === "") ? <span/> :
                        <span><br/><br/>тут работают<br/>{flParam.workersName}</span>;

                    let text = (<span/>);
                    if (flParam.secondaryFrom > 0) {
                        const sec = initParams.placeParams[flParam.secondaryFrom - 1] as MoverParam;
                        text = (
                            <span><br/><br/>сколько сделает<br/>{sec.name === "" ? ("Процессор " + flParam.secondaryFrom) : sec.name}</span>);
                    } else {
                        text = (<span>
                                <br/><br/>переносит {flParam.volume} шт.<br/>в {flParam.stepMod} шаг<br/>каждые {flParam.stepDiv} шагов
                            </span>);
                    }

                    const name = flParam.name === "" ? "Перекладчик" + (index + 1) : flParam.name;

                    return <th><strong>{name}</strong>{secondaryText}{text}</th>;
                } else {

                    const prParam = value as ProcessorParam;

                    let secondaryText: JSX.Element;
                    let workersName: string;
                    let powerText: JSX.Element;
                    if (prParam.secondaryFrom > 0) {
                        const sec = initParams.placeParams[prParam.secondaryFrom - 1] as MoverParam;
                        const secName = sec.name === "" ? ("Процессор " + prParam.secondaryFrom) : sec.name;
                        if (prParam.union) {
                            workersName = sec.workersName;
                            if (workersName === "") {
                                secondaryText = (<span><br/><br/>тут работают из<br/>{secName}</span>);
                            } else {
                                secondaryText = (<span><br/><br/>тут работают<br/>{workersName}</span>);
                            }
                            powerText = <span/>;
                        } else {
                            workersName = prParam.workersName;
                            secondaryText = (workersName === "") ? <span/> :
                                <span><br/><br/>тут работают<br/>{workersName}</span>;
                            powerText = (
                                <span><br/><br/>сколько выпало у <br/>{secName},<br/>но не больше {prParam.min}-{prParam.max}</span>);
                        }
                    } else {
                        powerText = (<span><br/><br/>мощность {prParam.min}-{prParam.max}</span>);
                        workersName = prParam.workersName;
                        secondaryText = (workersName === "") ? <span/> :
                            <span><br/><br/>тут работают<br/>{workersName}</span>;
                    }

                    const name = prParam.name === "" ? ("Процессор " + (index + 1)) : prParam.name;

                    return <th><strong>{name}</strong>{secondaryText}{powerText}</th>;
                }
            })}
            <th><strong>{initParams.storeName === "" ? "Выход" : initParams.storeName}</strong></th>
        </tr>
        </thead>
        <tbody>
        {gameResult.rows.map(
            (value, index) =>
                (<tr>
                    <td>{gameResult.rows.length - index - 1}</td>
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