import { SceneController } from "./sceneState/SceneController";
import { startSceneState } from "./sceneState/ISceneState";
import { IPlatform, WeChatPlatform, QQPlay } from "../plugs/IPlatform";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameLoop extends cc.Component {

    private static _instance:GameLoop = null;
    public static getInstance():GameLoop{
        return this._instance;
    }

    private mSceneCtrl:SceneController = null;
    public platform:IPlatform = null;

    onLoad () {
        GameLoop._instance = this;

        cc.game.addPersistRootNode(this.node);
        this.schedule(()=>{cc.sys.garbageCollect()}, 30);
    }

    start () {
        this.mSceneCtrl = new SceneController();
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl), false);

        //平台工具类
        if(cc.sys.platform === cc.sys.WECHAT_GAME)
            this.platform = new WeChatPlatform();
        else if(cc.sys.platform === cc.sys.QQ_PLAY){
            this.platform = new QQPlay();
        }
        if(this.platform != null)
            this.platform.init();
    }
    
    update (dt) {
        this.mSceneCtrl.stateUpdate();
    }

    onDestroy(){
        this.mSceneCtrl.stateEnd();
    }
}