import { obs } from "./obsLayer";
import { EventManager, EventType } from "../comms/EventManager";
import { NodePool } from "../comms/NodePool";
import { obsGroup } from "./obsGroup";
import { IGoldAction } from "./IGoldAction";

const { ccclass, property } = cc._decorator;

@ccclass
export class obsLayerFour extends cc.Component {
    @property([cc.Prefab])
    public pres: Array<cc.Prefab> = [];
    @property([cc.Prefab])
    public goldPres: Array<cc.Prefab> = [];
    private times: Array<obs> = null;

    public obsPool: NodePool = null;
    public goldPool: NodePool = null;

    private currIndex: number = 1;
    private viewWidth: number = 0;

    private interval: number = 1.3;
    private isGameOver: boolean = false;

    private createMore: boolean = false;

    onLoad() {
        let self = this;
        cc.loader.loadRes("jsons/bgm_2", cc.JsonAsset, (err, res) => {
            if (err) {
                console.log("obsLayerThree load json bgm_2 fail", err);
                return;
            }
            self.times = res.json.bgm4;
        })

        EventManager.getInstance().addEventListener(EventType.zoomTrigger, this.onZoomTrigger.bind(this), "obsLayerFour");
        EventManager.getInstance().addEventListener(EventType.addObsPool, this.onObsPool.bind(this), "obsLayerTwo");
        EventManager.getInstance().addEventListener(EventType.addGoldPool, this.onGoldPool.bind(this), "obsLayerTwo");
        EventManager.getInstance().addEventListener(EventType.gameOver, this.gameOver.bind(this), "obsLayerTwo");
    }

    private onZoomTrigger(): void {
        this.createMore = true;
        for (let i = 0; i < 6; i++) {
            let posX: number = 400 * this.times[this.currIndex].t + 600;
/*             this.createObs(cc.v2(posX, this.times[this.currIndex].y))
            this.currIndex++; */

            if (this.times[this.currIndex].type == 0)
                this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            else
                this.createGold(cc.v2(posX, this.times[this.currIndex].y));
            this.currIndex++;
        }
        this.scheduleOnce(() => {
            this.createMore = false;
        }, 5)
    }
    private onObsPool(obs): void {
        if (this.isGameOver) return;
        this.obsPool.put(obs);
    }
    private onGoldPool(gold): void {
        if (this.isGameOver) return;
        this.goldPool.put(gold);
    }
    private gameOver(): void {
        this.isGameOver = true;
    }

    start() {
        this.viewWidth = cc.view.getVisibleSize().width;
        this.initPool();
    }
    private initPool(): void {
        this.obsPool = new NodePool();
        this.goldPool = new NodePool();
        this.pres.forEach(e => {
            this.obsPool.put(cc.instantiate(e))
        });
        this.goldPres.forEach(element => {
            this.goldPool.put(cc.instantiate(element));
        });
    }
    update(dt) {
        dt = 0.0167;
        if (this.times == null) return;
        if (this.currIndex > this.times.length - 1) return;
        this.interval -= dt;
        if (this.interval > 0) return;
        this.interval = 1.3;

        if (this.createMore) return;

        let posX: number = 400 * this.times[this.currIndex].t + 600;

        if (posX - (-this.node.x) < this.viewWidth * 1.7) {
            if (this.times[this.currIndex].type == 0)
                this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            else
                this.createGold(cc.v2(posX, this.times[this.currIndex].y));
            this.currIndex++;
        }
    }

    private createObs(pos: cc.Vec2): void {
        let node: cc.Node = null;
        if (this.obsPool.size() <= 0) {
            let index: number = Math.floor(Math.random() * this.pres.length);
            node = cc.instantiate(this.pres[index]);
        } else {
            node = this.obsPool.getRand();
            let obsG: obsGroup = node.getComponent(obsGroup);
            obsG.init();
            obsG.rand();
        }
        this.node.addChild(node);
        pos.y = 375;
        node.setPosition(pos);


        /*         let index: number = Math.floor(Math.random() * this.pres.length);
                let node: cc.Node = cc.instantiate(this.pres[index]);
                this.node.addChild(node);
        
                if (pos.y == 0) {
                    pos.y = 150;
                } else if (pos.y == 1) {
                    pos.y = 480;
                } else {
                    pos.y = 300;
                }
        
                pos.y += node.height * .5;
                node.setPosition(pos); */
    }
    private createGold(pos: cc.Vec2): void {
        let node: cc.Node = null;
        if (this.goldPool.size() <= 0) {
            let index: number = Math.floor(Math.random() * this.goldPres.length);
            node = cc.instantiate(this.goldPres[index]);
        } else {
            node = this.goldPool.getRand();
            node.children.forEach(e => {
                let ac: IGoldAction = e.getComponent(IGoldAction);
                if (ac)
                    ac.show();
            })
        }
        this.node.addChild(node);

        switch (pos.y) {
            case 0:
                pos.y = 100;
                break;
            case 1:
                pos.y = 250;
                break;
            case 2:
                pos.y = 320;
                break;
        }

        node.setPosition(pos);
    }
    onDestroy(): void {
        this.obsPool = null;
        this.goldPool = null;
        EventManager.getInstance().removeEventListenerByTag(EventType.zoomTrigger, "obsLayerFour");
        EventManager.getInstance().removeEventListenerByTag(EventType.addObsPool, "obsLayerTwo");
        EventManager.getInstance().removeEventListenerByTag(EventType.addGoldPool, "obsLayerTwo");
        EventManager.getInstance().removeEventListenerByTag(EventType.gameOver, "obsLayerTwo");
    }
}
