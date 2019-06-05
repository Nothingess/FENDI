import { IUIBase, PanelLayer } from "./IUIBase";
import { strateA } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";
import { settingBtnSp } from "../sceneState/startScene/settingBtnSp";

export class setPanel extends IUIBase {

    private musicBtn:cc.Sprite = null;
    private audioEffect:cc.Sprite = null;
    private closeBtn:cc.Node = null;

    private setBtnSp:settingBtnSp = null;
    private isMusic:boolean = false;
    private isEffect:boolean = true;

    public initStrategy():void{
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "setPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed():void{
        this.initComponent();
    }
/*     public open():void{
        super.open();
        this.initComponent();
    } */
    public initComponent():void{

        this.musicBtn = cc.find("music", this.skin).getComponent(cc.Sprite);
        this.audioEffect = cc.find("audio_eff", this.skin).getComponent(cc.Sprite);
        this.closeBtn = cc.find("close_btn", this.skin);
        this.setBtnSp = cc.find("Canvas").getComponent(settingBtnSp);

        this.onBtnEvent();
    }

    private onBtnEvent():void{
        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.musicBtn.node.on("touchend", this.onMusicBtn, this);
        this.audioEffect.node.on("touchend", this.onAudioEffect, this);
    }

    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }
    private onMusicBtn():void{
        this.musicBtn.spriteFrame = this.isMusic?this.setBtnSp.close:this.setBtnSp.open;
        this.isMusic = !this.isMusic;
    }
    private onAudioEffect():void{
        this.audioEffect.spriteFrame = this.isEffect?this.setBtnSp.close:this.setBtnSp.open;
        this.isEffect = !this.isEffect;
    }
}
