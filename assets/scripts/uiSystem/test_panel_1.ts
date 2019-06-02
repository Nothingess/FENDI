import { IUIBase, PanelLayer } from "./IUIBase";
import { strateA, strateB } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";

export class test_panel_1 extends IUIBase {

    private closeBtn:cc.Node = null;
    private content:cc.Label = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "test_panel_1";
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
        this.content = this.skin.getComponentInChildren(cc.Label);

        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.content.string = "我是测试面板——1";
    }
    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }
}
