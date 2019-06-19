import { EventManager, EventType } from "../comms/EventManager";

export interface obs{
    t:number,
    y:number
}

const {ccclass, property} = cc._decorator;

@ccclass
export class obsLayer extends cc.Component {

    @property([cc.Prefab])
    public pres:Array<cc.Prefab> = [];

    private times:Array<obs> = null;

    private currIndex:number = 1;
    private viewWidth:number = 0;

    private interval:number = 1;

    private wait:boolean = true;

    onLoad () {
        cc.loader.loadRes("jsons/bgm_1", cc.JsonAsset, (err, res)=>{
            this.times = res.json.bgm1;
        })

        EventManager.getInstance().addEventListener(EventType.zoomIn, this.onZoomIn.bind(this), "obsLayer");
    }

    private onZoomIn():void{
        this.scheduleOnce(()=>{
            this.wait = false;
        }, 1.5)
    }

    start () {
        this.viewWidth = cc.view.getVisibleSize().width;
    }

    update (dt) {
        if(this.times == null)return;
        if(this.currIndex > this.times.length - 1)return;
        this.interval -= dt;
        if(this.interval > 0)return;
        this.interval = 1;

        let posX:number = 0;

        if(this.times[this.currIndex].t < 54){
            posX = 400 * this.times[this.currIndex].t + 350;
        }else{
            if(this.wait)return;
            posX = 400 * 54 + ((this.times[this.currIndex].t - 54) * 200) + 350
        }

        if(posX - (-this.node.x) < this.viewWidth * 1.5){//显示障碍物
            this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            this.currIndex++;
        }
    }

    private createObs(pos:cc.Vec2):void{
        let index:number = this.times[this.currIndex].t > 54?2 + Math.floor(Math.random() * 2):Math.floor(Math.random() * this.pres.length);
        let node:cc.Node = cc.instantiate(this.pres[index]);
        this.node.addChild(node);
        if(pos.y == 0){
            pos.y = 60;
        }else if(pos.y == 1){
            pos.y = 188;
        }else if(pos.y == 2){
            pos.y = 170;
        }
        if(this.times[this.currIndex].t > 54){
            node.scale = .7;
            pos.y += node.height * .5 * node.scale;
        }else{
            pos.y += node.height * .5;
        }
        node.setPosition(pos);
    }
}
