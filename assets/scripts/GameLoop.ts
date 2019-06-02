import { SceneController } from "./sceneState/SceneController";
import { startSceneState } from "./sceneState/ISceneState";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameLoop extends cc.Component {

    private mSceneCtrl:SceneController = null;

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.schedule(()=>{cc.sys.garbageCollect()}, 30);
    }

    start () {
        this.mSceneCtrl = new SceneController();
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl), false);
    }
    
    update (dt) {
        this.mSceneCtrl.stateUpdate();
    }

    onDestroy(){
        this.mSceneCtrl.stateEnd();
    }
}