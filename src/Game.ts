import {BufferParam, ForkliftParam, InitParams, ProcessorParam} from "./GameContext";
import {GameResult, RowData, SetGameResult} from "./GameResultContext";

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
    // Тип шага
    type: string;
    // Для буфера - число элементов, для этапа - число реально перемещённых элементов на этом этапе
    count: number = 0;
    // Для процессора число элементов, которые он может перенести на этом шаге
    mayCount: number = 0;
    // Для процессора число элементов, которые он может перенести на этом шаге, после действий на других этапах
    mayCountAlowed: number = 0;
    // Для буфера - лимит буфера. Если равно 0, то лимита нет
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

    setMayCountAlowed(val: number) {
        this.mayCountAlowed = val;
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
            .setMayCountAlowed(this.mayCountAlowed);
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

        let rows: RowData[][] = [];
        this.rowArr.forEach(value => {
            rows.push(value.map(statData => new RowData(statData.isStorage(), statData.count, statData.mayCount)));
        });
        gameResult.setRows(rows);

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
                res.push(value.clone().setMayCountAlowed(mc).setMayCount(mc));
            }
        });

        row.forEach((value, index) => {
            if (value.isProcessor()) {
                const processorParam = this.initParams.placeParams[index - 1] as ProcessorParam;
                const secondaryFromIndex = processorParam.secondaryFrom;
                if ((secondaryFromIndex > 0) && !processorParam.union) {
                    const mc = Math.min(value.mayCount, res[secondaryFromIndex].mayCount);
                    value.setMayCountAlowed(mc).setMayCount(mc);
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

                        value.setCount(cnt).setMayCount(power).setMayCountAlowed(0);
                        this.moveTasks(index, cnt, newRow, board, iteration);
                    } else {
                        value.setCount(0).setMayCount(0).setMayCountAlowed(0);
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

                    value.setCount(cnt).setMayCount(power).setMayCountAlowed(0);
                    this.moveTasks(index, cnt, newRow, board, iteration);
                }
            }
        });
    }

    private moveTasks(index: number, cnt: number, newRow: StatData[], board: Board, iteration: number) {
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
                const task = board.columnTasks[index - 1].shift();
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
                    const power = newRow[processorParam.secondaryFrom].mayCountAlowed;
                    const cnt = Math.min(leftCnt, rightCnt, power);

                    value.setCount(cnt).setMayCountAlowed(value.mayCountAlowed - cnt).setMayCount(power);
                    newRow[processorParam.secondaryFrom].setMayCountAlowed(power - cnt);
                    this.moveTasks(index, cnt, newRow, board, iteration);
                } else {
                    const leftCnt = newRow[index - 1].isWarehouse() ? Number.MAX_SAFE_INTEGER : newRow[index - 1].count;
                    const rightCnt = (newRow[index + 1].limit === 0) ? Number.MAX_SAFE_INTEGER : (newRow[index + 1].limit - newRow[index + 1].count);
                    const power = value.mayCountAlowed;
                    const cnt = Math.min(leftCnt, rightCnt, power);

                    value.setCount(cnt).setMayCountAlowed(value.mayCountAlowed - cnt).setMayCount(power);
                    this.moveTasks(index, cnt, newRow, board, iteration);
                }
            }
        }
    }
}