import { IUIBase, PanelLayer } from "./IUIBase";
import { strateC } from "./openAction/IOpenStrategy";
import { GameLoop } from "../GameLoop";
import { AudioType, AudioManager } from "../comms/AudioManager";
import { loadPanel } from "./loadPanel";

export class accountsPanel extends IUIBase {

    private content:cc.Node = null;
    private buildNode:cc.Node = null;

    private socre:cc.Node = null;
    private title:cc.Sprite = null;
    private backBtn:cc.Node = null;
    private againBtn:cc.Node = null;
    private posterBtn:cc.Node = null;
    private shareBtn:cc.Node = null;

    private scoreLa:cc.Label = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateC(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "accountsPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowing():void{
        super.onShowing();
        this.initComponent();
    }
    public initComponent():void{
        this.content = cc.find("content", this.skin);
        this.buildNode = cc.find("build", this.skin);
        this.socre = cc.find("right/score", this.skin);
        this.title = this.socre.children[0].getComponent(cc.Sprite);
        this.backBtn = cc.find("btn_back", this.skin);
        this.againBtn = cc.find("right/btn_again", this.skin);
        this.posterBtn = cc.find("right/btn_poster", this.skin);
        this.shareBtn = cc.find("right/btn_share", this.skin);
        this.scoreLa = cc.find("scoreLa", this.socre).getComponent(cc.Label);
        this.scoreLa.string = `${this.args[1]}`;

        cc.loader.loadRes(`imgs/lv${GameLoop.getInstance().currIndex + 1}`, cc.SpriteFrame, (err, res)=>{
            this.buildNode.getComponent(cc.Sprite).spriteFrame = res;
        })
        cc.loader.loadRes(`imgs/title_${GameLoop.getInstance().currIndex + 1}`, cc.SpriteFrame, (err, res)=>{
            this.title.spriteFrame = res;
        })
        cc.loader.loadRes(`imgs/content_${GameLoop.getInstance().currIndex + 1}`, cc.SpriteFrame, (err, res)=>{
            this.content.getComponent(cc.Sprite).spriteFrame = res;
        })

        if(!!this.args[2]){
            cc.loader.loadRes("imgs/btn_continue", cc.SpriteFrame, (err, res)=>{
                this.againBtn.getComponent(cc.Sprite).spriteFrame = res;
            })
        }

        this.onBtnEvent();
    }
    public onShowed():void{
        super.onShowed();
        this.showAction();
    }

    private onBtnEvent():void{
        this.backBtn.on("touchend", this.onBackBtn, this);
        this.againBtn.on("touchend", this.onAgainBtn, this);
        this.posterBtn.on("touchend", this.onPosterBtn, this);
        this.shareBtn.on("touchend", this.onShareBtn, this);
    }


    private showAction():void{
        this.content.y -= 100;
        this.backBtn.x += 100;
        this.againBtn.x -= 100;
        this.posterBtn.x += 100;
        this.shareBtn.y -= 100;

        this.backBtn.runAction(this.commAction(-100, 0));
        this.content.runAction(this.commAction(0, 100, .2));
        this.socre.runAction(cc.spawn(cc.scaleTo(.3, 1).easing(cc.easeBackOut()), cc.fadeIn(.2)));
        this.againBtn.runAction(this.commAction(100, 0, .4));
        this.posterBtn.runAction(this.commAction(-100, 0, .6));
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
    private onAgainBtn():void{
        if(!this.args[2]){
            if(GameLoop.getInstance().currIndex == 0){
                this.args[0].uiMgr.openPanel(loadPanel, "loadPanel", ["01level", this.args[0], 1]);
            }else if(GameLoop.getInstance().currIndex == 1){
                this.args[0].uiMgr.openPanel(loadPanel, "loadPanel", ["02level", this.args[0], 1]);
            }else{
                this.args[0].uiMgr.openPanel(loadPanel, "loadPanel", ["03level", this.args[0], 1]);
            }
            return;
        }

        GameLoop.getInstance().currIndex = (GameLoop.getInstance().currIndex + 1) % 3;
        this.args[0].uiMgr.openPanel(loadPanel, "loadPanel", [`0${GameLoop.getInstance().currIndex + 1}level`, this.args[0]]);

    }
    private onShareBtn():void{
        console.log("onShareBtn");
        if(GameLoop.getInstance().platform != null)
            GameLoop.getInstance().platform.shareAppMessage();
    }
    private onPosterBtn():void{
        if(GameLoop.getInstance().platform != null)
            GameLoop.getInstance().platform.saveFile(GameLoop.getInstance().currIndex + 1, this.scoreLa.string);
    }
    //#endregion


    onDestroy():void{
        this.backBtn.off("touchend", this.onBackBtn, this);
        this.againBtn.off("touchend", this.onAgainBtn, this);
        this.posterBtn.off("touchend", this.onPosterBtn, this);
        this.shareBtn.off("touchend", this.onShareBtn, this);
    }

}
