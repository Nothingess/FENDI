import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { strateA } from "./openAction/IOpenStrategy";

const {ccclass, property} = cc._decorator;

@ccclass
export class desPanel extends IUIBase {

    private closeBtn:cc.Node = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "desPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed():void{
        this.initComponent();
    }

    public initComponent():void{
        this.closeBtn = cc.find("btn_close", this.skin);
        
        this.closeBtn.on("touchend", this.onCloseBtn, this);
    }

    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }

    onDestroy():void{
        this.closeBtn.off("touchend", this.onCloseBtn, this);
    }
}
