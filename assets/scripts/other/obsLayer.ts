import { EventManager, EventType } from "../comms/EventManager";
import { NodePool } from "../comms/NodePool";
import { IGoldAction } from "./IGoldAction";

export interface obs {
    t: number,
    y: number,
    type: number
}

const { ccclass, property } = cc._decorator;

@ccclass
export class obsLayer extends cc.Component {

    @property([cc.Prefab])
    public pres: Array<cc.Prefab> = [];             //障碍物预制
    @property([cc.Prefab])
    public goldPres: Array<cc.Prefab> = [];          //金币预制
    @property([cc.Prefab])
    public LastPres:Array<cc.Prefab> = [];          //后面出现的障碍

    public obsPool: NodePool = null;             //障碍物对象池
    public goldPool: NodePool = null;            //金币对象池

    private times: Array<obs> = null;

    private currIndex: number = 1;
    private viewWidth: number = 0;

    private interval: number = 1.3;

    private wait: boolean = true;
    private isClear:boolean = false;
    private isGameOver:boolean = false;
    onLoad() {
        let self = this;
        cc.loader.loadRes("jsons/bgm_1", cc.JsonAsset, (err, res) => {
            if(err){
                console.log("obsLayer load json bgm_1 fail", err);
                return;
            }
            self.times = res.json.bgm1;
        })

        EventManager.getInstance().addEventListener(EventType.zoomIn, this.onZoomIn.bind(this), "obsLayer");
        EventManager.getInstance().addEventListener(EventType.addObsPool, this.onObsPool.bind(this), "obsLayer");
        EventManager.getInstance().addEventListener(EventType.addGoldPool, this.onGoldPool.bind(this), "obsLayer");
        EventManager.getInstance().addEventListener(EventType.gameOver, this.gameOver.bind(this), "obsLayer");
    }

    private onZoomIn(): void {
        this.scheduleOnce(() => {
            this.wait = false;
        }, 1.5)
    }
    private onObsPool(obs): void {
        if(this.isClear){
            obs.destroy();
            return;
        }
        if(this.isGameOver)return;
        this.obsPool.put(obs);
    }
    private onGoldPool(gold): void {
        if(this.isGameOver)return;
        this.goldPool.put(gold);
    }
    private gameOver():void{
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
        this.goldPres.forEach(e => {
            this.goldPool.put(cc.instantiate(e))
        });
    }

    update(dt) {
        if (this.isGameOver) return;
        dt = 0.0167;
        if (this.times == null) return;
        if (this.currIndex > this.times.length - 1) return;
        this.interval -= dt;
        if (this.interval > 0) return;
        this.interval = 1.3;
        let posX: number = 0;

        if (this.times[this.currIndex].t < 54) {
            posX = 400 * this.times[this.currIndex].t + 350;
        } else {
            if (this.wait) return;
            posX = 400 * 54 + ((this.times[this.currIndex].t - 54) * 200) + 350
        }

        if (posX - (-this.node.x) < this.viewWidth * 1.7) {//显示障碍物
            if (this.times[this.currIndex].type == 0)
                this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            else {
                //创建金币
                this.createGold(cc.v2(posX, this.times[this.currIndex].y));
            }
            this.currIndex++;
        }
    }

    private createObs(pos: cc.Vec2): void {
        let node: cc.Node = null;
        if(this.times[this.currIndex].t < 54){
            if (this.obsPool.size() <= 0) {
                let index: number = Math.floor(Math.random() * this.pres.length);
                node = cc.instantiate(this.pres[index]);
            } else {
                node = this.obsPool.getRand();
            }
        }else{
            if(!this.isClear){
                this.obsPool.clear();
                this.isClear = true;
            }
            if (this.obsPool.size() <= 0) {
                let index: number = Math.floor(Math.random() * this.LastPres.length);
                node = cc.instantiate(this.LastPres[index]);
            } else {
                node = this.obsPool.getRand();
            }
        }


        this.node.addChild(node);
        if (pos.y == 0) {
            pos.y = 60;
        } else if (pos.y == 1) {
            pos.y = 188;
        } else if (pos.y == 2) {
            pos.y = 170;
        }
        if (this.times[this.currIndex].t > 54) {
            node.scale = .7;
            pos.y += node.height * .5 * node.scale;
        } else {
            pos.y += node.height * .5;
        }
        node.setPosition(pos);
    }
    private createGold(pos: cc.Vec2): void {
        let node: cc.Node = null;
        if (this.goldPool.size() <= 0) {
            let index: number = Math.floor(Math.random() * this.goldPres.length);
            node = cc.instantiate(this.goldPres[index]);
        } else {
            node = this.goldPool.getRand();
            node.children.forEach(e=>{
                let ac:IGoldAction = e.getComponent(IGoldAction);
                if(ac)
                    ac.show();
            })
        }
        this.node.addChild(node);

        switch (pos.y) {
            case 0:
                pos.y = 60;
                break;
            case 1:
                pos.y = 210;
                break;
            case 2:
                pos.y = 300;
                break;
        }
        node.setPosition(pos);
    }

    onDestroy(): void {
        EventManager.getInstance().removeEventListenerByTag(EventType.zoomIn, "obsLayer");
        EventManager.getInstance().removeEventListenerByTag(EventType.addObsPool, "obsLayer");
        EventManager.getInstance().removeEventListenerByTag(EventType.addGoldPool, "obsLayer");
        EventManager.getInstance().removeEventListenerByTag(EventType.gameOver, "obsLayer");
    }
}
