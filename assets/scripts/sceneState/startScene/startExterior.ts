import { UISystem } from "../../systems/UISystem";
import { startSceneState } from "../ISceneState";
import { rankPanel } from "../../uiSystem/rankPanel";
import { setPanel } from "../../uiSystem/setPanel";
import { selectPanel } from "../../uiSystem/selectPanel";
import { Loader } from "../../comms/LoaderManager";
import { GameLoop } from "../../GameLoop";
import { settingBtnSp } from "./settingBtnSp";
import { AudioManager, AudioType } from "../../comms/AudioManager";

export class startExterior {

    private constructor(){this.init();}

    private static _instance:startExterior = null;
    public static getInstance():startExterior{
        if(this._instance == null)
            this._instance = new startExterior();
        return this._instance;
    }
    public static endInstance(){
        this._instance = null;
    }

    private mStartState:startSceneState = null;         //开始状态
    public uiSys:UISystem = null;                       //UI系统
    private startBtn:cc.Node = null;                    //开始按钮
    private friendsBtn:cc.Node = null;                  //好友按钮
    private setBtn:cc.Node = null;                      //设置按钮
    private leftBtn:cc.Node = null;                     //左边按钮
    private rightBtn:cc.Node = null;                    //右边按钮
    private bg:cc.Sprite = null;                        //背景
    private bgNew:cc.Sprite = null;                     //新背景（副本）

    //记录UI元素初始位置
    private leftUp:cc.Vec2 = cc.v2(0, 0);
    private rightUp:cc.Vec2 = cc.v2(0, 0);
    private left:cc.Vec2 = cc.v2(0, 0);
    private right:cc.Vec2 = cc.v2(0, 0);
    private center:cc.Vec2 = cc.v2(0, 0);

    private liuhai:number = 0;                          //刘海高度

    public currIndex:number = 0;                        //当前选择关卡的索引（0-2）
    private currRoleIndex:number = 0;                   //当前选择的角色（0：男，1：nv）

    private setBtnSp:settingBtnSp = null;
    private isChangeBging:boolean = false;              //是否正在切换背景（观卡）


    private logo:cc.Node = null;                    //logo
    private uiElement: cc.Node = null;
    private bgAction:cc.Node = null;                //背景动画节点
    private isDestroyBgAction:boolean = false;      //是否销毁开始动画

    private init():void{
        this.initComponents();
        this.autoView();
    }
    /**适配部分UI */
    private autoView():void{
        if(GameLoop.getInstance().platform != null){
            if(GameLoop.getInstance().platform.liuhai > 20){//全面屏
                this.leftBtn.runAction(cc.moveBy(0.2, cc.v2(80, 0)));
            }
        }
    }

    /**播放开场动画 */
    private playBgAction():void{
        if(GameLoop.getInstance().isPlayBgAction){
            this.bgAction.destroy();
            this.logo.runAction(cc.spawn(cc.moveTo(.2, cc.v2(0, 255)), cc.fadeIn(.2)));
            this.bg.spriteFrame = this.setBtnSp.bgs[this.currIndex];

            this.uiElement.active = true;
            this.hideUI(false);
            this.uiElement.opacity = 255;
            this.showUI();
            return;
        }
        this.logo.runAction(cc.spawn(cc.moveTo(10, cc.v2(0, 255)), cc.fadeIn(10)));
        this.bgAction.runAction(cc.sequence(
            cc.moveTo(8, cc.v2(0, 0)),
            cc.callFunc(()=>{
                this.bgAction.children[1].runAction(cc.sequence(
                    cc.fadeIn(2),
                    cc.callFunc(()=>{
                        this.bgAction.children[0].runAction(cc.fadeIn(2))
                        this.bgAction.children[3].runAction(
                            cc.repeatForever(cc.sequence(cc.fadeIn(2).easing(cc.easeOut(1.5)), cc.fadeOut(2).easing(cc.easeIn(1.5))))
                        )
                        this.bgAction.on("touchend", this.onBgAction, this)
                    })
                ))
            })
        ))
    }

    private onBgAction():void{
        console.log("this.bgAction.on touchend")
        this.bgAction.children[3].stopAllActions();
        this.bgAction.children[3].active = false;

        this.uiElement.active = true;
        this.hideUI(false);
        this.uiElement.opacity = 255;
        this.showUI();
        GameLoop.getInstance().isPlayBgAction = true;
        this.bgAction.off("touchend", this.onBgAction, this);
    }

