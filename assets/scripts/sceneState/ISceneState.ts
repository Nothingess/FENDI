import { SceneController } from "./SceneController";
import { startExterior } from "./startScene/startExterior";
import { mainExterior } from "./01level/mainExterior";
import { levelThreeExterior } from "./03level/levelThreeExterior";
import { levelTwoExterior } from "./02level/levelTwoExterior";
import { levelFourExterior } from "./04level/levelFourExterior";

export class ISceneState {

    protected mName: string = "";
    protected mSceneCtrl: SceneController = null;
    /**获取场景名称 */
    public getSceneName(): string {
        return this.mName;
    }

    constructor(sceneCtrl: SceneController, name: string) {
        this.mSceneCtrl = sceneCtrl;
        this.mName = name;
    }
    /**状态开始 */
    public stateStart(): void {

    }
    /**状态更新 */
    public stateUpdate(): void {

    }
    /**状态结束 */
    public stateEnd(): void {

    }
}

export class startSceneState extends ISceneState {
    constructor(sceneCtrl: SceneController, name = "01startScene") { super(sceneCtrl, name); }

    public stateStart(): void {
        startExterior.getInstance();
        startExterior.getInstance().setSceneState(this);

        /*         cc.director.preloadScene("01level", function () {
                    cc.log("Next scene preloaded - 01level");
                }); */
        //mainExterior.endInstance();
        //levelTwoExterior.endInstance();
        //levelThreeExterior.endInstance();
    }
    public stateUpdate(): void {
        startExterior.getInstance().update();
    }
    public stateEnd(): void {
        startExterior.getInstance().end();
    }

    public setMainState(): void {
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
    public setLevel_2State(): void {
        this.mSceneCtrl.setState(new level_2State(this.mSceneCtrl));
    }
    public setLevel_3State(): void {
        this.mSceneCtrl.setState(new level_3State(this.mSceneCtrl));
    }
    public setLevel_4State(): void {
        this.mSceneCtrl.setState(new level_4State(this.mSceneCtrl));
    }
}

export class mainSceneState extends ISceneState {
    constructor(sceneCtrl: SceneController, name = "01level") { super(sceneCtrl, name); }

    public stateStart(): void {
        mainExterior.getInstance();
        mainExterior.getInstance().setLevel_1State(this);

        /*         cc.director.preloadScene("01startScene", function () {
                    cc.log("Next scene preloaded - 01startScene");
                }); */
        //startExterior.endInstance();
    }
    public stateUpdate(): void {
        mainExterior.getInstance().update();
    }
    public stateEnd(): void {
        mainExterior.getInstance().end();
    }
    public setStartState(): void {
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl));
    }
    public setMainState(): void {
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
    public setLevel_2State(): void {
        this.mSceneCtrl.setState(new level_2State(this.mSceneCtrl));
    }
    public setLevel_3State(): void {
        this.mSceneCtrl.setState(new level_3State(this.mSceneCtrl));
    }
    public setLevel_4State(): void {
        this.mSceneCtrl.setState(new level_4State(this.mSceneCtrl));
    }
}
export class level_2State extends ISceneState {
    constructor(sceneCtrl: SceneController, name = "02level") { super(sceneCtrl, name); }

    public stateStart(): void {
        levelTwoExterior.getInstance();
        levelTwoExterior.getInstance().setLevelTwoState(this);

        //startExterior.endInstance();
    }
    public stateUpdate(): void {
        levelTwoExterior.getInstance().update();
    }
    public stateEnd(): void {
        levelTwoExterior.getInstance().end();
    }

    public setStartState(): void {
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl));
    }
    public setMainState(): void {
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
    public setLevel_2State(): void {
        this.mSceneCtrl.setState(new level_2State(this.mSceneCtrl));
    }
    public setLevel_3State(): void {
        this.mSceneCtrl.setState(new level_3State(this.mSceneCtrl));
    }
    public setLevel_4State(): void {
        this.mSceneCtrl.setState(new level_4State(this.mSceneCtrl));
    }
}
export class level_3State extends ISceneState {
    constructor(sceneCtrl: SceneController, name = "03level") { super(sceneCtrl, name); }

    public stateStart(): void {
        levelThreeExterior.getInstance();
        levelThreeExterior.getInstance().setLevelThreeState(this);

        /*         cc.director.preloadScene("01startScene", function () {
                    cc.log("Next scene preloaded - 01startScene");
                }); */
        //startExterior.endInstance();
    }
    public stateUpdate(): void {
        levelThreeExterior.getInstance().update();
    }
    public stateEnd(): void {
        levelThreeExterior.getInstance().end();
    }
    public setStartState(): void {
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl));
    }
    public setMainState(): void {
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
    public setLevel_2State(): void {
        this.mSceneCtrl.setState(new level_2State(this.mSceneCtrl));
    }
    public setLevel_3State(): void {
        this.mSceneCtrl.setState(new level_3State(this.mSceneCtrl));
    }
    public setLevel_4State(): void {
        this.mSceneCtrl.setState(new level_4State(this.mSceneCtrl));
    }
}
export class level_4State extends ISceneState {
    constructor(sceneCtrl: SceneController, name = "04level") { super(sceneCtrl, name); }

    public stateStart(): void {
        levelFourExterior.getInstance();
        levelFourExterior.getInstance().setLevelFourState(this);

        /*         cc.director.preloadScene("01startScene", function () {
                    cc.log("Next scene preloaded - 01startScene");
                }); */
        //startExterior.endInstance();
    }
    public stateUpdate(): void {
        levelFourExterior.getInstance().update();
    }
    public stateEnd(): void {
        levelFourExterior.getInstance().end();
    }
    public setStartState(): void {
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl));
    }
    public setMainState(): void {
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
    public setLevel_2State(): void {
        this.mSceneCtrl.setState(new level_2State(this.mSceneCtrl));
    }
    public setLevel_3State(): void {
        this.mSceneCtrl.setState(new level_3State(this.mSceneCtrl));
    }
    public setLevel_4State(): void {
        this.mSceneCtrl.setState(new level_4State(this.mSceneCtrl));
    }
}