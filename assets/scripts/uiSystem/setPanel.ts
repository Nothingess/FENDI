import { IUIBase, PanelLayer } from "./IUIBase";
import { strateA } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";
import { settingBtnSp } from "../sceneState/startScene/settingBtnSp";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { GameLoop } from "../GameLoop";

export class setPanel extends IUIBase {

    private musicBtn:cc.Sprite = null;
    private audioEffect:cc.Sprite = null;
    private closeBtn:cc.Node = null;

    private setBtnSp:settingBtnSp = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "setPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowing():void{
        super.onShowing();
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

        this.musicBtn.spriteFrame = GameLoop.getInstance().isMuteAudio?this.setBtnSp.close:this.setBtnSp.open;
        this.audioEffect.spriteFrame = GameLoop.getInstance().isMuteEff?this.setBtnSp.close:this.setBtnSp.open;

        this.onBtnEvent();
    }

    private onBtnEvent():void{
        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.musicBtn.node.on("touchend", this.onMusicBtn, this);
        this.audioEffect.node.on("touchend", this.onAudioEffect, this);
    }

    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onMusicBtn():void{
        this.musicBtn.spriteFrame = GameLoop.getInstance().isMuteAudio?this.setBtnSp.open:this.setBtnSp.close;
        GameLoop.getInstance().isMuteAudio = !GameLoop.getInstance().isMuteAudio;
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onAudioEffect():void{
        this.audioEffect.spriteFrame = GameLoop.getInstance().isMuteEff?this.setBtnSp.open:this.setBtnSp.close;
        GameLoop.getInstance().isMuteEff = !GameLoop.getInstance().isMuteEff;
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }

    onDestroy():void{
        this.closeBtn.off("touchend", this.onCloseBtn, this);
/*         this.musicBtn.node.off("touchend", this.onMusicBtn, this);
        this.audioEffect.node.off("touchend", this.onAudioEffect, this); */
    }
}
