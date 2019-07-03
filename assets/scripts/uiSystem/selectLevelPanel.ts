import { IUIBase, PanelLayer } from "./IUIBase";
import { strateC } from "./openAction/IOpenStrategy";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { selectPanel } from "./selectPanel";
import { GameLoop } from "../GameLoop";

const { ccclass, property } = cc._decorator;

@ccclass
export class selectLevelPanel extends IUIBase {

    private viewSpaceX: number = 0;          //选择视图item间隙
    private currIndex: number = 0;           //当前选择的关卡索引

    private backBtn: cc.Node = null;
    private enterBtn: cc.Node = null;
    private contextView: cc.Node = null;
    private contextViewLayOut: cc.Layout = null;
    private title: cc.Node = null;

    private itemList: Array<cc.Node> = null;

    //计时器
    private timer: Function = null;

    private itemCopy: cc.Node = null;
    private isAlreadyLock: boolean = false;

    public initStrategy(): void {
        this.mOpenStrategy = new strateC(this.skin);
    }
    public init(Params?: any[]): void {
        super.init(Params);
        this.skinPath = "selectLevelPanel";
        this.layer = PanelLayer.funcPanel;

    }
    public onShowing():void{
        super.onShowing();
        this.initComponent();
    }
    public initComponent(): void {
        this.backBtn = cc.find("btn_back", this.skin);
        this.enterBtn = cc.find("btn_enter", this.skin);
        this.contextView = cc.find("contextView", this.skin);
        this.contextViewLayOut = this.contextView.getComponent(cc.Layout);
        this.title = cc.find("txt_tip", this.skin);
        this.itemCopy = cc.find("item copy", this.skin);

        this.itemList = this.contextView.children;

        this.openAction();
        this.onBtnEvent();
    }

    private openAction(): void {
        let self = this;
        this.timer = function () {
            if (self.contextViewLayOut.spacingX <= 50) {
                self.contextViewLayOut.spacingX = 50;
                self.initIsLock();
                self.unschedule(self.timer);
                self.timer = null;
            }
            self.contextViewLayOut.spacingX -= 10;
        }
        this.schedule(this.timer, 0.016);
        this.contextView.runAction(this.action(.3, cc.v2(0, -20)));
        this.title.runAction(this.action(.3, cc.v2(0, 240)));
        this.backBtn.runAction(this.action(.3, cc.v2(-560, 300)));
        this.enterBtn.runAction(this.action(.3, cc.v2(0, -240)));

        if (GameLoop.getInstance().isUnLock) {
            this.lock();
            this.itemCopy.destroy();
        }
    }

    private initIsLock():void{
        if (!GameLoop.getInstance().isUnLock) {
            this.itemList[3].runAction(cc.sequence(
                cc.delayTime(.4),
                cc.callFunc(() => {
                    let pos: cc.Vec2 = this.itemList[3].position.clone().add(this.contextView.position);
                    this.itemCopy.opacity = 255;
                    this.itemCopy.position = pos;
                    this.itemList[3].opacity = 0;

                    let action = cc.repeatForever(
                        cc.sequence(
                            cc.rotateBy(0.03, 5),
                            cc.rotateBy(0.06, -10),
                            cc.rotateBy(0.06, 10),
                            cc.rotateBy(0.06, -10),
                            cc.rotateBy(0.06, 10),
                            cc.rotateBy(0.06, -10),
                            cc.rotateBy(0.06, 10),
                            cc.rotateBy(0.06, -10),
                            cc.rotateBy(0.03, 5),
                            cc.delayTime(2)
                        )
                    )
                    this.itemCopy.runAction(action);
                    this.itemCopy.on("touchend", this.onMystic, this);
                })
            ))
        }
    }

