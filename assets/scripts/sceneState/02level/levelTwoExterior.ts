import { level_2State } from "../ISceneState";
import { UISystem } from "../../systems/UISystem";
import { accountsPanel } from "../../uiSystem/accountsPanel";
import { playerCtrl } from "../01level/player/playerCtrl";
import { GameLoop } from "../../GameLoop";
import { LayerRun } from "../01level/bgModule/LayerRun";
import { AudioManager, AudioType } from "../../comms/AudioManager";
import { EventManager, EventType } from "../../comms/EventManager";
import { goldAction } from "../../other/goldAction";
import { scoreTip } from "../../other/scoreTip";

export class levelTwoExterior {

    private constructor() { this.init(); }

    private static _instance: levelTwoExterior = null;
    public static getInstance(): levelTwoExterior {
        if (this._instance == null)
            this._instance = new levelTwoExterior();
        return this._instance;
    }
    public static endInstance() {
        this._instance = null;
    }

    private lvTwoState: level_2State = null;
    public uiMgr: UISystem = null;
    public pyCtrl: playerCtrl = null;

    private heartNum: number = 3;
    private score: number = 0;

    //UI Element
    private heart: cc.Node = null;
    private scoreLa: cc.Label = null;
    private heartLess: cc.Node = null;

    private isGamePause: boolean = false;

    private obsType: Array<number> = new Array<number>();

