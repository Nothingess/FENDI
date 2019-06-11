import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { strateB } from "./openAction/IOpenStrategy";
import { loadPanel } from "./loadPanel";
import { GameLoop } from "../GameLoop";

export class selectPanel extends IUIBase {

    private manRole:cc.Node = null;
    private womanRole:cc.Node = null;
    private select:cc.Node = null;
    private yes:cc.Node = null;

    private closeBtn:cc.Node = null;

    private currSelect:cc.Node = null;
    //private isLoad:boolean = false;

    private isMan:boolean = false;           //当前选择的角色性别

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
                    cc.moveTo(.1, cc.v2(-125, -35)),
                    cc.fadeTo(.1, 255)
                ),
                cc.callFunc(()=>{
                    this.onSelectRole(this.manRole);
                })
            )

        )
        this.womanRole.runAction(
            cc.spawn(
                cc.moveTo(.1, cc.v2(125, -35)),
                cc.fadeTo(.1, 255)
            )
        )
        this.yes.runAction(
            cc.spawn(
                cc.moveTo(.1, cc.v2(0, -260)),
                cc.fadeTo(.1, 255)
            )
        )
    }

    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }

    private onSelectRole(select:cc.Node):void{
        if(select == this.currSelect)return;
        if(this.currSelect != null){
            this.currSelect.runAction(cc.scaleTo(.1, 1));
        }
        this.currSelect = select;
        this.currSelect.runAction(cc.scaleTo(.1, 1.1));
        this.isMan = !this.isMan;
        GameLoop.getInstance().isMan = this.isMan;
    }
    private onYesBtn():void{
/*         if(this.isLoad)return;
        this.isLoad = true; */
        //if(this.currSelect)
        //startExterior.getInstance().enterMainState();
        //startExterior.getInstance().uiSys.openPanel(loadPanel, "loadPanel", ["01level"]);
        GameLoop.getInstance().currIndex = startExterior.getInstance().currIndex;
        if(GameLoop.getInstance().currIndex == 0)
            startExterior.getInstance().uiSys.openPanel(loadPanel, "loadPanel", ["01level"]);
        else if(GameLoop.getInstance().currIndex == 1)
            startExterior.getInstance().uiSys.openPanel(loadPanel, "loadPanel", ["03level"]);
    }
}
