import { UISystem } from "../../systems/UISystem";
import { startSceneState } from "../ISceneState";
import { rankPanel } from "../../uiSystem/rankPanel";
import { GameLoop } from "../../GameLoop";
import { settingBtnSp } from "./settingBtnSp";
import { AudioManager, AudioType } from "../../comms/AudioManager";
import { desPanel } from "../../uiSystem/desPanel";
import { selectLevelPanel } from "../../uiSystem/selectLevelPanel";
import { changeRankPanel } from "../../uiSystem/changeRankPanel";

export class startExterior {

    private constructor() { this.init(); }

    private static _instance: startExterior = null;
    public static getInstance(): startExterior {
        if (this._instance == null)
            this._instance = new startExterior();
        return this._instance;
    }
    public static endInstance() {
        this._instance = null;
    }

    private mStartState: startSceneState = null;         //开始状态
    public uiSys: UISystem = null;                       //UI系统
    private startBtn: cc.Node = null;                    //开始按钮

    private upArea: cc.Node = null;
    private friendsBtn: cc.Node = null;                  //好友按钮
    private musicBtn: cc.Node = null;                    //音乐
    private desBtn: cc.Node = null;                      //活动描述
    private changeBtn:cc.Node = null;                    //争霸赛排行按钮

    private bg: cc.Sprite = null;                        //背景
    private bgNew: cc.Sprite = null;                     //新背景（副本）

    //记录UI元素初始位置
    private up: cc.Vec2 = cc.v2(0, 0);
    private center: cc.Vec2 = cc.v2(0, 0);

    private liuhai: number = 0;                          //刘海高度

    public currIndex: number = 0;                        //当前选择关卡的索引（0-2）

    private setBtnSp: settingBtnSp = null;

    private logo: cc.Node = null;                    //logo
    private uiElement: cc.Node = null;
    private bgAction: cc.Node = null;                //背景动画节点

    private init(): void {
        this.initComponents();
    }

