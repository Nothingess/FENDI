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
    
    //选择面板
    private left:cc.Node = null;
    private center:cc.Node = null;
    private right:cc.Node = null;
    private currSelect:cc.Node = null;


    private test:cc.Node = null;

    private init():void{
        this.initComponents();
        this.initUserInfoButton();
    }
    /**初始化组件 */
    private initComponents():void{
        this.uiSys = new UISystem();
        this.uiSys.sysInit();

        this.startBtn = cc.find("Canvas/UILayer/uiElement/combat_btn");
        this.friendsBtn = cc.find("Canvas/UILayer/uiElement/bottom/friends");
        this.setBtn = cc.find("Canvas/UILayer/uiElement/bottom/setting");

        let selectNode:cc.Node = cc.find("Canvas/UILayer/uiElement/select");
        this.left = cc.find("explore", selectNode);
        this.center = cc.find("dream", selectNode);
        this.right = cc.find("search", selectNode);
        this.currSelect = this.center;
        
        this.onBtnEvent();
    }

	
    private initUserInfoButton () {
        if (typeof wx === 'undefined') {
            return;
        }
 
        let systemInfo = wx.getSystemInfoSync();
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

        this.left.on("touchend", this.onLeftPanel, this);
        this.center.on("touchend", this.onCenterPanel, this);
        this.right.on("touchend", this.onRightPanel, this);
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

    private onLeftPanel():void{
        if(this.currSelect == this.left)return;
        this.left.getChildByName("mask").active = false;
        this.currSelect.getChildByName("mask").active = true;
        this.currSelect = this.left;
    }
    private onCenterPanel():void{
        if(this.currSelect == this.center)return;
        this.center.getChildByName("mask").active = false;
        this.currSelect.getChildByName("mask").active = true;
        this.currSelect = this.center;
    }
    private onRightPanel():void{
        if(this.currSelect == this.right)return;
        this.right.getChildByName("mask").active = false;
        this.currSelect.getChildByName("mask").active = true;
        this.currSelect = this.right;
    }
    //#endregion

//#region 选择面板



//#endregion
}
