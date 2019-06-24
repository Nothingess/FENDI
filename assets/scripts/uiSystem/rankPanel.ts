import { IUIBase, PanelLayer } from "./IUIBase";
import { strateA } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { GameLoop } from "../GameLoop";

export class rankPanel extends IUIBase {

    private lv1:cc.Node = null;
    private lv2:cc.Node = null;
    private lv3:cc.Node = null;
    private currSelect:cc.Node = null;

    private closeBtn: cc.Node = null;
    private wxSubContextView: cc.WXSubContextView = null;

    private switchTimer:number = 1;
    private isChanging:boolean = false;

    public initStrategy(): void {
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?: any[]): void {
        super.init(Params);
        this.skinPath = "rankPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed(): void {
        this.initComponent();
    }
    public initComponent(): void {
        this.lv1 = cc.find("context/lv1", this.skin);
        this.lv2 = cc.find("context/lv2", this.skin);
        this.lv3 = cc.find("context/lv3", this.skin);

        this.closeBtn = cc.find("close_btn", this.skin);
        this.wxSubContextView = cc.find("context", this.skin).getComponent(cc.WXSubContextView);
        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.lv1.on("touchend", this.onLv1, this);
        this.lv2.on("touchend", this.onLv2, this);
        this.lv3.on("touchend", this.onLv3, this);
        this.currSelect = this.lv1;

        if (GameLoop.getInstance().platform != null){
            this.wxSubContextView.enabled = true;
            GameLoop.getInstance().platform.postMessageToOpenDataContext({ k: "update" });
        }

    }
    private onCloseBtn(): void {
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onLv1():void{
        if(this.lv1 == this.currSelect)return;
        this.onSelect(this.lv1, "s_1");
    }
    private onLv2():void{
        if(this.lv2 == this.currSelect)return;
        this.onSelect(this.lv2, "s_2");
    }
    private onLv3():void{
        if(this.lv3 == this.currSelect)return;
        this.onSelect(this.lv3, "s_3");

    }

    private onSelect(node:cc.Node, key:string):void{
        if(this.isChanging)return;
        this.isChanging = true;
        this.scheduleOnce(()=>{
            this.isChanging = false;
        }, this.switchTimer)

        let oldSp:cc.Sprite = this.currSelect.getComponent(cc.Sprite);
        let newSp:cc.Sprite = node.getComponent(cc.Sprite);
        let oldSf:cc.SpriteFrame = oldSp.spriteFrame;
        oldSp.spriteFrame = newSp.spriteFrame;
        newSp.spriteFrame = oldSf;

        node.children[0].color = cc.Color.WHITE;
        this.currSelect.children[0].color = new cc.Color(83, 110, 95);

        this.currSelect = node;

        GameLoop.getInstance().platform.postMessageToOpenDataContext({k:key});
    }

    onDestroy(): void {
        this.closeBtn.off("touchend", this.onCloseBtn, this);
    }

}
