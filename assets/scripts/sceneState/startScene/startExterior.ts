import { UISystem } from "../../systems/UISystem";
import { startSceneState } from "../ISceneState";
import { rankPanel } from "../../uiSystem/rankPanel";
import { setPanel } from "../../uiSystem/setPanel";
import { selectPanel } from "../../uiSystem/selectPanel";
import { Loader } from "../../comms/LoaderManager";
import { GameLoop } from "../../GameLoop";

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

    private liuhai:number = 0;                          //刘海高度

    private currIndex:number = 0;                       //当前选择关卡的索引（0-2）
    private currRoleIndex:number = 0;                   //当前选择的角色（0：男，1：nv）

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

    /**初始化组件 */
    private initComponents():void{
        this.uiSys = new UISystem();
        this.uiSys.sysInit();

        this.startBtn = cc.find("Canvas/UILayer/uiElement/combat_btn");
        this.friendsBtn = cc.find("Canvas/UILayer/uiElement/up/friends");
        this.setBtn = cc.find("Canvas/UILayer/uiElement/up/setting");
        this.leftBtn = cc.find("Canvas/UILayer/uiElement/select_left");
        this.rightBtn = cc.find("Canvas/UILayer/uiElement/select_right");
        this.bg = cc.find("Canvas/bg").getComponent(cc.Sprite);
        
        this.onBtnEvent();
    }

    public setSceneState(mStartState:startSceneState):void{
        this.mStartState = mStartState;
    }
    public enterMainState():void{
        this.mStartState.setMainState();
    }
    public update():void{

    }
    public end():void{
        startExterior.endInstance();
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
        //this.mStartState.setMainState();
        this.uiSys.openPanel(selectPanel, "selectPanel");
    }
    private onfriendsBtn():void{
        console.log("onfriendsBtn");
        this.uiSys.openPanel(rankPanel, "rankPanel");
    }
    private onsetBtn():void{
        console.log("onsetBtn");

        this.uiSys.openPanel(setPanel, "setPanel");
    }
    private onSelectLeft():void{
        this.currIndex = this.currIndex - 1 < 0?2:this.currIndex - 1;
        this.selectLevel();
    }
    private onSelectRight():void{
        this.currIndex = this.currIndex + 1 > 2?0:this.currIndex + 1;
        this.selectLevel();
    }
    //#endregion

//#region 选择面板

    private selectLevel():void{
        let self = this;
        Loader.getInstance().loadInstance(`ui/bg_${this.currIndex}`, (e)=>{
            self.bg.spriteFrame = new cc.SpriteFrame(e);
        })
    }

//#endregion
}
