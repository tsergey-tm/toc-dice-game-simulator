import {FC} from "react";
import {useGameContext} from "./GameContext";
import {useGameResultContext} from "./GameResultContext";
// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
// Import charts, all with Chart suffix
import {BarChart, LineChart} from 'echarts/charts';
// import components, all suffixed with Component
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent,} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {CanvasRenderer,} from 'echarts/renderers';
import {EChartsOption, LineSeriesOption, SeriesOption} from "echarts";

// Register the required components
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, LineChart, LegendComponent,
        ToolboxComponent]
);


export const LastGameGraph: FC = () => {

    const {initParams} = useGameContext();
    const {gameResult} = useGameResultContext();


    function makeFlowSeries() {
        let serFlowData: number[][] = [];
        let serFlowMeanData: number[][] = [];
        let serFlowMeanDeltaData: number[][] = [];

        if (gameResult.rows.length > 0) {
            const finish = gameResult.rows[0].length - 1;

            let expThByIter = initParams.expectedThroughput / (gameResult.rows.length - 1);

            gameResult.rows.forEach((value, index) => {
                const iter = gameResult.rows.length - index - 1;
                serFlowData.push([iter, value[finish].count]);
                serFlowMeanData.push([iter, expThByIter * iter]);
                serFlowMeanDeltaData.push([iter, value[finish].count - expThByIter * iter]);
            });
        } else {
            let expThByIter = 2.5;
            for (let i = 0; i < 21; i++) {
                serFlowData.push([i, i * 2]);
                serFlowMeanData.push([i, expThByIter * i]);
                serFlowMeanDeltaData.push([i, i * 2 - expThByIter * i]);
            }
        }

        let serFlow: LineSeriesOption = {
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: "Поток",
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            itemStyle: {
                opacity: 0,
                color: "rgba(255,64,64,1)",
            },
            lineStyle: {
                color: "rgba(255,64,64,1)",
            },
            areaStyle: {
                color: "rgba(255,64,64,0.75)",
                origin: 'auto',
            },
            data: serFlowData,
        };
        let serFlowMean: LineSeriesOption = {
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: "Ожидание",
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            itemStyle: {
                color: "rgb(166,204,147)",
                opacity: 0,
            },
            lineStyle: {
                color: "rgb(166,204,147)",
            },
            areaStyle: {
                opacity: 0,
            },
            data: serFlowMeanData,
        };
        let serFlowMeanDelta: LineSeriesOption = {
            xAxisIndex: 0,
            yAxisIndex: 0,
            name: "Разница между потоком и ожиданием",
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            itemStyle: {
                color: "rgb(255,219,140)",
                opacity: 0,
            },
            lineStyle: {
                color: "rgb(255,219,140)",
            },
            areaStyle: {
                color: "rgba(255,219,140,0.75)",
                origin: 'auto',
            },
            data: serFlowMeanDeltaData,
        };
        return {serFlow, serFlowMean, serFlowMeanDelta};
    }

    function makeBufferSeries() {

        let buffers: number[] = [];
        let buffersData: number[][][] = [];
        if (gameResult.rows.length > 0) {

            buffers = gameResult.rows[0]
                .map((value, index) => value.isBuffer ? index : -1)
                .filter(value => value > 0).slice(0, -1);

            buffersData = new Array(buffers.length);

            for (let i = 0; i < buffers.length; i++) {
                buffersData[i] = [];
                for (let index = gameResult.rows.length - 1; index >= 0; index--) {
                    const value = gameResult.rows[index];
                    const iter = gameResult.rows.length - index - 1;
                    buffersData[i].push([iter, value[i].count]);
                }
            }
        } else {
            buffers = [2, 4, 6];

            buffersData = new Array(buffers.length);

            for (let i = 0; i < buffers.length; i++) {
                buffersData[i] = [];
                for (let j = 0; j < 21; j++) {
                    buffersData[i].push([j, (j * 3) % ((i + 5) * 3)]);
                }
            }
        }

        let serBuffer: LineSeriesOption[] = [];

        for (let i = 0; i < buffers.length; i++) {
            serBuffer.push({
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: "Буффер " + (buffers[i]),
                    type: 'line',
                    stack: "buffers",
                    itemStyle: {
                        opacity: 0,
                    },
                    areaStyle: {
                        origin: 'auto',
                    },
                    data: buffersData[i],
                }
            );
        }
        return serBuffer;
    }

    function makeControlSeries(): SeriesOption[] {

        let control: number[] = [];
        let sum = gameResult.times.length;
        if (sum > 0) {
            gameResult.times.forEach(value => {

                while (control.length < value + 1) {
                    control.push(0);
                }
                control[value]++;
            });
        } else {
            control = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

            control.forEach(value => sum += value);
        }

        let serControlData: number[][] = [];
        let serControlPercData: string[][] = [];
        let count = 0;
        control.forEach((value, index) => {
            if (value > 0) {
                serControlData.push([index, value]);
            }
            if (sum > 0) {
                count += value;
                serControlPercData.push([String(index), (100 * count / sum).toFixed(1)]);
            }
        });

        return [
            {
                xAxisIndex: 2,
                yAxisIndex: 2,
                name: "Время производства",
                type: 'bar',
                itemStyle: {
                    borderColor: "rgb(102,140,255)",
                    color: "rgba(102,140,255,0.75)",
                },
                data: serControlData,
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 3,
                name: "Процентиль времени производства",
                type: 'line',
                itemStyle: {
                    borderColor: "rgba(191,128,255)",
                    color: "rgba(191,128,255)",
                    opacity: 0
                },
                lineStyle: {
                    color: "rgb(191,128,255)",
                },
                areaStyle: {
                    origin: 'auto',
                    opacity: 0
                },
                data: serControlPercData,
            }
        ];
    }

    let {serFlow, serFlowMean, serFlowMeanDelta} = makeFlowSeries();

    let serBuffer: SeriesOption[] = makeBufferSeries();

    let serControl: SeriesOption[] = makeControlSeries();

    const options: EChartsOption = {

        animation: true,
        title: {
            text: (gameResult.rows.length > 0) ? "Статистика последнего запуска" : "Пример статистики последнего запуска",
            left: 'center'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                }
            }
        },
        tooltip: {
            axisPointer: {
                show: true,
            },
        },
        legend: {
            show: true,
            top: 'bottom',
        },
        grid: [
            {
                left: "3%",
                width: "28%",
            },
            {
                left: "36%",
                width: "28%",
            },
            {
                left: "69%",
                width: "28%",
            },
        ],
        xAxis: [
            {
                gridIndex: 0,
                name: "Проход на итерацию",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'value',
                axisLabel: {
                    hideOverlap: true,
                },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                gridIndex: 1,
                name: "Незавершенка на итерацию",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'category',
                axisLabel: {
                    hideOverlap: true,
                },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                gridIndex: 2,
                name: "Распределение времени производства",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'value',
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0,
            },
        ],
        yAxis: [
            {
                gridIndex: 0,
                minInterval: 1,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                },
            },
            {
                gridIndex: 1,
                minInterval: 1,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0
            },
            {
                gridIndex: 2,
                minInterval: 1,
                alignTicks: true,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0
            },
            {
                gridIndex: 2,
                minInterval: 1,
                alignTicks: true,
                position: 'right',
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                    formatter: function (value: number) {
                        return value ? value.toFixed(0) : "";
                    },
                },
                min: 0,
                max: 100
            },
        ],
        series: [serFlow, serFlowMean, serFlowMeanDelta, ...serBuffer, ...serControl],
    };

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={options}
        />
    );
}