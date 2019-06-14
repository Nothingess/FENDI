import { SceneController } from "./sceneState/SceneController";
import { startSceneState } from "./sceneState/ISceneState";
import { IPlatform, WeChatPlatform, QQPlay } from "../plugs/IPlatform";
import { mainExterior } from "./sceneState/01level/mainExterior";
import { levelThreeExterior } from "./sceneState/03level/levelThreeExterior";
import { loadPanel } from "./uiSystem/loadPanel";
import { levelTwoExterior } from "./sceneState/02level/levelTwoExterior";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameLoop extends cc.Component {

    @property({type:[cc.AudioClip], tooltip:"音频资源"})
    audios:Array<cc.AudioClip> = [];

    private static _instance:GameLoop = null;
    public static getInstance():GameLoop{
        return this._instance;
    }

    private mSceneCtrl:SceneController = null;
    public platform:IPlatform = null;
    //全局数据
    public isPlayBgAction:boolean = false;      //
    public isMan:boolean = true;                //当前选择的角色性别
    public currIndex:number = -1;                //当前选择的关卡（0-2）
    public isMuteAudio:boolean = false;              //是否关闭音乐
    public isMuteEff:boolean = false;                //是否关闭音效
    private isLoadSub:boolean = false;               //分包是否加载成功

    public buildNode:Array<cc.Node> = new Array<cc.Node>();
    public groundNode:Array<cc.Node> = new Array<cc.Node>();

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

        if(!this.isLoadSub)
            this.DownLoadSubPack();
    }
    
    update (dt) {
        this.mSceneCtrl.stateUpdate();
    }

    public win():void{
        if(this.currIndex == 0)
            mainExterior.getInstance().win();
        else if(this.currIndex == 1){
            levelTwoExterior.getInstance().win();
        }
        else if(this.currIndex == 2)
            levelThreeExterior.getInstance().win();
    }
    public gotoStartScene():void{
        if(this.currIndex == 0)
            mainExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", mainExterior.getInstance()]);
        else if(this.currIndex == 1){
            levelTwoExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", levelTwoExterior.getInstance()]);
        }
        else if(this.currIndex == 2)
            levelThreeExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", levelThreeExterior.getInstance()]);
    }

    private DownLoadSubPack():void{
        if (typeof wx === 'undefined') return;
        let self = this;
        cc.loader.downloader.loadSubpackage('subpack', function (err) {
            if (err) {
                return console.error(err);
            }
            self.isLoadSub = true;
            console.log('load subpack successfully.');
        });
    }

    onDestroy(){
        this.mSceneCtrl.stateEnd();
    }
}