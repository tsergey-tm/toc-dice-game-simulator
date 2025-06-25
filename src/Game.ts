import {BufferParam, ForkliftParam, InitParams, ProcessorParam} from "./GameContext";
import {AggrData, GameResult, RowData, SetGameResult} from "./GameResultContext";

class Task {
    firstTime: number;
    lastTime: number;

    constructor(firstTime: number, lastTime: number) {
        this.firstTime = firstTime;
        this.lastTime = lastTime;
    }

    setLastTime(lastTime: number) {
        this.lastTime = lastTime;
        return this;
    }
}

class Board {
    columnTasks: Task[][] = [];
}

class StatData {
    static readonly TYPE_WAREHOUSE = 'W';
    static readonly TYPE_BUFFER = 'B';
    static readonly TYPE_FORKLIFT = 'F';
    static readonly TYPE_PROCESSOR = 'P';
    static readonly TYPE_STORE = 'S';
    // Stage type
    type: string;
    // For a buffer - the number of elements, for a stage - the number of actually moved elements at this stage
    count: number = 0;
    // For a processor, the number of elements it can transfer in this step
    mayCount: number = 0;
    // For a processor, the number of elements it can transfer in this step after actions in other steps
    mayCountAllowed: number = 0;
    // For a buffer - buffer limit. If equal to 0, then there is no limit
    limit: number = 0;

    constructor(type: string) {
        this.type = type;
    }

    setCount(val: number) {
        this.count = val;
        return this;
    }

    setMayCount(val: number) {
        this.mayCount = val;
        return this;
    }

    setMayCountAllowed(val: number) {
        this.mayCountAllowed = val;
        return this;
    }

    setLimit(val: number) {
        this.limit = val;
        return this;
    }

    isStorage() {
        return this.isBuffer() || this.isWarehouse() || this.isStore();
    }

    isMover() {
        return this.isForklift() || this.isProcessor();
    }

    isBuffer() {
        return this.type === StatData.TYPE_BUFFER;
    }

    isWarehouse() {
        return this.type === StatData.TYPE_WAREHOUSE;
    }

    isStore() {
        return this.type === StatData.TYPE_STORE;
    }

    isForklift() {
        return this.type === StatData.TYPE_FORKLIFT;
    }

    isProcessor() {
        return this.type === StatData.TYPE_PROCESSOR;
    }

    clone() {
        return new StatData(this.type)
            .setLimit(this.limit)
            .setCount(this.count)
            .setMayCount(this.mayCount)
            .setMayCountAllowed(this.mayCountAllowed);
    }
}

export class GameRunner {

    initParams: InitParams;
    gameResult: GameResult;
    setGameResult: SetGameResult;
    rowArr: StatData[][] = [];

    constructor(initParams: InitParams, gameResult: GameResult, setGameResult: SetGameResult) {
        this.initParams = initParams;
        this.gameResult = gameResult;
        this.setGameResult = setGameResult;
    }

