import { obs } from "./obsLayer";
import { EventManager, EventType } from "../comms/EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class obsLayerFour extends cc.Component {
    @property([cc.Prefab])
    public pres: Array<cc.Prefab> = [];
    private times: Array<obs> = null;

    private currIndex: number = 1;
    private viewWidth: number = 0;

    private interval: number = 1.3;

    private createMore:boolean = false;

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
    }

    private onZoomTrigger():void{
        console.log("onZoomIn/..//")
        this.createMore = true;
        for(let i = 0; i < 6; i++){
            let posX: number = 400 * this.times[this.currIndex].t + 600;
            this.createObs(cc.v2(posX, this.times[this.currIndex].y))
            this.currIndex++;
        }
        this.scheduleOnce(()=>{
            this.createMore = false;
        }, 5)
    }

    start() {
        this.viewWidth = cc.view.getVisibleSize().width;
    }

    update(dt) {
        dt = 0.0172;
        if (this.times == null) return;
        if (this.currIndex > this.times.length - 1) return;
        this.interval -= dt;
        if (this.interval > 0) return;
        this.interval = 1.3;

        if(this.createMore)return;

        let posX: number = 400 * this.times[this.currIndex].t + 600;

        if (posX - (-this.node.x) < this.viewWidth * 1.7) {//显示障碍物
            this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            this.currIndex++;
        }
    }

    private createObs(pos: cc.Vec2): void {
        let index: number = Math.floor(Math.random() * this.pres.length);
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
        node.setPosition(pos);
    }

    onDestroy():void{
        EventManager.getInstance().removeEventListenerByTag(EventType.zoomTrigger, "obsLayerFour");
    }
}
