import { SceneController } from "./sceneState/SceneController";
import { startSceneState } from "./sceneState/ISceneState";
import { IPlatform, WeChatPlatform, QQPlay } from "../plugs/IPlatform";
import { mainExterior } from "./sceneState/01level/mainExterior";
import { levelThreeExterior } from "./sceneState/03level/levelThreeExterior";
import { loadPanel } from "./uiSystem/loadPanel";
import { levelTwoExterior } from "./sceneState/02level/levelTwoExterior";
import { AudioManager } from "./comms/AudioManager";
import { EventManager, EventType } from "./comms/EventManager";
import { levelFourExterior } from "./sceneState/04level/levelFourExterior";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLoop extends cc.Component {

    @property({ type: [cc.AudioClip], tooltip: "音频资源" })
    audios: Array<cc.AudioClip> = [];

    private static _instance: GameLoop = null;
    public static getInstance(): GameLoop {
        return this._instance;
    }

    private mSceneCtrl: SceneController = null;
    public platform: IPlatform = null;
    //全局数据
    public isPlayBgAction: boolean = false;      //
    public isMan: boolean = true;                //当前选择的角色性别
    public currIndex: number = -1;                //当前选择的关卡（0-2）
    public isMuteAudio: boolean = false;              //是否关闭音乐
    public isMuteEff: boolean = false;                //是否关闭音效
    private isLoadSub: boolean = false;               //分包是否加载成功
    public userName:string = "";                      //用户名称
    public isUnLock:boolean = false;                  //是否解锁神秘关卡

    public buildNode: Array<cc.Node> = new Array<cc.Node>();
    public groundNode: Array<cc.Node> = new Array<cc.Node>();

    public resUrl:Array<string> = null;               //当家加载的资源路径列表

    onLoad() {
        GameLoop._instance = this;

        cc.game.addPersistRootNode(this.node);
        //this.schedule(() => { cc.sys.garbageCollect() }, 30);
        //cc.game.setFrameRate(60);
    }

    start() {
        this.mSceneCtrl = new SceneController();
        this.mSceneCtrl.setState(new startSceneState(this.mSceneCtrl), false);

        //平台工具类
        if (cc.sys.platform === cc.sys.WECHAT_GAME)
            this.platform = new WeChatPlatform();
        else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this.platform = new QQPlay();
        }
        if (this.platform != null) {
            this.platform.init();
            this.isUnLock = this.platform.isUnLock();
        }

        if (!this.isLoadSub)
            this.DownLoadSubPack();

        this.onSysEvent();
        this.resUrl = new Array<string>();
    }

    public unLock():void{
        this.isUnLock = true;
        if(this.platform != null){
            this.platform.setUnLock();
        }
    }

    update(dt) {
        this.mSceneCtrl.stateUpdate();
    }
    private onSysEvent(): void {
        if (this.platform != null) {
            this.platform.onShow(this.onShow.bind(this));
            this.platform.onHide(this.onHide.bind(this));
        }
    }

    public onMusicBtn(): boolean {
        this.isMuteAudio = !this.isMuteAudio;
        if (this.isMuteAudio) {
            AudioManager.getInstance().pauseMusic();
        } else {
            AudioManager.getInstance().resumeBGM();
        }
        return this.isMuteAudio;
    }

    public win(): void {
        if (this.currIndex == 0)
            mainExterior.getInstance().win();
        else if (this.currIndex == 1) {
            levelTwoExterior.getInstance().win();
        }
        else if (this.currIndex == 2)
            levelThreeExterior.getInstance().win();
        else if(this.currIndex == 3)
            levelFourExterior.getInstance().win();
    }
    public gotoStartScene(): void {
        if (this.currIndex == 0)
            mainExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", mainExterior.getInstance(), 1]);
        else if (this.currIndex == 1) {
            levelTwoExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", levelTwoExterior.getInstance(), 1]);
        }
        else if (this.currIndex == 2)
            levelThreeExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", levelThreeExterior.getInstance(), 1]);
        else if(this.currIndex == 3)
            levelFourExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene", levelFourExterior.getInstance(), 1])
    }

    private DownLoadSubPack(): void {
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

    //#region 监听系统事件

    private onShow(res): void {
        AudioManager.getInstance().resumeAll();
        if (this.currIndex == -1) return;
        this.platform.showModal("Tip", "游戏已暂停，点击继续",
            () => {
                EventManager.getInstance().dispatchEvent(EventType.onShow);
            },
            () => {
                EventManager.getInstance().dispatchEvent(EventType.onShow);
            }
        )
        console.log(res, "进入前台");
    }
    private onHide(res): void {
        AudioManager.getInstance().pauseAll();
        if (this.currIndex == -1) return;
        EventManager.getInstance().dispatchEvent(EventType.onHide);
        console.log(res, "进入后台");
    }
    private offShow(res): void {
        console.log(res, "取消监听进入前台");
    }
    private offHide(res): void {
        console.log(res, "取消监听进入后台");
    }

    //#endregion


    onDestroy() {
        this.mSceneCtrl.stateEnd();
        if (this.platform != null) {
            this.platform.offShow(this.offShow);
            this.platform.offHide(this.offHide);
        }
    }
}