    run(): void {

        const board: Board = new Board();
        board.columnTasks.push([]);
        this.initParams.placeParams.forEach(value => {
            if (value.type === BufferParam.LETTER) {
                let tasks: Task[] = [];
                for (let i = (value as BufferParam).start; i > 0; i--) {
                    tasks.push(new Task(-1, -1));
                }
                board.columnTasks.push(tasks);
            } else {
                board.columnTasks.push([]);
            }
        });
        board.columnTasks.push([]);

        let row: StatData[] = [];

        row.push(new StatData(StatData.TYPE_WAREHOUSE));
        this.initParams.placeParams.forEach(value => {
            switch (value.type) {
                case BufferParam.LETTER:
                    const b = (value as BufferParam);
                    row.push(new StatData(value.type).setCount(b.start).setLimit(b.limit));
                    break;
                case ForkliftParam.LETTER:
                case ProcessorParam.LETTER:
                    row.push(new StatData(value.type));
                    break;
            }
        });
        row.push(new StatData(StatData.TYPE_STORE));
        this.rowArr = [row];
        for (let iteration = 0; iteration < this.initParams.iterations; iteration++) {
            let newRow: StatData[] = this.throwDices(row);

            this.movePrimaryForklifts(newRow, iteration, board);
            this.moveProcessors(newRow, iteration, board);
            this.moveSecondaryForklifts(newRow, iteration, board);

            this.rowArr.unshift(newRow);
            row = newRow;
        }

        const gameResult = this.gameResult.clone();

        const aggrData: AggrData[] = [];
        row.forEach((d, index) => {

            let unionTo = 0;
            if (index > 0 && index <= this.initParams.placeParams.length &&
                this.initParams.placeParams[index - 1].type === ProcessorParam.LETTER &&
                (this.initParams.placeParams[index - 1] as ProcessorParam).union
            ) {
                unionTo = (this.initParams.placeParams[index - 1] as ProcessorParam).secondaryFrom + 1;
            }

            const aggrDataItem = new AggrData(d.isStorage(), unionTo);
            if (aggrDataItem.isBuffer) {
                aggrDataItem.setCount(d.count);
            }
            aggrData.push(aggrDataItem);
        });

        const rows: RowData[][] = [];
        this.rowArr.forEach(value => {
            const rowData = [];
            for (let i = 0; i < value.length; i++) {
                const statData = value[i];
                rowData.push(new RowData(statData.isStorage(), statData.count, statData.mayCount));

                if (!statData.isStorage()) {
                    const index = (aggrData[i].unionTo > 0) ? aggrData[i].unionTo : i;
                    aggrData[index].addMay(statData.mayCount);
                    aggrData[index].addCount(statData.count);
                }
            }
            rows.push(rowData);
        });
        gameResult.setRows(rows);
        gameResult.setAggr(aggrData);

        gameResult.setTimes(board
            .columnTasks[board.columnTasks.length - 1]
            .filter(value => value.firstTime >= 0 && value.lastTime >= 0)
            .map(value => value.lastTime - value.firstTime));

        this.setGameResult(gameResult);
    }

    private throwDices(row: StatData[]): StatData[] {

        let res: StatData[] = [];

        row.forEach((value, index) => {
            if (value.isStorage() || value.isForklift()) {
                res.push(value.clone());
            } else {
                const processor = (this.initParams.placeParams[index - 1] as ProcessorParam);
                let mc = Math.floor(Math.random() * (processor.max - processor.min + 1)) + processor.min;
                res.push(value.clone().setMayCountAllowed(mc).setMayCount(mc));
            }
        });

        row.forEach((value, index) => {
            if (value.isProcessor()) {
                const processorParam = this.initParams.placeParams[index - 1] as ProcessorParam;
                const secondaryFromIndex = processorParam.secondaryFrom;
                if ((secondaryFromIndex > 0) && !processorParam.union) {
                    const mc = Math.min(value.mayCount, res[secondaryFromIndex].mayCount);
                    value.setMayCountAllowed(mc).setMayCount(mc);
                }
            }
        });

        return res;
    }

    private movePrimaryForklifts(newRow: StatData[], iteration: number, board: Board) {

        newRow.forEach((value, index) => {
            if (value.isForklift()) {
                const fl = this.initParams.placeParams[index - 1] as ForkliftParam;
                if (fl.secondaryFrom === 0) {
                    if (iteration % fl.stepDiv === (fl.stepMod - 1)) {
                        const leftCnt = newRow[index - 1].isWarehouse() ? Number.MAX_SAFE_INTEGER : newRow[index - 1].count;
                        const rightCnt = (newRow[index + 1].limit === 0) ? Number.MAX_SAFE_INTEGER : (newRow[index + 1].limit - newRow[index + 1].count);
                        const power = fl.volume;
                        const cnt = Math.min(leftCnt, rightCnt, power);

                        value.setCount(cnt).setMayCount(power).setMayCountAllowed(0);
                        this.moveTasks(index, cnt, newRow, board, iteration, fl.random);
                    } else {
                        value.setCount(0).setMayCount(0).setMayCountAllowed(0);
                    }
                }
            }
        });
    }

