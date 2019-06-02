import { SceneController } from "./SceneController";
import { startExterior } from "./startScene/startExterior";
import { mainExterior } from "./mainScene/mainExterior";

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
    constructor(sceneCtrl:SceneController, name = "02mainScene"){super(sceneCtrl, name);}

    public stateStart():void{
        mainExterior.getInstance();
    }
    public stateUpdate():void{
        mainExterior.getInstance().update();
    }
    public stateEnd():void{
        mainExterior.getInstance().end();
    }
}