    /**初始化组件 */
    private initComponents():void{
        GameLoop.getInstance().currIndex = -1;
        this.uiSys = new UISystem();
        this.uiSys.sysInit();

        this.uiElement = cc.find("Canvas/UILayer/uiElement");
        this.startBtn = cc.find("combat_btn", this.uiElement);
        this.friendsBtn = cc.find("up/friends", this.uiElement);
        this.setBtn = cc.find("up/setting", this.uiElement);
        this.leftBtn = cc.find("select_left", this.uiElement);
        this.rightBtn = cc.find("select_right", this.uiElement);
        this.bg = cc.find("Canvas/bg").getComponent(cc.Sprite);
        this.bgNew = cc.find("Canvas/bgNew").getComponent(cc.Sprite);
        this.setBtnSp = cc.find("Canvas").getComponent(settingBtnSp);
        this.logo = cc.find("Canvas/UILayer/logo");
        this.bgAction = cc.find("Canvas/bg/bgAction");

        this.initUIPos();
        this.uiElement.active = false;

        this.playBgAction();
        this.onBtnEvent();
    }
    /**初始化UI元素位置 */
    private initUIPos():void{
        this.leftUp = this.setBtn.position;
        this.rightUp = this.friendsBtn.position;
        this.left = this.leftBtn.position;
        this.right = this.rightBtn.position;
        this.center = this.startBtn.position;
    }

    public setSceneState(mStartState:startSceneState):void{
        this.mStartState = mStartState;
    }
    public enterMainState():void{
        this.mStartState.setMainState();
    }
    public enterLevel_2():void{
        this.mStartState.setLevel_2State();
    }
    public enterLevel_3():void{
        this.mStartState.setLevel_3State();
    }
    public update():void{

    }
    public end():void{
        this.startBtn.off("touchend", this.onstartBtn, this);
        this.friendsBtn.off("touchend", this.onfriendsBtn, this);
        this.setBtn.off("touchend", this.onsetBtn, this);

        this.leftBtn.off("touchend", this.onSelectLeft, this);
        this.rightBtn.off("touchend", this.onSelectRight, this); 
    }

    //#region 监听事件

    private onBtnEvent():void{
        this.startBtn.on("touchend", this.onstartBtn, this);
        this.friendsBtn.on("touchend", this.onfriendsBtn, this);
        this.setBtn.on("touchend", this.onsetBtn, this);

        this.leftBtn.on("touchend", this.onSelectLeft, this);
        this.rightBtn.on("touchend", this.onSelectRight, this);
    }

    private onstartBtn():void{
        this.uiSys.openPanel(selectPanel, "selectPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onfriendsBtn():void{
        this.uiSys.openPanel(rankPanel, "rankPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onsetBtn():void{
        this.uiSys.openPanel(setPanel, "setPanel");
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onSelectLeft():void{
        AudioManager.getInstance().playSound(AudioType.CLICK);
        if(this.isChangeBging)return;
        this.isChangeBging = true;
        this.currIndex = this.currIndex - 1 < 0?2:this.currIndex - 1;
        this.selectLevel();
    }
    private onSelectRight():void{
        AudioManager.getInstance().playSound(AudioType.CLICK);
        if(this.isChangeBging)return;
        this.isChangeBging = true;
        this.currIndex = this.currIndex + 1 > 2?0:this.currIndex + 1;
        this.selectLevel();
    }
    //#endregion

//#region 选择面板

    private selectLevel():void{
        this.bgNew.spriteFrame = this.setBtnSp.bgs[this.currIndex];
        this.bg.node.runAction(cc.sequence(
            cc.fadeOut(.5),
            cc.callFunc(()=>{
                this.bg.spriteFrame = this.bgNew.spriteFrame;
                this.bg.node.opacity = 255;
                this.bgNew.spriteFrame = null;
                this.isChangeBging = false;
                if(this.bgAction.isValid){
                    this.bgAction.destroy();
                }
            })
        ))
    }

//#endregion
    /**隐藏界面UI */
    public hideUI(isAction:boolean = true):void{

/*         if(!isAction){
            this.setBtn.x -= 100;
            this.setBtn.y += 100;
            this.friendsBtn.x += 100;
            this.friendsBtn.y += 100;
            this.leftBtn.x -= 100;
            this.rightBtn.x += 100;
            this.startBtn.y -= 100;
            return;
        } */

        let dur:number = isAction?.2:0.001;

        this.setBtn.runAction(this.actionBack(-100, 100, dur));
        this.friendsBtn.runAction(this.actionBack(100, 100, dur));
        this.leftBtn.runAction(this.actionBack(-100, 0, dur));
        this.rightBtn.runAction(this.actionBack(100, 0, dur));
        this.startBtn.runAction(this.actionBack(0, -100, dur));
    }
    /**显示界面UI */
    public showUI():void{
        this.setBtn.runAction(this.actionTo(this.leftUp));
        this.friendsBtn.runAction(this.actionTo(this.rightUp));
        this.leftBtn.runAction(this.actionTo(this.left));
        this.rightBtn.runAction(this.actionTo(this.right));
        this.startBtn.runAction(this.actionTo(this.center));
    }

    private actionBack(posX:number, posY:number, dur:number = .2):cc.FiniteTimeAction{
        return cc.spawn(
            cc.moveBy(dur, cc.v2(posX, posY)),//.easing(cc.easeBackIn())
            cc.fadeOut(dur)
        )
    }
    private actionTo(vec:cc.Vec2):cc.FiniteTimeAction{
        return cc.sequence(
            cc.delayTime(0.02),
            cc.spawn(
                cc.moveTo(.2, vec).easing(cc.easeBackOut()),
                cc.fadeIn(.2)
            )
        )
    }
}
