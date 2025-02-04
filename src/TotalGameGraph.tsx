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
import {useTranslation} from "react-i18next";
import {useHistoryResultContext} from "./GameHistoryContext";

// Register the required components
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, LineChart, LegendComponent,
        ToolboxComponent, MarkLineComponent]
);


export const TotalGameGraph: FC = () => {

    const {initParams} = useGameContext();
    const {gameResult} = useGameResultContext();
    const {historyResult} = useHistoryResultContext();
    const {t} = useTranslation();

    function makeFlowSeries(): SeriesOption[] {

        let data: number[];
        if (gameResult.throughputs.length > 0) {
            data = gameResult.throughputs;
        } else {
            data = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }
        let sum = 0;
        data.forEach(value => sum += value);

        let serData: number[][] = [];
        let serPercData: string[][] = [];
        let count = 0;
        data.forEach((value, index) => {
            if (value > 0) {
                serData.push([index, value]);
            }
            if (sum > 0) {
                count += value;
                serPercData.push([String(index), (100 * count / sum).toFixed(1)]);
            }
        });

        let serHistoryData: number[][] = [];
        let serHistoryPercData: string[][] = [];
        if (historyResult.isShowed && gameResult.throughputs.length > 0) {
            let sum = 0;
            historyResult.throughputs.forEach(value => sum += value);

            let count = 0;
            historyResult.throughputs.forEach((value, index) => {
                if (value > 0) {
                    serHistoryData.push([index, value]);
                }
                if (sum > 0) {
                    count += value;
                    serHistoryPercData.push([String(index), (100 * count / sum).toFixed(1)]);
                }
            });

        }


        return [
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: t('TotalGameGraph.throughput_distribution_hist'),
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                },
                tooltip: {
                    show: true
                },
                z: 0,
                data: serHistoryData,
            },
            {
                xAxisIndex: 0,
                yAxisIndex: 1,
                name: t('TotalGameGraph.throughput_perc_hist'),
                type: 'line',
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                    opacity: 0
                },
                lineStyle: {
                    color: "rgba(128,128,128)",
                },
                areaStyle: {
                    origin: 'auto',
                    opacity: 0
                },
                tooltip: {
                    show: true
                },
                z: 1,
                data: serHistoryPercData,
            },
            {
                xAxisIndex: 0,
                yAxisIndex: 0,
                name: t('TotalGameGraph.throughput_distribution'),
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
                z: 2,
                data: serData,
            },
            {
                xAxisIndex: 0,
                yAxisIndex: 1,
                name: t('TotalGameGraph.throughput_perc'),
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
                z: 3,
                data: serPercData,
            }
        ];
    }

    function makeBufferSeries(): SeriesOption[] {


        let data: number[];
        if (gameResult.wips.length > 0) {
            data = gameResult.wips;
        } else {
            data = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }

        let sum = 0;
        data.forEach(value => sum += value);

        let serData: number[][] = [];
        let serPercData: string[][] = [];
        let count = 0;
        data.forEach((value, index) => {
            if (value > 0) {
                serData.push([index, value]);
            }
            if (sum > 0) {
                count += value;
                serPercData.push([String(index), (100 * count / sum).toFixed(1)]);
            }
        });

        let serHistoryData: number[][] = [];
        let serHistoryPercData: string[][] = [];
        if (historyResult.isShowed && gameResult.wips.length > 0) {
            let sum = 0;
            historyResult.wips.forEach(value => sum += value);

            let count = 0;
            historyResult.wips.forEach((value, index) => {
                if (value > 0) {
                    serHistoryData.push([index, value]);
                }
                if (sum > 0) {
                    count += value;
                    serHistoryPercData.push([String(index), (100 * count / sum).toFixed(1)]);
                }
            });

        }


        return [
            {
                xAxisIndex: 1,
                yAxisIndex: 2,
                name: t('TotalGameGraph.wip_distribution_hist'),
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                },
                tooltip: {
                    show: true,
                },
                z: 0,
                data: serHistoryData,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 3,
                name: t('TotalGameGraph.wip_perc_hist'),
                type: 'line',
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                    opacity: 0
                },
                lineStyle: {
                    color: "rgba(128,128,128)",
                },
                areaStyle: {
                    origin: 'auto',
                    opacity: 0
                },
                tooltip: {
                    show: true
                },
                z: 1,
                data: serHistoryPercData,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 2,
                name: t('TotalGameGraph.wip_distribution'),
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(127,255,64)",
                    color: "rgba(127,255,64,0.75)",
                },
                z: 2,
                data: serData,
            },
            {
                xAxisIndex: 1,
                yAxisIndex: 3,
                name: t('TotalGameGraph.wip_perc'),
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
                z: 3,
                data: serPercData,
            }
        ];
    }

    function makeControlSeries(): SeriesOption[] {

        let data: number[];
        if (gameResult.controls.length > 0) {
            data = gameResult.controls;
        } else {
            data = [0, 0, 0, 0, 1, 2, 5, 10, 9, 3, 1, 1, 0, 0, 1, 8, 6, 5, 3, 1, 0, 1, 0, 1, 0, 5, 0, 0, 0, 1];

        }
        let sum = 0;
        data.forEach(value => sum += value);

        let serData: number[][] = [];
        let serPercData: string[][] = [];
        let count = 0;
        data.forEach((value, index) => {
            if (value > 0) {
                serData.push([index, value]);
            }
            if (sum > 0) {
                count += value;
                serPercData.push([String(index), (100 * count / sum).toFixed(1)]);
            }
        });

        let serHistoryData: number[][] = [];
        let serHistoryPercData: string[][] = [];
        if (historyResult.isShowed && gameResult.controls.length > 0) {
            let sum = 0;
            historyResult.controls.forEach(value => sum += value);

            let count = 0;
            historyResult.controls.forEach((value, index) => {
                if (value > 0) {
                    serHistoryData.push([index, value]);
                }
                if (sum > 0) {
                    count += value;
                    serHistoryPercData.push([String(index), (100 * count / sum).toFixed(1)]);
                }
            });

        }

        return [
            {
                xAxisIndex: 2,
                yAxisIndex: 4,
                name: t('TotalGameGraph.lead_time_distribution_hist'),
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                },
                tooltip: {
                    show: true
                },
                z: 0,
                data: serHistoryData,
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 5,
                name: t('TotalGameGraph.lead_time_perc_hist'),
                type: 'line',
                itemStyle: {
                    borderColor: "rgb(128,128,128)",
                    color: "rgba(128,128,128)",
                    opacity: 0
                },
                lineStyle: {
                    color: "rgba(128,128,128)",
                },
                areaStyle: {
                    origin: 'auto',
                    opacity: 0
                },
                tooltip: {
                    show: true
                },
                z: 1,
                data: serHistoryPercData,
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 4,
                name: t('TotalGameGraph.lead_time_distribution'),
                type: 'bar',
                barMaxWidth: 40,
                itemStyle: {
                    borderColor: "rgb(102,140,255)",
                    color: "rgba(102,140,255,0.75)",
                },
                z: 2,
                data: serData,
            },
            {
                xAxisIndex: 2,
                yAxisIndex: 5,
                name: t('TotalGameGraph.lead_time_perc'),
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
                z: 3,
                data: serPercData,
            }
        ];
    }

    let serFlow: SeriesOption[] = makeFlowSeries();

    let serBuffer: SeriesOption[] = makeBufferSeries();

    let serControl: SeriesOption[] = makeControlSeries();

    const legendData = [
        t('TotalGameGraph.throughput_distribution'),
        t('TotalGameGraph.throughput_perc'),
        t('TotalGameGraph.wip_distribution'),
        t('TotalGameGraph.wip_perc'),
        t('TotalGameGraph.lead_time_distribution'),
        t('TotalGameGraph.lead_time_perc')
    ];

    const options: EChartsOption = {

        animation: true,
        title: {
            text: (gameResult.throughputs.length > 0) ? t('TotalGameGraph.run_stat') : t('TotalGameGraph.run_stat_example'),
            left: 'center'
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                },
                dataZoom: {
                    show: true
                },
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
            data: legendData
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
                name: t('TotalGameGraph.throughput_distribution'),
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
                name: t('TotalGameGraph.wip_distribution'),
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
                name: t('TotalGameGraph.lead_time_distribution'),
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