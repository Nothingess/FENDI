import { UISystem } from "../../systems/UISystem";
import { startSceneState } from "../ISceneState";
import { rankPanel } from "../../uiSystem/rankPanel";
import { setPanel } from "../../uiSystem/setPanel";
import { selectPanel } from "../../uiSystem/selectPanel";

export class startExterior {
    private constructor(){this.init();}

    private static _instance:startExterior = null;
    public static getInstance():startExterior{
        if(this._instance == null)
            this._instance = new startExterior();
        return this._instance;
    }

    private mStartState:startSceneState = null;         //开始状态
    public uiSys:UISystem = null;                       //UI系统
    private startBtn:cc.Node = null;                    //开始按钮
    private friendsBtn:cc.Node = null;                  //好友按钮
    private setBtn:cc.Node = null;                      //设置按钮
    private leftBtn:cc.Node = null;                     //左边按钮
    private rightBtn:cc.Node = null;                    //右边按钮

    private liuhai:number = 0;

    private init():void{
        this.initComponents();
        this.initUserInfoButton();
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
        
        this.onBtnEvent();
    }

	
    private initUserInfoButton () {
        if (typeof wx === 'undefined') {
            return;
        }
 
        let systemInfo = wx.getSystemInfoSync();
        this.liuhai = systemInfo.statusBarHeight;           //后面可存为全局数据信息
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });
 
        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                //this.tips.string = res.errMsg;
                return;
            }
 
            cc.loader.load({url: userInfo.avatarUrl, type: 'png'}, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                //this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });
 
/*             wx.getOpenDataContext().postMessage({
                message: "User info get success."
            }); */
 
/*             this.wxSubContextView.runAction(this._showAction);
            this._isShow = true; */
 
            button.hide();
            button.destroy();
 
        });
        if(this.liuhai > 20){//通过判断状态栏高度来判断是否刘海屏：大于20为刘海屏
            this.leftBtn.runAction(cc.moveBy(0.2, cc.v2(80, 0)))
        }
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

    }

    //#region 监听事件

    private onBtnEvent():void{
        this.startBtn.on("touchend", this.onstartBtn, this);
        this.friendsBtn.on("touchend", this.onfriendsBtn, this);
        this.setBtn.on("touchend", this.onsetBtn, this);
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
    //#endregion

//#region 选择面板



//#endregion
}
