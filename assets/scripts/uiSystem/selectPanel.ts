import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { strateB } from "./openAction/IOpenStrategy";
import ShaderComponent from "../../plugs/shader/ShaderComponent";

export class selectPanel extends IUIBase {

    private manRole:cc.Node = null;
    private womanRole:cc.Node = null;
    private select:cc.Node = null;
    private yes:cc.Node = null;

    private closeBtn:cc.Node = null;

    private currSelect:cc.Node = null;

    public initStrategy():void{
        this.mOpenStrategy = new strateB(this.skin);
    }

    public init(Params?:any[]):void{
        super.init(Params);
        this.skinPath = "selectPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed():void{
        this.initComponent();
    }
    public initComponent():void{
        this.manRole = cc.find("man_role", this.skin);
        this.womanRole = cc.find("woman_role", this.skin);
        this.select = cc.find("select_role", this.skin);
        this.yes = cc.find("yes", this.skin);

        this.closeBtn = cc.find("close_btn", this.skin);
        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.yes.on("touchend", this.onYesBtn, this);
        this.manRole.on("touchend", ()=>{this.onSelectRole(this.manRole)}, this);
        this.womanRole.on("touchend", ()=>{this.onSelectRole(this.womanRole)}, this);
        this.ItemAction();
    }

    private ItemAction():void{
        this.manRole.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveTo(.2, cc.v2(-125, -35)),
                    cc.fadeTo(.2, 255)
                ),
                cc.delayTime(.3),
                cc.callFunc(()=>{
                    this.onSelectRole(this.manRole);
                })
            )

        )
        this.womanRole.runAction(
            cc.spawn(
                cc.moveTo(.2, cc.v2(125, -35)),
                cc.fadeTo(.2, 255)
            )
        )
        this.yes.runAction(
            cc.spawn(
                cc.moveTo(.2, cc.v2(0, -260)),
                cc.fadeTo(.2, 255)
            )
        )
    }

    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }

    private onSelectRole(select:cc.Node):void{
        if(select == this.currSelect)return;
        if(this.currSelect != null){
            this.currSelect.runAction(cc.scaleTo(.2, 1));
        }
        this.currSelect = select;
        this.currSelect.runAction(cc.scaleTo(.2, 1.1));
    }
    private onYesBtn():void{
        startExterior.getInstance().enterMainState();
    }
}
