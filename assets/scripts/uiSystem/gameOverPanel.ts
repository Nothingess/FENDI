import { IUIBase, PanelLayer } from "./IUIBase";
import { strateB } from "./openAction/IOpenStrategy";
import { mainExterior } from "../sceneState/01level/mainExterior";
import { loadPanel } from "./loadPanel";

export class gameOverPanel extends IUIBase {

    private enterBtn:cc.Node = null;
    //private isChangeScene:boolean = false;
    
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
/*         if(this.isChangeScene)return;
        this.isChangeScene = true; */
        //mainExterior.getInstance().gotoStartState();
        mainExterior.getInstance().uiMgr.openPanel(loadPanel, "loadPanel", ["01startScene"]);
    }

}
