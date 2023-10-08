import {FC, JSX} from "react";
import {useGameResultContext} from "./GameResultContext";
import {BufferParam, ForkliftParam, MoverParam, ProcessorParam, useGameContext} from "./GameContext";
import "./GameTable.css"
import {useTranslation} from "react-i18next";

export const GameTable: FC = () => {

    const {gameResult} = useGameResultContext();
    const {initParams} = useGameContext();
    const {t} = useTranslation();

    return <table className="GameTable" key="gameTable">
        <thead>
        <tr>
            <th>#</th>
            <th>
                <strong>{initParams.warehouseName === "" ? t('GameTable.warehouse') : initParams.warehouseName}</strong><br/><br/>&#x221e;
            </th>
            {initParams.placeParams.map((value, index) => {
                if (value.type === BufferParam.LETTER) {

                    const bufferParam = value as BufferParam;

                    const name = bufferParam.name === "" ? t('GameTable.buffer', {num: index + 1}) : bufferParam.name;

                    return <th><strong>{name}</strong>
                        {(bufferParam.limit > 0) ? (
                            <span><br/><br/>{t('GameTable.with_limit')} {bufferParam.limit}</span>) : ""}</th>;
                } else if (value.type === ForkliftParam.LETTER) {

                    const flParam = value as ForkliftParam;

                    let secondaryText = (flParam.workersName === "") ? <span/> :
                        <span><br/><br/>{t('GameTable.who_work_here', {workersName: flParam.workersName})}</span>;

                    let text = (<span/>);
                    if (flParam.secondaryFrom > 0) {
                        const sec = initParams.placeParams[flParam.secondaryFrom - 1] as MoverParam;
                        text = (
                            <span><br/><br/>{t('GameTable.as_much_as_does')}<br/>{sec.name === "" ? t('GameTable.processor', {num: flParam.secondaryFrom}) : sec.name}</span>);
                    } else {
                        text = (<span>
                                <br/><br/>{t('GameTable.forklift_moves', {
                            volume: flParam.volume,
                            mod: flParam.stepMod,
                            div: flParam.stepDiv
                        })}</span>);
                    }

                    const name = flParam.name === "" ? t('GameTable.forklift', {num: index + 1}) : flParam.name;

                    return <th><strong>{name}</strong>{secondaryText}{text}</th>;
                } else {

                    const prParam = value as ProcessorParam;

                    let secondaryText: JSX.Element;
                    let workersName: string;
                    let powerText: JSX.Element;
                    if (prParam.secondaryFrom > 0) {
                        const sec = initParams.placeParams[prParam.secondaryFrom - 1] as MoverParam;
                        const secName = sec.name === "" ? t('GameTable.processor', {num: prParam.secondaryFrom}) : sec.name;
                        if (prParam.union) {
                            workersName = sec.workersName;
                            if (workersName === "") {
                                secondaryText = (
                                    <span><br/><br/>{t('GameTable.here_work_from', {secName: secName})}</span>);
                            } else {
                                secondaryText = (
                                    <span><br/><br/>{t('GameTable.who_work_here', {workersName: workersName})}</span>);
                            }
                            powerText = <span/>;
                        } else {
                            workersName = prParam.workersName;
                            secondaryText = (workersName === "") ? <span/> :
                                <span><br/><br/>{t('GameTable.who_work_here', {workersName: workersName})}</span>;
                            powerText = (
                                <span><br/><br/>{t('GameTable.work_as_min_max', {
                                    secName: secName,
                                    min: prParam.min,
                                    max: prParam.max
                                })}</span>);
                        }
                    } else {
                        powerText = (<span><br/><br/>{t('GameTable.ability', {
                            min: prParam.min,
                            max: prParam.max
                        })}</span>);
                        workersName = prParam.workersName;
                        secondaryText = (workersName === "") ? <span/> :
                            <span><br/><br/>{t('GameTable.who_work_here', {workersName: workersName})}</span>;
                    }

                    const name = prParam.name === "" ? t('GameTable.processor', {num: index + 1}) : prParam.name;

                    return <th><strong>{name}</strong>{secondaryText}{powerText}</th>;
                }
            })}
            <th><strong>{initParams.storeName === "" ? t('GameTable.output') : initParams.storeName}</strong></th>
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