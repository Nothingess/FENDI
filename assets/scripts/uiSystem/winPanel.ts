import { IUIBase, PanelLayer } from "./IUIBase";
import { strateB } from "./openAction/IOpenStrategy";
import { mainExterior } from "../sceneState/01level/mainExterior";
import { GameLoop } from "../GameLoop";
import { levelThreeExterior } from "../sceneState/03level/levelThreeExterior";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html

export class winPanel extends IUIBase {

    private enterBtn:cc.Node = null;
    
    public initStrategy():void{
        this.mOpenStrategy = new strateB(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "winPanel";
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
        if(GameLoop.getInstance().currIndex == 0)
            mainExterior.getInstance().gotoStartState();
        else if(GameLoop.getInstance().currIndex == 1)
            levelThreeExterior.getInstance().gotoStartState();
    }
}
