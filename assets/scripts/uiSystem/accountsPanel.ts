import { IUIBase, PanelLayer } from "./IUIBase";
import { strateC } from "./openAction/IOpenStrategy";
import { GameLoop } from "../GameLoop";
import { AudioType, AudioManager } from "../comms/AudioManager";

export class accountsPanel extends IUIBase {

    private content:cc.Node = null;
    private buildNode:cc.Node = null;

    private socre:cc.Node = null;
    private backBtn:cc.Node = null;
    private continueBtn:cc.Node = null;
    private againBtn:cc.Node = null;
    private shareBtn:cc.Node = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateC(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "accountsPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed():void{
        super.onShowed();
        this.initComponent();
    }
    public initComponent():void{
        this.content = cc.find("content", this.skin);
        this.buildNode = cc.find("build", this.skin);
        this.socre = cc.find("right/score", this.skin);
        this.backBtn = cc.find("btn_back", this.skin);
        this.continueBtn = cc.find("right/btn_continue", this.skin);
        this.againBtn = cc.find("right/btn_again", this.skin);
        this.shareBtn = cc.find("right/btn_share", this.skin);

        this.onBtnEvent();
        this.showAction();
    }

    private onBtnEvent():void{
        this.backBtn.on("touchend", this.onBackBtn, this);
    }


    private showAction():void{
        this.content.y -= 100;
        this.backBtn.x += 100;
        this.continueBtn.x -= 100;
        this.againBtn.x += 100;
        this.shareBtn.y -= 100;

        this.backBtn.runAction(this.commAction(-100, 0));
        this.content.runAction(this.commAction(0, 100, .2));
        this.socre.runAction(cc.spawn(cc.scaleTo(.3, 1).easing(cc.easeBackOut()), cc.fadeIn(.2)));
        this.continueBtn.runAction(this.commAction(100, 0, .4));
        this.againBtn.runAction(this.commAction(-100, 0, .6));
        this.shareBtn.runAction(this.commAction(0, 100, .8));
        this.buildNode.runAction(cc.spawn(cc.scaleTo(.3, 1).easing(cc.easeBackOut()), cc.fadeIn(.2)));
    }

    private commAction(x:number, y:number, del?:number):cc.FiniteTimeAction{
        return cc.sequence(
            cc.delayTime(del),
            cc.spawn(
                cc.moveBy(.3, cc.v2(x, y)).easing(cc.easeBackOut()),
                cc.fadeIn(.3)
            )
        )
    }

    //#region 绑定按钮事件
    private onBackBtn():void{
        GameLoop.getInstance().gotoStartScene();
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    //#endregion


    onDestroy():void{
        this.backBtn.off("touchend", this.onBackBtn, this);
    }

}
