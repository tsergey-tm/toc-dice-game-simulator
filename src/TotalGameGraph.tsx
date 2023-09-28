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
import {
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent
} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {CanvasRenderer,} from 'echarts/renderers';
import {EChartsOption, SeriesOption} from "echarts";

// Register the required components
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, LineChart, LegendComponent,
        ToolboxComponent, MarkLineComponent]
);


export const TotalGameGraph: FC = () => {

    const {initParams} = useGameContext();
    const {gameResult} = useGameResultContext();


    function makeFlowSeries(): SeriesOption[] {

        let control: number[] = [];
        if (gameResult.throughputs.length > 0) {
            control = gameResult.throughputs;
        } else {
            control = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }
        let sum = 0;
        control.forEach(value => sum += value);

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
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: "Распределение протока",
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgba(255,64,64,1)",
                    color: "rgba(255,64,64,0.75)",
                },
                markLine: {
                    symbol: ["none", "none"],
                    silent: true,
                    lineStyle: {
                        type: "dashed",
                        color: "rgb(128,255,64)",
                        width: 1,
                    },
                    data: [
                        {
                            xAxis: initParams.expectedThroughput,
                        },
                    ],
                },
                data: serControlData,
            },
            {
                xAxisIndex: 0,
                yAxisIndex: 1,
                name: "Процентиль протока",
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

    function makeBufferSeries(): SeriesOption[] {


        let control: number[] = [];
        if (gameResult.wips.length > 0) {
            control = gameResult.wips;
        } else {
            control = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }

        let sum = 0;
        control.forEach(value => sum += value);

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
                xAxisIndex: 1,
                yAxisIndex: 2,
                name: "Распределение незавершенки",
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(127,255,64)",
                    color: "rgba(127,255,64,0.75)",
                },
                data: serControlData,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 3,
                name: "Процентиль незавершенки",
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

    function makeControlSeries(): SeriesOption[] {

        let control: number[] = [];
        if (gameResult.controls.length > 0) {
            control = gameResult.controls;
        } else {
            control = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }
        let sum = 0;
        control.forEach(value => sum += value);

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
                yAxisIndex: 4,
                name: "Время производства",
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(102,140,255)",
                    color: "rgba(102,140,255,0.75)",
                },
                data: serControlData,
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 5,
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

    let serFlow: SeriesOption[] = makeFlowSeries();

    let serBuffer: SeriesOption[] = makeBufferSeries();

    let serControl: SeriesOption[] = makeControlSeries();

    const options: EChartsOption = {

        animation: true,
        title: {
            text: (gameResult.throughputs.length > 0) ? "Статистика запусков" : "Пример статистики запусков",
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
                name: "Распределение прохода",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'value',
                boundaryGap: ["1%", "10%"],
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0,
            },
            {
                gridIndex: 1,
                name: "Распределение незавершенки",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'value',
                boundaryGap: ["1%", "10%"],
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0,
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
                boundaryGap: ["1%", "10%"],
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
                alignTicks: true,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                boundaryGap: ["1%", "10%"],
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0
            },
            {
                gridIndex: 0,
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
            {
                gridIndex: 1,
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
                gridIndex: 1,
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
        series: [...serFlow, ...serBuffer, ...serControl],
    };

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={options}
        />
    );
}