    private onMystic(): void {

        /*         this.itemCopy.opacity = 255;
                this.itemCopy.scale = .7; */
        if (this.isAlreadyLock) return;
        this.isAlreadyLock = true;
        AudioManager.getInstance().playSound(AudioType.UNLOCK);

        this.itemCopy.stopAllActions();
        this.itemCopy.rotation = 0;

        let rotate: cc.ActionInterval = cc.sequence(
            cc.scaleTo(.08, 0, .7),
            cc.callFunc(() => {
                this.itemCopy.getChildByName("frame").opacity = 255;
            }),
            cc.scaleTo(.08, .7, .7),
            cc.scaleTo(.08, 0, .7),
            cc.callFunc(() => {
                this.itemCopy.getChildByName("frame").opacity = 0;
            }),
            cc.scaleTo(.08, .7, .7),
        )

        this.itemCopy.runAction(cc.sequence(
            rotate.clone(),
            rotate.clone(),
            rotate.clone(),
            cc.callFunc(() => {
                this.lock();
            }),
            cc.spawn(
                cc.scaleTo(.3, 1),
                cc.fadeOut(.3)
            ),
            cc.callFunc(() => {
                this.itemCopy.destroy();
            })
        ))
    }
    private lock(): void {
        this.itemList[3].opacity = 255;
        this.itemList[3].getChildByName("s_t").destroy();
        this.itemList[3].getChildByName("date").destroy();
        this.itemList[3].getChildByName("wenhao").destroy();
        this.itemList[3].getChildByName("s_e").opacity = 255;
        this.itemList[3].getChildByName("showImg").opacity = 255;
        this.itemList[3].getChildByName("s_icon_hua").opacity = 255;

        this.itemList[3].on("touchend", () => {
            if (this.currIndex == 3) return;
            this.onSelectLevel(3);
            this.currIndex = 3;
            //this.selectAction();
        }, this)
        //GameLoop.getInstance().isUnLock = true;
        this.isAlreadyLock = false;
        GameLoop.getInstance().unLock();
    }
    private action(dur: number, pos: cc.Vec2): cc.FiniteTimeAction {
        return cc.spawn(
            cc.moveTo(dur, pos).easing(cc.easeBackOut()),
            cc.fadeIn(dur)
        )
    }
    /*     private selectAction():void{
            cc.loader.loadRes(`imgs/s_t${this.currIndex + 1}`, cc.SpriteFrame, (err, res)=>{
                this.title.getComponent(cc.Sprite).spriteFrame = res;
            })
            this.title.x = 150;
            this.title.opacity = 0;
            this.title.runAction(this.action(.3, cc.v2(0, 180)))
        } */
    /**注册事件 */
    private onBtnEvent(): void {
        this.backBtn.on("touchend", this.onBackBtn, this);
        this.enterBtn.on("touchend", this.onEnterBtn, this);

        for (let i = 0; i < this.itemList.length; i++) {
            //if(i == 3)break;
            if (i == 3) {
                if (!GameLoop.getInstance().isUnLock) return;
                this.itemCopy.destroy();
            }


            this.itemList[i].on("touchend", () => {
                if (this.currIndex == i) return;
                this.onSelectLevel(i);
                this.currIndex = i;
                //this.selectAction();
            }, this)
        }
    }

    //#region 注册事件

    private onBackBtn(): void {
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onEnterBtn(): void {
        AudioManager.getInstance().playSound(AudioType.CLICK);
        if(this.isAlreadyLock)return;
        startExterior.getInstance().currIndex = this.currIndex;

        startExterior.getInstance().uiSys.openPanel(selectPanel, "selectPanel");
        this.onBackBtn();
    }
    private onSelectLevel(num: number): void {
        AudioManager.getInstance().playSound(AudioType.CLICK);
        this.itemList[this.currIndex].getChildByName("mask").runAction(cc.fadeIn(.3));
        this.itemList[num].getChildByName("mask").runAction(cc.fadeOut(.3));
    }

    //#endregion

    onDestroy(): void {
        this.backBtn.off("touchend", this.onBackBtn, this);
        this.enterBtn.off("touchend", this.onEnterBtn, this);
    }
}