    private moveSecondaryForklifts(newRow: StatData[], iteration: number, board: Board) {

        newRow.forEach((value, index) => {
            if (value.isForklift()) {
                const fl = this.initParams.placeParams[index - 1] as ForkliftParam;
                if (fl.secondaryFrom > 0) {
                    const leftCnt = newRow[index - 1].isWarehouse() ? Number.MAX_SAFE_INTEGER : newRow[index - 1].count;
                    const rightCnt = (newRow[index + 1].limit === 0) ? Number.MAX_SAFE_INTEGER : (newRow[index + 1].limit - newRow[index + 1].count);
                    const power = newRow[fl.secondaryFrom].count;
                    const cnt = Math.min(leftCnt, rightCnt, power);

                    value.setCount(cnt).setMayCount(power).setMayCountAllowed(0);
                    this.moveTasks(index, cnt, newRow, board, iteration, fl.random);
                }
            }
        });
    }

    private moveTasks(index: number, cnt: number, newRow: StatData[], board: Board, iteration: number, random: boolean) {
        if (cnt < 1) {
            return;
        }

        newRow[index - 1].count -= cnt;
        newRow[index + 1].count += cnt;
        if (index === 1) {
            for (let i = 0; i < cnt; i++) {
                board.columnTasks[index + 1].push(new Task(iteration, iteration));
            }
        } else {
            for (let i = 0; i < cnt; i++) {
                let task: Task | undefined;

                if (random) {
                    const size = board.columnTasks[index - 1].length;
                    const pos = Math.floor(Math.random() * size);
                    task = board.columnTasks[index - 1].splice(pos, 1)[0];
                } else {
                    task = board.columnTasks[index - 1].shift();
                }

                if (task !== undefined) {
                    board.columnTasks[index + 1].push(task.setLastTime(iteration));
                }
            }
        }
    }

    private moveProcessors(newRow: StatData[], iteration: number, board: Board) {
        for (let index = newRow.length - 1; index > 0; index--) {
            const value = newRow[index];
            if (value.isProcessor()) {
                const processorParam = this.initParams.placeParams[index - 1] as ProcessorParam;
                if ((processorParam.secondaryFrom > 0) && processorParam.union) {
                    const leftCnt = newRow[index - 1].isWarehouse() ? Number.MAX_SAFE_INTEGER : newRow[index - 1].count;
                    const rightCnt = (newRow[index + 1].limit === 0) ? Number.MAX_SAFE_INTEGER : (newRow[index + 1].limit - newRow[index + 1].count);
                    const power = newRow[processorParam.secondaryFrom].mayCountAllowed;
                    const cnt = Math.min(leftCnt, rightCnt, power);

                    value.setCount(cnt).setMayCountAllowed(value.mayCountAllowed - cnt).setMayCount(power);
                    newRow[processorParam.secondaryFrom].setMayCountAllowed(power - cnt);
                    this.moveTasks(index, cnt, newRow, board, iteration, processorParam.random);
                } else {
                    const leftCnt = newRow[index - 1].isWarehouse() ? Number.MAX_SAFE_INTEGER : newRow[index - 1].count;
                    const rightCnt = (newRow[index + 1].limit === 0) ? Number.MAX_SAFE_INTEGER : (newRow[index + 1].limit - newRow[index + 1].count);
                    const power = value.mayCountAllowed;
                    const cnt = Math.min(leftCnt, rightCnt, power);

                    value.setCount(cnt).setMayCountAllowed(value.mayCountAllowed - cnt).setMayCount(power);
                    this.moveTasks(index, cnt, newRow, board, iteration, processorParam.random);
                }
            }
        }
    }
}
