import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { GameLoop } from "../GameLoop";
import { strateA } from "./openAction/IOpenStrategy";


export class changeRankPanel extends IUIBase {

    private closeBtn: cc.Node = null;
    private leftBtn:cc.Node = null;
    private rightBtn:cc.Node = null;
    //private wxSubContextView: cc.WXSubContextView = null;

    private itemNodes:Array<cc.Node> = null;                //排行榜 item 列表
    private rankList:Array<string> = null;

    public initStrategy(): void {
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?: any[]): void {
        super.init(Params);
        this.skinPath = "changeRankPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed(): void {
        this.initComponent();
    }

    public initComponent(): void {
        this.closeBtn = cc.find("close_btn", this.skin);
        this.leftBtn = cc.find("btn_left", this.skin);
        this.rightBtn = cc.find("btn_right", this.skin);
        //this.wxSubContextView = cc.find("rankPanel/context", this.skin).getComponent(cc.WXSubContextView);

        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.leftBtn.on("touchend", this.onLeftBtn, this);
        this.rightBtn.on("touchend", this.onRightBtn, this);
        this.btnAction();
/*         if (GameLoop.getInstance().platform != null){
            this.wxSubContextView.enabled = true;
            GameLoop.getInstance().platform.postMessageToOpenDataContext({ k: "s_33" });
        } */
    }

    private btnAction():void{
        this.leftBtn.runAction(cc.spawn(cc.moveBy(.3, cc.v2(-100, 0)).easing(cc.easeBackOut()), cc.fadeIn(.3)));
        this.rightBtn.runAction(cc.spawn(cc.moveBy(.3, cc.v2(100, 0)).easing(cc.easeBackOut()), cc.fadeIn(.3)));
    }


    private onCloseBtn(): void {
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onLeftBtn():void{

    }
    private onRightBtn():void{

    }

    onDestroy(): void {
        this.closeBtn.off("touchend", this.onCloseBtn, this);
    }
}
