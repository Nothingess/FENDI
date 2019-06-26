import { obs } from "./obsLayer";
import { EventManager, EventType } from "../comms/EventManager";
import { NodePool } from "../comms/NodePool";
import { IGoldAction } from "./IGoldAction";

const {ccclass, property} = cc._decorator;

@ccclass
export class obsLayerTwo extends cc.Component {
    @property([cc.Prefab])
    public pres: Array<cc.Prefab> = [];             //障碍物预制
    @property([cc.Prefab])
    public goldPres: Array<cc.Prefab> = [];          //金币预制
    private times:Array<obs> = null;

    public obsPool: NodePool = null;             //障碍物对象池
    public goldPool: NodePool = null;            //金币对象池

    private currIndex:number = 1;
    private viewWidth:number = 0;

    private interval:number = 1;
    private isGameOver:boolean = false;
    onLoad () {
        let self = this;
        cc.loader.loadRes("jsons/bgm_2", cc.JsonAsset, (err, res)=>{
            if(err){
                console.log("obsLayerTwo load json bgm_2 fail", err);
                return;
            }
            self.times = res.json.bgm2;
        })

        EventManager.getInstance().addEventListener(EventType.addObsPool, this.onObsPool.bind(this), "obsLayerTwo");
        EventManager.getInstance().addEventListener(EventType.addGoldPool, this.onGoldPool.bind(this), "obsLayerTwo");
        EventManager.getInstance().addEventListener(EventType.gameOver, this.gameOver.bind(this), "obsLayerTwo");
    }

    private onObsPool(obs): void {
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
    start () {
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
    update (dt) {
        dt = 0.0172;
        if(this.times == null)return;
        if(this.currIndex > this.times.length - 1)return;
        this.interval -= dt;
        if(this.interval > 0)return;
        this.interval = 1;


        let posX:number = 400 * this.times[this.currIndex].t + 600;

        if(posX - (-this.node.x) < this.viewWidth * 1.7){//显示障碍物
            if (this.times[this.currIndex].type == 0)
                this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            else {
                //创建金币
                this.createGold(cc.v2(posX, this.times[this.currIndex].y));
            }
            this.currIndex++;
        }
    }

    private createObs(pos:cc.Vec2):void{

        let node: cc.Node = null;
        if (this.obsPool.size() <= 0) {
            let index: number = Math.floor(Math.random() * this.pres.length);
            node = cc.instantiate(this.pres[index]);
        } else {
            node = this.obsPool.getRand();
            node.children.forEach(e=>{
                let ac:IGoldAction = e.getComponent(IGoldAction);
                if(ac)
                    ac.show();
            })
        }
        this.node.addChild(node);

        if(pos.y == 0){
            pos.y = 60;
        }else if(pos.y == 1){
            pos.y = 188;
        }else if(pos.y == 2){
            pos.y = 170;
        }

        pos.y += node.height * .5;
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
                pos.y = 100;
                break;
            case 2:
                pos.y = 140;
                break;
        }

        node.setPosition(pos);
    }

    onDestroy(): void {
        this.obsPool.clear();
        this.goldPool.clear();
        EventManager.getInstance().removeEventListenerByTag(EventType.addObsPool, "obsLayerTwo");
        EventManager.getInstance().removeEventListenerByTag(EventType.addGoldPool, "obsLayerTwo");
        EventManager.getInstance().removeEventListenerByTag(EventType.gameOver, "obsLayerTwo");
    }
}
