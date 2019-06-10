import { IUIBase, PanelLayer } from "./IUIBase";
import { strateB } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";

export class rankPanel extends IUIBase {

    private closeBtn:cc.Node = null;
    private wxSubContextView:cc.WXSubContextView = null;
    
    public initStrategy():void{
        this.mOpenStrategy = new strateB(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "rankPanel";
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
        this.closeBtn = cc.find("close_btn", this.skin);
        this.wxSubContextView = cc.find("context", this.skin).getComponent(cc.WXSubContextView);
        this.closeBtn.on("touchend", this.onCloseBtn, this);

        if (typeof wx === 'undefined') return;
        this.wxSubContextView.enabled = true;
    }
    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }

}
