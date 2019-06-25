import { level_3State } from "../ISceneState";
import { UISystem } from "../../systems/UISystem";
import { GameLoop } from "../../GameLoop";
import { LayerRun } from "../01level/bgModule/LayerRun";
import { accountsPanel } from "../../uiSystem/accountsPanel";
import { AudioType, AudioManager } from "../../comms/AudioManager";
import { FlyCtrl } from "./FlyCtrl";
import { EventType, EventManager } from "../../comms/EventManager";
import { goldAction } from "../../other/goldAction";
import { scoreTip } from "../../other/scoreTip";

export class levelThreeExterior {

    private constructor() { this.init(); }

    private static _instance: levelThreeExterior = null;
    public static getInstance(): levelThreeExterior {
        if (this._instance == null)
            this._instance = new levelThreeExterior();
        return this._instance;
    }
    public static endInstance() {
        this._instance = null;
    }

    private lvThreeState: level_3State = null;
    public uiMgr: UISystem = null;
    public pyCtrl: FlyCtrl = null;

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
        AudioManager.getInstance().playBGM(AudioType.BGM_3);

        EventManager.getInstance().addEventListener(EventType.onHide, this.onHide.bind(this), "levelThreeExterior");
        EventManager.getInstance().addEventListener(EventType.onShow, this.onShow.bind(this), "levelThreeExterior");
    }

    private createRole(): void {
        let self = this;
        let node: cc.Node = null;
        if (GameLoop.getInstance().isMan) {
            cc.loader.loadRes("prefabs/manFly", cc.Prefab, (err, res) => {
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(FlyCtrl);
            })
        } else {
            cc.loader.loadRes("prefabs/womanFly", cc.Prefab, (err, res) => {
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(FlyCtrl);
            })
        }
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

    public setLevelThreeState(level3: level_3State): void {
        this.lvThreeState = level3;
    }
    public gotoStartState(): void {
        this.lvThreeState.setStartState();
    }

    public setMainState(): void {
        this.lvThreeState.setMainState();
    }
    public setLevel_2State(): void {
        this.lvThreeState.setLevel_2State();
    }
    public setLevel_3State(): void {
        this.lvThreeState.setLevel_3State();
    }

    public update(): void {
        this.uiMgr.sysUpdate();
    }
    public end(): void {
        this.goldPool.clear();
        this.scoreTipPool.clear();
        EventManager.getInstance().removeEventListenerByTag(EventType.onHide, "levelThreeExterior");
        EventManager.getInstance().removeEventListenerByTag(EventType.onShow, "levelThreeExterior");
        this.uiMgr.sysRelease();
        levelThreeExterior.endInstance();
    }
    public win(): void {
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelThreeExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
        this.uploadScore();
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
            this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelThreeExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
            this.stop();
            this.pyCtrl.isOver = true;
            this.uploadScore();
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

    public uploadScore(K: string = "rank_3", V: string = `${this.score}`): void {
        if (GameLoop.getInstance().platform == null) return;
        GameLoop.getInstance().platform.updateScore(this.score, 2);
        console.log("uploadScore")
        GameLoop.getInstance().platform.setUserCloudStorage(
            [{ key: K, value: V }]
        )
    }
}
