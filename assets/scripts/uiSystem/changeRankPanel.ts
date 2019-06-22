import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { GameLoop } from "../GameLoop";
import { strateA } from "./openAction/IOpenStrategy";


export class changeRankPanel extends IUIBase {

    private closeBtn: cc.Node = null;
    private wxSubContextView: cc.WXSubContextView = null;

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
        this.wxSubContextView = cc.find("rankPanel/context", this.skin).getComponent(cc.WXSubContextView);

        this.closeBtn.on("touchend", this.onCloseBtn, this);
        if (GameLoop.getInstance().platform != null){
            this.wxSubContextView.enabled = true;
            GameLoop.getInstance().platform.postMessageToOpenDataContext({ k: "s_33" });
        }
    }

    private onCloseBtn(): void {
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }

    onDestroy(): void {
        this.closeBtn.off("touchend", this.onCloseBtn, this);
    }
}