    /**播放开场动画 */
    private playBgAction(): void {
        if (GameLoop.getInstance().isPlayBgAction) {
            this.bgAction.destroy();
            this.logo.runAction(cc.spawn(cc.moveTo(.2, cc.v2(0, 255)), cc.fadeIn(.2)));
            this.bg.spriteFrame = this.setBtnSp.bgs[2];

            this.uiElement.active = true;
            this.hideUI(false);
            this.uiElement.opacity = 255;
            this.showUI();
            return;
        }
        this.logo.runAction(cc.moveTo(3, cc.v2(0, 255)));
        this.bgAction.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(2, cc.v2(0, 0)),
                cc.fadeIn(2)
            ),
            cc.callFunc(() => {
                this.bgAction.children[1].runAction(cc.sequence(
                    cc.spawn(
                        cc.fadeIn(1),
                        cc.moveTo(1, cc.v2(0, 0))
                    ),
                    cc.callFunc(() => {
                        this.bgAction.children[0].runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.fadeIn(1),
                                    cc.moveBy(1, cc.v2(0, 100))
                                ),
                                cc.callFunc(() => { this.onBgAction(); })
                            )
                        )
                    })
                ))
            })
        ))
    }

    private onBgAction(): void {
        this.uiElement.active = true;
        this.hideUI(false, ()=>{
            this.uiElement.opacity = 255;
            this.showUI();
            GameLoop.getInstance().isPlayBgAction = true;
        });
    }

    /**初始化组件 */
    private initComponents(): void {
        GameLoop.getInstance().currIndex = -1;
        this.uiSys = new UISystem();
        this.uiSys.sysInit();

        this.uiElement = cc.find("Canvas/UILayer/uiElement");
        this.startBtn = cc.find("combat_btn", this.uiElement);

        this.upArea = cc.find("up", this.uiElement);
        this.friendsBtn = cc.find("friends", this.upArea);
        this.musicBtn = cc.find("musicBtn", this.upArea);
        this.desBtn = cc.find("description", this.upArea);
        this.changeBtn = cc.find("changeBtn", this.upArea);

        this.bg = cc.find("Canvas/bg").getComponent(cc.Sprite);
        this.bgNew = cc.find("Canvas/bgNew").getComponent(cc.Sprite);
        this.setBtnSp = cc.find("Canvas").getComponent(settingBtnSp);
        this.logo = cc.find("Canvas/UILayer/logo");
        this.bgAction = cc.find("Canvas/bg/bgAction");

        this.initUIPos();
        this.uiElement.active = false;

        this.playBgAction();
        this.onBtnEvent();

        let isMute: boolean = GameLoop.getInstance().isMuteAudio;
        let setBtnSp: settingBtnSp = cc.find("Canvas").getComponent(settingBtnSp);
        this.musicBtn.getComponent(cc.Sprite).spriteFrame = isMute ? setBtnSp.bgs[1] : setBtnSp.bgs[0];
        AudioManager.getInstance().playBGM(AudioType.BGM_1);
    }
    /**初始化UI元素位置 */
    private initUIPos(): void {
        this.up = this.upArea.position;
        this.center = this.startBtn.position;
    }

    public setSceneState(mStartState: startSceneState): void {
        this.mStartState = mStartState;
    }

    public setMainState(): void {
        this.mStartState.setMainState();
    }
    public setLevel_2State(): void {
        this.mStartState.setLevel_2State();
    }
    public setLevel_3State(): void {
        this.mStartState.setLevel_3State();
    }
    public update(): void {

    }
    public end(): void {
        this.startBtn.off("touchend", this.onstartBtn, this);
        this.friendsBtn.off("touchend", this.onfriendsBtn, this);
        this.musicBtn.off("touchend", this.onMusicBtn, this);
        this.desBtn.off("touchend", this.ondesBtn, this);
        this.changeBtn.off("touchend", this.onChangebtn, this);

        startExterior.endInstance();
    }

    //#region 监听事件

    private onBtnEvent(): void {
        this.startBtn.on("touchend", this.onstartBtn, this);
        this.friendsBtn.on("touchend", this.onfriendsBtn, this);
        this.musicBtn.on("touchend", this.onMusicBtn, this);
        this.desBtn.on("touchend", this.ondesBtn, this);
        this.changeBtn.on("touchend", this.onChangebtn, this);
    }

    private onstartBtn(): void {
        this.uiSys.openPanel(selectLevelPanel, "selectLevelPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onfriendsBtn(): void {
        this.uiSys.openPanel(rankPanel, "rankPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onMusicBtn(): void {
        let isMute: boolean = GameLoop.getInstance().onMusicBtn();
        let setBtnSp: settingBtnSp = cc.find("Canvas").getComponent(settingBtnSp);
        this.musicBtn.getComponent(cc.Sprite).spriteFrame = isMute ? setBtnSp.bgs[1] : setBtnSp.bgs[0];
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private ondesBtn(): void {
        this.uiSys.openPanel(desPanel, "desPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onChangebtn():void{
        this.uiSys.openPanel(changeRankPanel, "changeRankPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    //#endregion

    /**隐藏界面UI */
    public hideUI(isAction: boolean = true, call?: Function): void {

        let dur: number = isAction ? .2 : 0.001;

        this.upArea.runAction(this.actionBack(0, 300, dur));
        this.startBtn.runAction(this.actionBack(0, -100, dur, call));
    }
    /**显示界面UI */
    public showUI(): void {
        this.upArea.runAction(this.actionTo(this.up));
        this.startBtn.runAction(this.actionTo(this.center));
    }

    private actionBack(posX: number, posY: number, dur: number = .3, call?: Function): cc.FiniteTimeAction {
        return cc.sequence(
            cc.spawn(
                cc.moveBy(dur, cc.v2(posX, posY)),
                cc.fadeOut(dur)
            ),
            cc.callFunc(() => {
                if (!!call)
                    call();
            })
        )
    }
    private actionTo(vec: cc.Vec2): cc.FiniteTimeAction {
        return cc.sequence(
            cc.delayTime(0.02),
            cc.spawn(
                cc.moveTo(.3, vec).easing(cc.easeBackOut()),
                cc.fadeIn(.3)
            )
        )
    }
}
