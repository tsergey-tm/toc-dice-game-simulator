import {expect} from 'chai';
import {suite, test} from '@testdeck/mocha';
import {GameRunner} from "../src/Game";
import {BufferParam, ForkliftParam, InitParams, ProcessorParam} from "../src/GameContext";
import {GameResult} from "../src/GameResultContext";

@suite
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GameModuleTest {
    @test 'Forklift primary'() {

        const initParams = new InitParams().setInitStr("20;F0,10,5,10");

        expect(initParams.iterations).equal(20);
        expect(initParams.placeParams).length(1);
        expect(initParams.placeParams[0].type).equal(ForkliftParam.LETTER);
        const flParam = initParams.placeParams[0] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(10);
        expect(flParam.stepMod).equal(5);
        expect(flParam.stepDiv).equal(10);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(21);
        expect(gameResultValue.rows).length(21);

        expect(game.rowArr[0][1].count).equal(0);
        expect(game.rowArr[0][1].mayCount).equal(0);
        expect(game.rowArr[0][2].count).equal(20);
        expect(game.rowArr[4][1].count).equal(0);
        expect(game.rowArr[4][1].mayCount).equal(0);
        expect(game.rowArr[4][2].count).equal(20);
        expect(game.rowArr[5][1].count).equal(10);
        expect(game.rowArr[5][1].mayCount).equal(10);
        expect(game.rowArr[5][2].count).equal(20);
        expect(game.rowArr[6][1].count).equal(0);
        expect(game.rowArr[6][1].mayCount).equal(0);
        expect(game.rowArr[6][2].count).equal(10);
        expect(game.rowArr[9][1].count).equal(0);
        expect(game.rowArr[9][1].mayCount).equal(0);
        expect(game.rowArr[9][2].count).equal(10);
        expect(game.rowArr[10][1].count).equal(0);
        expect(game.rowArr[10][1].mayCount).equal(0);
        expect(game.rowArr[10][2].count).equal(10);
        expect(game.rowArr[11][1].count).equal(0);
        expect(game.rowArr[11][1].mayCount).equal(0);
        expect(game.rowArr[11][2].count).equal(10);
        expect(game.rowArr[14][1].count).equal(0);
        expect(game.rowArr[14][1].mayCount).equal(0);
        expect(game.rowArr[14][2].count).equal(10);
        expect(game.rowArr[15][1].count).equal(10);
        expect(game.rowArr[15][1].mayCount).equal(10);
        expect(game.rowArr[15][2].count).equal(10);
        expect(game.rowArr[16][1].count).equal(0);
        expect(game.rowArr[16][1].mayCount).equal(0);
        expect(game.rowArr[16][2].count).equal(0);
        expect(game.rowArr[19][1].count).equal(0);
        expect(game.rowArr[19][1].mayCount).equal(0);
        expect(game.rowArr[19][2].count).equal(0);
        expect(game.rowArr[20][1].count).equal(0);
        expect(game.rowArr[20][1].mayCount).equal(0);
        expect(game.rowArr[20][2].count).equal(0);

    }

    @test 'Processor primary'() {

        const initParams = new InitParams().setInitStr("2;P0,1,6,0");

        expect(initParams.iterations).equal(2);
        expect(initParams.placeParams).length(1);
        expect(initParams.placeParams[0].type).equal(ProcessorParam.LETTER);
        const prParam = initParams.placeParams[0] as ProcessorParam;
        expect(prParam.secondaryFrom).equal(0);
        expect(prParam.min).equal(1);
        expect(prParam.max).equal(6);
        expect(prParam.union).equal(false);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(3);
        expect(gameResultValue.rows).length(3);

        expect(game.rowArr[2][1].count).equal(0);
        expect(game.rowArr[2][1].mayCount).equal(0);
        expect(game.rowArr[2][2].count).equal(0);
        expect(game.rowArr[1][1].count).within(1, 6);
        expect(game.rowArr[1][1].mayCount).within(1, 6);
        expect(game.rowArr[1][2].count).within(1, 6);
        expect(game.rowArr[0][1].count).within(1, 6);
        expect(game.rowArr[0][1].mayCount).within(1, 6);
        expect(game.rowArr[0][2].count).within(2, 12);

    }


    @test 'Forklift left limeted'() {

        const initParams = new InitParams().setInitStr("2;F0,10,5,10;B5,0;F0,10,1,1");

        expect(initParams.iterations).equal(2);
        expect(initParams.placeParams).length(3);
        expect(initParams.placeParams[0].type).equal(ForkliftParam.LETTER);
        let flParam = initParams.placeParams[0] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(10);
        expect(flParam.stepMod).equal(5);
        expect(flParam.stepDiv).equal(10);

        expect(initParams.placeParams[1].type).equal(BufferParam.LETTER);
        let buParam = initParams.placeParams[1] as BufferParam;
        expect(buParam.start).equal(5);
        expect(buParam.limit).equal(0);

        expect(initParams.placeParams[2].type).equal(ForkliftParam.LETTER);
        flParam = initParams.placeParams[2] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(10);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(1);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(3);
        expect(gameResultValue.rows).length(3);

        expect(game.rowArr[2][1].count).equal(0);
        expect(game.rowArr[2][1].mayCount).equal(0);
        expect(game.rowArr[2][2].count).equal(5);
        expect(game.rowArr[2][3].count).equal(0);
        expect(game.rowArr[2][3].mayCount).equal(0);
        expect(game.rowArr[2][4].count).equal(0);

        expect(game.rowArr[1][1].count).equal(0);
        expect(game.rowArr[1][1].mayCount).equal(0);
        expect(game.rowArr[1][2].count).equal(0);
        expect(game.rowArr[1][3].count).equal(5);
        expect(game.rowArr[1][3].mayCount).equal(10);
        expect(game.rowArr[1][4].count).equal(5);

        expect(game.rowArr[0][1].count).equal(0);
        expect(game.rowArr[0][1].mayCount).equal(0);
        expect(game.rowArr[0][2].count).equal(0);
        expect(game.rowArr[0][3].count).equal(0);
        expect(game.rowArr[0][3].mayCount).equal(10);
        expect(game.rowArr[0][4].count).equal(5);
    }

    @test 'Forklift right limeted'() {

        const initParams = new InitParams().setInitStr("2;F0,10,1,1;B5,15;F0,1,1,1");

        expect(initParams.iterations).equal(2);
        expect(initParams.placeParams).length(3);
        expect(initParams.placeParams[0].type).equal(ForkliftParam.LETTER);
        let flParam = initParams.placeParams[0] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(10);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(1);

        expect(initParams.placeParams[1].type).equal(BufferParam.LETTER);
        let buParam = initParams.placeParams[1] as BufferParam;
        expect(buParam.start).equal(5);
        expect(buParam.limit).equal(15);

        expect(initParams.placeParams[2].type).equal(ForkliftParam.LETTER);
        flParam = initParams.placeParams[2] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(1);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(1);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(3);
        expect(gameResultValue.rows).length(3);

        expect(game.rowArr[2][1].count).equal(0);
        expect(game.rowArr[2][1].mayCount).equal(0);
        expect(game.rowArr[2][2].count).equal(5);
        expect(game.rowArr[2][3].count).equal(0);
        expect(game.rowArr[2][3].mayCount).equal(0);
        expect(game.rowArr[2][4].count).equal(0);

        expect(game.rowArr[1][1].count).equal(10);
        expect(game.rowArr[1][1].mayCount).equal(10);
        expect(game.rowArr[1][2].count).equal(14);
        expect(game.rowArr[1][3].count).equal(1);
        expect(game.rowArr[1][3].mayCount).equal(1);
        expect(game.rowArr[1][4].count).equal(1);

        expect(game.rowArr[0][1].count).equal(1);
        expect(game.rowArr[0][1].mayCount).equal(10);
        expect(game.rowArr[0][2].count).equal(14);
        expect(game.rowArr[0][3].count).equal(1);
        expect(game.rowArr[0][3].mayCount).equal(1);
        expect(game.rowArr[0][4].count).equal(2);
    }

    @test 'Processor left limeted'() {

        const initParams = new InitParams().setInitStr("2;F0,10,5,10;B5,0;P0,10,10,0");

        expect(initParams.iterations).equal(2);
        expect(initParams.placeParams).length(3);
        expect(initParams.placeParams[0].type).equal(ForkliftParam.LETTER);
        let flParam = initParams.placeParams[0] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(10);
        expect(flParam.stepMod).equal(5);
        expect(flParam.stepDiv).equal(10);

        expect(initParams.placeParams[1].type).equal(BufferParam.LETTER);
        let buParam = initParams.placeParams[1] as BufferParam;
        expect(buParam.start).equal(5);
        expect(buParam.limit).equal(0);

        expect(initParams.placeParams[2].type).equal(ProcessorParam.LETTER);
        let prParam = initParams.placeParams[2] as ProcessorParam;
        expect(prParam.secondaryFrom).equal(0);
        expect(prParam.min).equal(10);
        expect(prParam.max).equal(10);
        expect(prParam.union).equal(false);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(3);
        expect(gameResultValue.rows).length(3);

        expect(game.rowArr[2][1].count).equal(0);
        expect(game.rowArr[2][1].mayCount).equal(0);
        expect(game.rowArr[2][2].count).equal(5);
        expect(game.rowArr[2][3].count).equal(0);
        expect(game.rowArr[2][3].mayCount).equal(0);
        expect(game.rowArr[2][4].count).equal(0);

        expect(game.rowArr[1][1].count).equal(0);
        expect(game.rowArr[1][1].mayCount).equal(0);
        expect(game.rowArr[1][2].count).equal(0);
        expect(game.rowArr[1][3].count).equal(5);
        expect(game.rowArr[1][3].mayCount).equal(10);
        expect(game.rowArr[1][4].count).equal(5);

        expect(game.rowArr[0][1].count).equal(0);
        expect(game.rowArr[0][1].mayCount).equal(0);
        expect(game.rowArr[0][2].count).equal(0);
        expect(game.rowArr[0][3].count).equal(0);
        expect(game.rowArr[0][3].mayCount).equal(10);
        expect(game.rowArr[0][4].count).equal(5);
    }

    @test 'Processor right limeted'() {

        const initParams = new InitParams().setInitStr("2;P0,10,10,0;B5,15;F0,1,1,1");

        expect(initParams.iterations).equal(2);
        expect(initParams.placeParams).length(3);
        expect(initParams.placeParams[0].type).equal(ProcessorParam.LETTER);
        let prParam = initParams.placeParams[0] as ProcessorParam;
        expect(prParam.secondaryFrom).equal(0);
        expect(prParam.min).equal(10);
        expect(prParam.max).equal(10);
        expect(prParam.union).equal(false);

        expect(initParams.placeParams[1].type).equal(BufferParam.LETTER);
        let buParam = initParams.placeParams[1] as BufferParam;
        expect(buParam.start).equal(5);
        expect(buParam.limit).equal(15);

        expect(initParams.placeParams[2].type).equal(ForkliftParam.LETTER);
        let flParam = initParams.placeParams[2] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(1);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(1);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(3);
        expect(gameResultValue.rows).length(3);

        expect(game.rowArr[2][1].count).equal(0);
        expect(game.rowArr[2][1].mayCount).equal(0);
        expect(game.rowArr[2][2].count).equal(5);
        expect(game.rowArr[2][3].count).equal(0);
        expect(game.rowArr[2][3].mayCount).equal(0);
        expect(game.rowArr[2][4].count).equal(0);

        expect(game.rowArr[1][1].count).equal(10);
        expect(game.rowArr[1][1].mayCount).equal(10);
        expect(game.rowArr[1][2].count).equal(14);
        expect(game.rowArr[1][3].count).equal(1);
        expect(game.rowArr[1][3].mayCount).equal(1);
        expect(game.rowArr[1][4].count).equal(1);

        expect(game.rowArr[0][1].count).equal(2);
        expect(game.rowArr[0][1].mayCount).equal(10);
        expect(game.rowArr[0][2].count).equal(15);
        expect(game.rowArr[0][3].count).equal(1);
        expect(game.rowArr[0][3].mayCount).equal(1);
        expect(game.rowArr[0][4].count).equal(2);
    }

    @test 'Secondaries'() {

        const initParams = new InitParams().setInitStr("10;F0,5,1,5;B0,0;F9,1,1,1;B0,0;P7,1,1,1;B0,0;P0,10,10,0;B10,0;P7,1,1,1;B0,0;P7,5,5,0");

        expect(initParams.iterations).equal(10);
        expect(initParams.placeParams).length(11);

        expect(initParams.placeParams[0].type).equal(ForkliftParam.LETTER);
        let flParam = initParams.placeParams[0] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(0);
        expect(flParam.volume).equal(5);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(5);

        expect(initParams.placeParams[2].type).equal(ForkliftParam.LETTER);
        flParam = initParams.placeParams[2] as ForkliftParam;
        expect(flParam.secondaryFrom).equal(9);
        expect(flParam.volume).equal(1);
        expect(flParam.stepMod).equal(1);
        expect(flParam.stepDiv).equal(1);

        expect(initParams.placeParams[4].type).equal(ProcessorParam.LETTER);
        let prParam = initParams.placeParams[4] as ProcessorParam;
        expect(prParam.secondaryFrom).equal(7);
        expect(prParam.min).equal(1);
        expect(prParam.max).equal(1);
        expect(prParam.union).equal(true);

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(11);
        expect(gameResultValue.rows).length(11);

        expect(game.rowArr[10][1].count).equal(0);
        expect(game.rowArr[10][1].mayCount).equal(0);
        expect(game.rowArr[10][2].count).equal(0);
        expect(game.rowArr[10][3].count).equal(0);
        expect(game.rowArr[10][3].mayCount).equal(0);
        expect(game.rowArr[10][4].count).equal(0);
        expect(game.rowArr[10][5].count).equal(0);
        expect(game.rowArr[10][5].mayCount).equal(0);
        expect(game.rowArr[10][6].count).equal(0);
        expect(game.rowArr[10][7].count).equal(0);
        expect(game.rowArr[10][7].mayCount).equal(0);
        expect(game.rowArr[10][8].count).equal(10);
        expect(game.rowArr[10][9].count).equal(0);
        expect(game.rowArr[10][9].mayCount).equal(0);
        expect(game.rowArr[10][10].count).equal(0);
        expect(game.rowArr[10][11].count).equal(0);
        expect(game.rowArr[10][11].mayCount).equal(0);
        expect(game.rowArr[10][12].count).equal(0);

        expect(game.rowArr[9][1].count).equal(5);
        expect(game.rowArr[9][1].mayCount).equal(5);
        expect(game.rowArr[9][2].count).equal(0);
        expect(game.rowArr[9][3].count).equal(5);
        expect(game.rowArr[9][3].mayCount).equal(10);
        expect(game.rowArr[9][4].count).equal(5);
        expect(game.rowArr[9][5].count).equal(0);
        expect(game.rowArr[9][5].mayCount).equal(0);
        expect(game.rowArr[9][6].count).equal(0);
        expect(game.rowArr[9][7].count).equal(0);
        expect(game.rowArr[9][7].mayCount).equal(0);
        expect(game.rowArr[9][8].count).equal(0);
        expect(game.rowArr[9][9].count).equal(10);
        expect(game.rowArr[9][9].mayCount).equal(10);
        expect(game.rowArr[9][10].count).equal(10);
        expect(game.rowArr[9][11].count).equal(0);
        expect(game.rowArr[9][11].mayCount).equal(5);
        expect(game.rowArr[9][12].count).equal(0);

        expect(game.rowArr[8][1].count).equal(0);
        expect(game.rowArr[8][1].mayCount).equal(0);
        expect(game.rowArr[8][2].count).equal(0);
        expect(game.rowArr[8][3].count).equal(0);
        expect(game.rowArr[8][3].mayCount).equal(0);
        expect(game.rowArr[8][4].count).equal(0);
        expect(game.rowArr[8][5].count).equal(5);
        expect(game.rowArr[8][5].mayCount).equal(10);
        expect(game.rowArr[8][6].count).equal(5);
        expect(game.rowArr[8][7].count).equal(0);
        expect(game.rowArr[8][7].mayCount).equal(10);
        expect(game.rowArr[8][8].count).equal(0);
        expect(game.rowArr[8][9].count).equal(0);
        expect(game.rowArr[8][9].mayCount).equal(10);
        expect(game.rowArr[8][10].count).equal(5);
        expect(game.rowArr[8][11].count).equal(5);
        expect(game.rowArr[8][11].mayCount).equal(5);
        expect(game.rowArr[8][12].count).equal(5);

        expect(game.rowArr[7][1].count).equal(0);
        expect(game.rowArr[7][1].mayCount).equal(0);
        expect(game.rowArr[7][2].count).equal(0);
        expect(game.rowArr[7][3].count).equal(0);
        expect(game.rowArr[7][3].mayCount).equal(0);
        expect(game.rowArr[7][4].count).equal(0);
        expect(game.rowArr[7][5].count).equal(0);
        expect(game.rowArr[7][5].mayCount).equal(5);
        expect(game.rowArr[7][6].count).equal(0);
        expect(game.rowArr[7][7].count).equal(5);
        expect(game.rowArr[7][7].mayCount).equal(10);
        expect(game.rowArr[7][8].count).equal(5);
        expect(game.rowArr[7][9].count).equal(0);
        expect(game.rowArr[7][9].mayCount).equal(10);
        expect(game.rowArr[7][10].count).equal(0);
        expect(game.rowArr[7][11].count).equal(5);
        expect(game.rowArr[7][11].mayCount).equal(5);
        expect(game.rowArr[7][12].count).equal(10);

        expect(game.rowArr[6][1].count).equal(0);
        expect(game.rowArr[6][1].mayCount).equal(0);
        expect(game.rowArr[6][2].count).equal(0);
        expect(game.rowArr[6][3].count).equal(0);
        expect(game.rowArr[6][3].mayCount).equal(5);
        expect(game.rowArr[6][4].count).equal(0);
        expect(game.rowArr[6][5].count).equal(0);
        expect(game.rowArr[6][5].mayCount).equal(5);
        expect(game.rowArr[6][6].count).equal(0);
        expect(game.rowArr[6][7].count).equal(0);
        expect(game.rowArr[6][7].mayCount).equal(5);
        expect(game.rowArr[6][8].count).equal(0);
        expect(game.rowArr[6][9].count).equal(5);
        expect(game.rowArr[6][9].mayCount).equal(10);
        expect(game.rowArr[6][10].count).equal(5);
        expect(game.rowArr[6][11].count).equal(0);
        expect(game.rowArr[6][11].mayCount).equal(5);
        expect(game.rowArr[6][12].count).equal(10);

        expect(gameResultValue.rows[6]).length(13);

        expect(gameResultValue.rows[6][0].isBuffer).equal(true);
        expect(gameResultValue.rows[6][0].count).equal(-5);
        expect(gameResultValue.rows[6][0].may).equal(0);
        expect(gameResultValue.rows[6][1].isBuffer).equal(false);
        expect(gameResultValue.rows[6][1].count).equal(0);
        expect(gameResultValue.rows[6][1].may).equal(0);
        expect(gameResultValue.rows[6][2].isBuffer).equal(true);
        expect(gameResultValue.rows[6][2].count).equal(0);
        expect(gameResultValue.rows[6][2].may).equal(0);
        expect(gameResultValue.rows[6][3].isBuffer).equal(false);
        expect(gameResultValue.rows[6][3].count).equal(0);
        expect(gameResultValue.rows[6][3].may).equal(5);
        expect(gameResultValue.rows[6][4].isBuffer).equal(true);
        expect(gameResultValue.rows[6][4].count).equal(0);
        expect(gameResultValue.rows[6][4].may).equal(0);
        expect(gameResultValue.rows[6][5].isBuffer).equal(false);
        expect(gameResultValue.rows[6][5].count).equal(0);
        expect(gameResultValue.rows[6][5].may).equal(5);
        expect(gameResultValue.rows[6][6].isBuffer).equal(true);
        expect(gameResultValue.rows[6][6].count).equal(0);
        expect(gameResultValue.rows[6][6].may).equal(0);
        expect(gameResultValue.rows[6][7].isBuffer).equal(false);
        expect(gameResultValue.rows[6][7].count).equal(0);
        expect(gameResultValue.rows[6][7].may).equal(5);
        expect(gameResultValue.rows[6][8].isBuffer).equal(true);
        expect(gameResultValue.rows[6][8].count).equal(0);
        expect(gameResultValue.rows[6][8].may).equal(0);
        expect(gameResultValue.rows[6][9].isBuffer).equal(false);
        expect(gameResultValue.rows[6][9].count).equal(5);
        expect(gameResultValue.rows[6][9].may).equal(10);
        expect(gameResultValue.rows[6][10].isBuffer).equal(true);
        expect(gameResultValue.rows[6][10].count).equal(5);
        expect(gameResultValue.rows[6][10].may).equal(0);
        expect(gameResultValue.rows[6][11].isBuffer).equal(false);
        expect(gameResultValue.rows[6][11].count).equal(0);
        expect(gameResultValue.rows[6][11].may).equal(5);
        expect(gameResultValue.rows[6][12].isBuffer).equal(true);
        expect(gameResultValue.rows[6][12].count).equal(10);
        expect(gameResultValue.rows[6][12].may).equal(0);
    }

    @test 'Times'() {

        const initParams = new InitParams().setInitStr("5;P0,1,1,0;B20,0;F0,5,1,1");

        let gameResultValue = new GameResult();
        const setGameResult = (gameResult: GameResult) => {
            gameResultValue = gameResult;
        };

        const game = new GameRunner(initParams, gameResultValue, setGameResult);
        game.run();

        expect(game.rowArr).length(6);
        expect(gameResultValue.rows).length(6);

        expect(gameResultValue.times).length(4);
        expect(gameResultValue.times[0]).equal(4);
        expect(gameResultValue.times[1]).equal(3);
        expect(gameResultValue.times[2]).equal(2);
        expect(gameResultValue.times[3]).equal(1);

    }

}