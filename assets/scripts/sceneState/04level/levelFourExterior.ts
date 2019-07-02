import { level_4State } from "../ISceneState";
import { UISystem } from "../../systems/UISystem";
import { FlyCtrl } from "../03level/FlyCtrl";
import { AudioManager, AudioType } from "../../comms/AudioManager";
import { EventManager, EventType } from "../../comms/EventManager";
import { GameLoop } from "../../GameLoop";
import { accountsPanel } from "../../uiSystem/accountsPanel";
import { LayerRun } from "../01level/bgModule/LayerRun";
import { scoreTip } from "../../other/scoreTip";
import { goldAction } from "../../other/goldAction";

export class levelFourExterior {

    private constructor() { this.init(); }

    private static _instance: levelFourExterior = null;
    public static getInstance(): levelFourExterior {
        if (this._instance == null)
            this._instance = new levelFourExterior();
        return this._instance;
    }
    public static endInstance() {
        this._instance = null;
    }

    private lvFourState: level_4State = null;
    public uiMgr: UISystem = null;
    public pyCtrl: FlyCtrl = null;

    private heartNum: number = 3;
    private score: number = 0;

    //UI Element
    private heart: cc.Node = null;
    private scoreLa: cc.Label = null;
    private heartLess: cc.Node = null;

    private isGamePause: boolean = false;

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
        AudioManager.getInstance().playBGM(AudioType.BGM_4);

        EventManager.getInstance().addEventListener(EventType.zoomTrigger, this.onZoomTrigger.bind(this), "levelFourExterior");
        EventManager.getInstance().addEventListener(EventType.onHide, this.onHide.bind(this), "levelFourExterior");
        EventManager.getInstance().addEventListener(EventType.onShow, this.onShow.bind(this), "levelFourExterior");
    }


    private createRole(): void {
        let self = this;
        let node: cc.Node = null;
        let isMan: boolean = GameLoop.getInstance().isMan;
        let playerLayer: cc.Node = cc.find("Canvas/run_layer/player_layer");
        /*         if (GameLoop.getInstance().isMan) { */
        cc.loader.loadRes(`prefabs/${isMan ? "manFly" : "womanFly"}`, cc.Prefab, (err, res) => {
            if (err) {
                console.log("levelThreeExterior load role fail", err);
                return;
            }
            node = cc.instantiate(res);
            if (playerLayer == null) {
                console.log("levelThreeExterior cc.find:playerLayer fail");
                return;
            }
            playerLayer.addChild(node);
            self.pyCtrl = node.getComponent(FlyCtrl);
        })
    }

    //#region 监听事件

    private onZoomTrigger(prams: any) {
        this.zoomIn();
    }
    private onHide(): void {
        this.isGamePause = true;
        this.stop();
    }
    private onShow(): void {
        this.isGamePause = false;
        this.continue();
    }

    //#endregion

    public setLevelFourState(level4: level_4State): void {
        this.lvFourState = level4;
    }
    public gotoStartState(): void {
        this.lvFourState.setStartState();
    }

    public setMainState(): void {
        this.lvFourState.setMainState();
    }
    public setLevel_2State(): void {
        this.lvFourState.setLevel_2State();
    }
    public setLevel_3State(): void {
        this.lvFourState.setLevel_3State();
    }
    public setLevel_4State(): void {
        this.lvFourState.setLevel_4State();
    }
    public update(): void {
        this.uiMgr.sysUpdate();
    }
    public end(): void {
        this.goldPool.clear();
        this.scoreTipPool.clear();
        EventManager.getInstance().removeEventListenerByTag(EventType.onHide, "levelFourExterior");
        EventManager.getInstance().removeEventListenerByTag(EventType.onShow, "levelFourExterior");
        this.uiMgr.sysRelease();
        levelFourExterior.endInstance();
    }
    public win(): void {
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelFourExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
        this.uploadScore();
    }
    public zoomIn(): void {
        cc.find("Canvas/run_layer").runAction(cc.sequence(
            cc.scaleBy(3, .4, .4),
            cc.delayTime(5),
            cc.scaleTo(3, 1, 1)
        ))
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
            this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelFourExterior.getInstance(), this.score, this.heartNum == 0 ? false : true]);
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

    public uploadScore(K: string = "rank_4", V: string = `${this.score}`): void {
        if (GameLoop.getInstance().platform == null) return;
        GameLoop.getInstance().platform.updateScore(this.score, 3);
        console.log("uploadScore")
        //if (GameLoop.getInstance().currIndex == 3) return;
        GameLoop.getInstance().platform.setUserCloudStorage(
            [{ key: K, value: V }]
        )
    }
}