    private scoreTipPool: cc.NodePool = null;
    private preScoreTip: cc.Prefab = null;
    private goldPool: cc.NodePool = null;
    private preGold: cc.Prefab = null;
    private init(): void {
        this.initComponent();
    }
    private initComponent(): void {
        this.uiMgr = new UISystem();
        this.uiMgr.sysInit();

        this.createRole();
        this.heart = cc.find("Canvas/UILayer/uiElement/heart");
        this.scoreLa = cc.find("Canvas/UILayer/uiElement/score").getComponent(cc.Label);
        this.heartLess = cc.find("Canvas/run_layer/player_layer/heart_less");

        this.scoreTipPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/glods/scoreTip", cc.Prefab, (err, res) => {
            this.preScoreTip = res;
            this.scoreTipPool.put(cc.instantiate(res));
            this.scoreTipPool.put(cc.instantiate(res));
        })
        this.goldPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/glods/goldPre", cc.Prefab, (err, res) => {
            this.preGold = res;
            this.goldPool.put(cc.instantiate(res));
            this.goldPool.put(cc.instantiate(res));
        })
        AudioManager.getInstance().playBGM(AudioType.BGM_2);

        EventManager.getInstance().addEventListener(EventType.onHide, this.onHide.bind(this), "levelTwoExterior");
        EventManager.getInstance().addEventListener(EventType.onShow, this.onShow.bind(this), "levelTwoExterior");
    }

    private createRole(): void {
        let self = this;
        let node: cc.Node = null;
        let isMan: boolean = GameLoop.getInstance().isMan;
        let playerLayer: cc.Node = cc.find("Canvas/run_layer/player_layer");
        /*         if (GameLoop.getInstance().isMan) { */
        cc.loader.loadRes(`prefabs/${isMan ? "manRole" : "womanRole"}`, cc.Prefab, (err, res) => {
            if (err) {
                console.log("levelTwoExterior load role fail", err);
                return;
            }
            node = cc.instantiate(res);
            if (playerLayer == null) {
                console.log("levelTwoExterior cc.find:playerLayer fail");
                return;
            }
            playerLayer.insertChild(node, 0);
            self.pyCtrl = node.getComponent(playerCtrl);
            self.pyCtrl.state = 1;
        })
        /*         } else {
                    cc.loader.loadRes("prefabs/womanRole", cc.Prefab, (err, res) => {
                        node = cc.instantiate(res);
                        cc.find("Canvas/run_layer/player_layer").insertChild(node, 0);
                        self.pyCtrl = node.getComponent(playerCtrl);
                        self.pyCtrl.state = 1;
                    })
                } */
    }

    //#region 监听事件


    private onHide(): void {
        this.isGamePause = true;
        this.stop();
    }
    private onShow(): void {
        this.isGamePause = false;
        this.continue();
    }

    //#endregion

    public setLevelTwoState(level2: level_2State): void {
        this.lvTwoState = level2;
    }
    public gotoStartState(): void {
        this.lvTwoState.setStartState();
    }

    public setMainState(): void {
        this.lvTwoState.setMainState();
    }
    public setLevel_2State(): void {
        this.lvTwoState.setLevel_2State();
    }
    public setLevel_3State(): void {
        this.lvTwoState.setLevel_3State();
    }
    public setLevel_4State(): void {
        this.lvTwoState.setLevel_4State();
    }
    public update(): void {
        this.uiMgr.sysUpdate();
    }
    public end(): void {
        this.goldPool.clear();
        this.scoreTipPool.clear();
        this.uiMgr.sysRelease();
        levelTwoExterior.endInstance();
    }
    /**取消监听前后台事件 */
    private offEventSys(): void {
        EventManager.getInstance().removeEventListenerByTag(EventType.onHide, "levelTwoExterior");
        EventManager.getInstance().removeEventListenerByTag(EventType.onShow, "levelTwoExterior");
    }
    public win(): void {
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelTwoExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
        this.uploadScore();

        this.offEventSys();
        EventManager.getInstance().dispatchEvent(EventType.gameOver);
    }

    public stop(): void {
        let childs: Array<cc.Node> = cc.find("Canvas/run_layer").children;

        childs.forEach(e => {
            let layerrun: LayerRun = e.getComponent(LayerRun);
            if (layerrun != null) {
                layerrun.stop = true;
            }
        })
    }
    public continue(): void {
        let childs: Array<cc.Node> = cc.find("Canvas/run_layer").children;

        childs.forEach(e => {
            let layerrun: LayerRun = e.getComponent(LayerRun);
            if (layerrun != null) {
                layerrun.stop = false;
            }
        })
    }

    public addScore(val: number, pos: cc.Vec2, ty: number): void {
        this.score += val;
        this.updateScore();
        this.showAddScore(val, pos);
        this.getGlodAction(ty, pos);
    }
    private updateScore(): void {
        this.scoreLa.string = `Score : ${this.score}`;
    }
    private showAddScore(val: number, pos: cc.Vec2): void {
        let node: cc.Node = null;
        if (this.scoreTipPool.size() > 0)
            node = this.scoreTipPool.get();
        else
            node = cc.instantiate(this.preScoreTip);

        if (node.parent == null)
            cc.director.getScene().addChild(node);

        node.getComponent(scoreTip).setSp(val);
        node.setPosition(pos);
        node.runAction(cc.sequence(
            cc.moveBy(.5, cc.v2(0, 100)),
            cc.callFunc(() => {
                this.scoreTipPool.put(node);
            })
        ))
    }
    private getGlodAction(ty: number, pos: cc.Vec2): void {
        if (ty > 2) return;
        let node: cc.Node = null;
        if (this.goldPool.size() > 0)
            node = this.goldPool.get();
        else
            node = cc.instantiate(this.preGold);

        if (node.parent == null)
            cc.director.getScene().addChild(node);

        let action: goldAction = node.getComponent(goldAction);
        action.setGoldId(ty);
        node.setPosition(pos);
        node.runAction(cc.sequence(
            cc.moveTo(.5, this.scoreLa.node.convertToWorldSpaceAR(cc.v2(0, 0))).easing(cc.easeIn(1)),
            cc.callFunc(() => {
                this.goldPool.put(node);
            })
        ))
    }
    public minusHeart(vec: cc.Vec2): void {
        this.heartNum--;
        //this.heartNum = 2;
        this.floatHeartLess(vec);
        if (this.heartNum >= 0) {
            this.heart.children[this.heartNum].color = cc.Color.GRAY;
        }
        if (this.heartNum == 0) {
            AudioManager.getInstance().playSound(AudioType.LOST);
            this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelTwoExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
            this.stop();
            this.pyCtrl.stop();
            this.uploadScore();
            this.offEventSys();
            EventManager.getInstance().dispatchEvent(EventType.gameOver);
        }
    }
    /**飘动减血图标 */
    public floatHeartLess(vec: cc.Vec2): void {
        this.heartLess.setPosition(vec);
        this.heartLess.opacity = 0;
        this.heartLess.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveBy(.5, cc.v2(0, 100)),
                    cc.fadeIn(.5)
                ),
                cc.fadeOut(.5)
            )
        )
    }

    public triggerObs(node: cc.Node, tag: number): void {
        if (this.obsType.indexOf(tag) >= 0) return;
        this.obsType.push(tag);
        if (tag > 11) {
            this.showObsTip(node, 1);
        } else {
            this.showObsTip(node, 0);
        }
    }
    /**显示障碍物的提示
     * ty: 障碍物的动作类型 0-下蹲 1-跳
     */
    public showObsTip(node: cc.Node, ty: number): void {
        cc.loader.loadRes(`prefabs/other/${ty == 0 ? "dd" : "jj"}`, cc.Prefab, (err, res) => {
            if (err) {
                console.log("levelTwoExterior load dd or jj fail", err);
                return;
            }
            let child: cc.Node = cc.instantiate(res);
            node.addChild(child);
            child.setPosition(cc.v2(0, node.height * .5));
            child.scale = 0;
            child.runAction(cc.sequence(cc.delayTime(.5), cc.scaleTo(.3, 1).easing(cc.easeBackInOut()),
                cc.delayTime(2),
                cc.scaleTo(.3, 0).easing(cc.easeBackInOut()),
                cc.callFunc(() => {
                    child.destroy();
                })));
        })
        cc.loader.loadRes(`prefabs/other/${ty == 0 ? "guide_line_1" : "guide_line_2"}`, cc.Prefab, (err, res) => {
            if (err) {
                console.log("levelTwoExterior load guide_line_1 or guide_line_2 fail", err);
                return;
            }
            let child: cc.Node = cc.instantiate(res);
            node.addChild(child);
            child.setPosition(cc.v2(0, 0));
            child.runAction(
                cc.sequence(
                    cc.blink(.5, 3),
                    cc.delayTime(2),
                    cc.fadeOut(.5),
                    cc.callFunc(() => {
                        child.destroy();
                    })
                )
            )
        })
    }

    public uploadScore(K: string = "rank_2", V: string = `${this.score}`): void {
        if (GameLoop.getInstance().platform == null) return;
        GameLoop.getInstance().platform.updateScore(this.score, 1);
        console.log("uploadScore")
        GameLoop.getInstance().platform.setUserCloudStorage(
            [{ key: K, value: V }]
        )
    }
}
