import { IUIBase, PanelLayer } from "./IUIBase";
import { strateB } from "./openAction/IOpenStrategy";
import { mainExterior } from "../sceneState/01level/mainExterior";

export class gameOverPanel extends IUIBase {

    private enterBtn:cc.Node = null;
    
    public initStrategy():void{
        this.mOpenStrategy = new strateB(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "gameOverPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowing():void{
        super.onShowing();
        this.initComponent();
    }

    public initComponent():void{
        this.enterBtn = cc.find("enter_btn", this.skin);

        this.enterBtn.on("touchend", this.onEnterBtn, this);
    }

    private onEnterBtn():void{
        mainExterior.getInstance().gotoStartState();
    }

}
