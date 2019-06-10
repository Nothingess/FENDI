import { SceneController } from "./SceneController";
import { startExterior } from "./startScene/startExterior";
import { mainExterior } from "./01level/mainExterior";

export class ISceneState {

    protected mName:string = "";
    protected mSceneCtrl:SceneController = null;
    /**获取场景名称 */
    public getSceneName():string{
        return this.mName;
    }

    constructor(sceneCtrl:SceneController, name:string){
        this.mSceneCtrl = sceneCtrl;
        this.mName = name;
    }
    /**状态开始 */
    public stateStart():void{

    }
    /**状态更新 */
    public stateUpdate():void{

    }
    /**状态结束 */
    public stateEnd():void{

    }
}

export class startSceneState extends ISceneState{
    constructor(sceneCtrl:SceneController, name = "01startScene"){super(sceneCtrl, name);}

    public stateStart():void{
        startExterior.getInstance();
        startExterior.getInstance().setSceneState(this);

        cc.director.preloadScene("01level", function () {
            cc.log("Next scene preloaded - 01level");
        });
        mainExterior.endInstance();
    }
    public stateUpdate():void{
        startExterior.getInstance().update();
    }
    public stateEnd():void{
        startExterior.getInstance().end();
    }

    public setMainState():void{
        this.mSceneCtrl.setState(new mainSceneState(this.mSceneCtrl));
    }
}

export class mainSceneState extends ISceneState{
    constructor(sceneCtrl:SceneController, name = "01level"){super(sceneCtrl, name);}

    public stateStart():void{
        mainExterior.getInstance();
        mainExterior.getInstance().setMainState(this);

        cc.director.preloadScene("01startScene", function () {
            cc.log("Next scene preloaded - 01startScene");
        });
        startExterior.endInstance();
    }
    public stateUpdate():void{
        mainExterior.getInstance().update();
    }
    public stateEnd():void{
        mainExterior.getInstance().end();
    }
    public setStartState():void{
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl));
    }
}