import { IUIBase, PanelLayer } from "./IUIBase";
import { strateA } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";

export class setPanel extends IUIBase {

    private musicBtn:setBtn = null;
    private audioEffect:setBtn = null;
    private closeBtn:cc.Node = null;

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
        this.musicBtn = new setBtn();
        this.audioEffect = new setBtn();

        this.musicBtn.init(cc.find("music/set_btn", this.skin));
        this.audioEffect.init(cc.find("audioEffect/set_btn", this.skin));
        this.closeBtn = cc.find("close_btn", this.skin);
        this.closeBtn.on("touchend", this.onCloseBtn, this);
    }
    private onCloseBtn():void{
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
    }
}

/**音乐、音效设置按钮 */
class setBtn{
    private btn:cc.Node = null;
    private isOpen:boolean = false;
    private posX:number = 30;

    public init(btn:cc.Node):void{
        this.btn = btn;

        this.btn.on("touchend", this.onBtn, this);
    }

    public setOpen():void{
        let self = this;
        cc.loader.loadRes("imgs/img_open", cc.SpriteFrame, (e, res)=>{
            if(e){
                console.log(e);
                return;
            }
            self.btn.getComponent(cc.Sprite).spriteFrame = res;
            self.isOpen = true;
            self.btn.x = -self.posX;
        });
    }
    public setClose():void{
        let self = this;
        cc.loader.loadRes("imgs/img_close", cc.SpriteFrame, (e, res)=>{
            if(e){
                console.log(e);
                return;
            }
            self.btn.getComponent(cc.Sprite).spriteFrame = res;
            self.isOpen = false;
            self.btn.x = self.posX;
        });
    }

    private onBtn():void{
        if(this.isOpen)
            this.setClose();
        else
            this.setOpen();
    }
}
