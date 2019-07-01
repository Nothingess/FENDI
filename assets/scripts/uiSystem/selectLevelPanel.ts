import { IUIBase, PanelLayer } from "./IUIBase";
import { strateC } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { selectPanel } from "./selectPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export class selectLevelPanel extends IUIBase {

    private viewSpaceX: number = 0;          //选择视图item间隙
    private currIndex: number = 0;           //当前选择的关卡索引

    private backBtn: cc.Node = null;
    private enterBtn: cc.Node = null;
    private contextView: cc.Node = null;
    private contextViewLayOut:cc.Layout = null;
    private title: cc.Node = null;

    private itemList: Array<cc.Node> = null;

    //计时器
    private timer:Function = null;

    public initStrategy(): void {
        this.mOpenStrategy = new strateC(this.skin);
    }
    public init(Params?: any[]): void {
        super.init(Params);
        this.skinPath = "selectLevelPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed():void{
        this.initComponent();
    }
    public initComponent():void{
        this.backBtn = cc.find("btn_back", this.skin);
        this.enterBtn = cc.find("btn_enter", this.skin);
        this.contextView = cc.find("contextView", this.skin);
        this.contextViewLayOut = this.contextView.getComponent(cc.Layout);
        this.title = cc.find("txt_tip", this.skin);

        this.itemList = this.contextView.children;

        this.openAction();
        this.onBtnEvent();
    }

    private openAction():void{
        let self = this;
        this.timer = function(){
            if(self.contextViewLayOut.spacingX <= 50){
                self.contextViewLayOut.spacingX = 50;
                self.unschedule(self.timer);
                self.timer = null;
            }
            self.contextViewLayOut.spacingX -= 10;
        }
        this.schedule(this.timer, 0.016);
        this.contextView.runAction(this.action(.3, cc.v2(0, -20)));
        this.title.runAction(this.action(.3, cc.v2(0, 240)));
        this.backBtn.runAction(this.action(.3, cc.v2(-560, 300)));
        this.enterBtn.runAction(this.action(.3, cc.v2(0, -240)));
    }
    private action(dur:number, pos:cc.Vec2):cc.FiniteTimeAction{
        return cc.spawn(
            cc.moveTo(dur, pos).easing(cc.easeBackOut()),
            cc.fadeIn(dur)
        )
    }
/*     private selectAction():void{
        cc.loader.loadRes(`imgs/s_t${this.currIndex + 1}`, cc.SpriteFrame, (err, res)=>{
            this.title.getComponent(cc.Sprite).spriteFrame = res;
        })
        this.title.x = 150;
        this.title.opacity = 0;
        this.title.runAction(this.action(.3, cc.v2(0, 180)))
    } */
    /**注册事件 */
    private onBtnEvent():void{
        this.backBtn.on("touchend", this.onBackBtn, this);
        this.enterBtn.on("touchend", this.onEnterBtn, this);

        for(let i = 0; i < this.itemList.length; i++){
            //if(i == 3)break;
            this.itemList[i].on("touchend", ()=>{
                if(this.currIndex == i)return;
                this.onSelectLevel(i);
                this.currIndex = i;
                //this.selectAction();
            }, this)
        }
    }

    //#region 注册事件

    private onBackBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onEnterBtn():void{
        startExterior.getInstance().currIndex = this.currIndex;
        AudioManager.getInstance().playSound(AudioType.CLICK);

        startExterior.getInstance().uiSys.openPanel(selectPanel, "selectPanel");
        this.onBackBtn();
    }
    private onSelectLevel(num:number):void{
        AudioManager.getInstance().playSound(AudioType.CLICK);
        this.itemList[this.currIndex].getChildByName("mask").runAction(cc.fadeIn(.3));
        this.itemList[num].getChildByName("mask").runAction(cc.fadeOut(.3));
    }

    //#endregion

    onDestroy():void{
        this.backBtn.off("touchend", this.onBackBtn, this);
        this.enterBtn.off("touchend", this.onEnterBtn, this);
    }
}
