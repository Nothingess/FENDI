interface obs{
    t:number,
    y:number
}

enum obsType{
    One,
    Two
}

const {ccclass, property} = cc._decorator;

@ccclass
export class obsLayer extends cc.Component {

    @property([cc.Prefab])
    public pres:Array<cc.Prefab> = [];
    @property({type:cc.Enum(obsType)})
    type:obsType = obsType.One;

    private times:Array<obs> = null;

    private currIndex:number = 1;
    private viewWidth:number = 0;

    private interval:number = 1;

    onLoad () {
        cc.loader.loadRes(this.type == obsType.One?"jsons/bgm_1":"jsons/bgm_2", cc.JsonAsset, (err, res)=>{
            this.times = res.json.bgm1;
        })
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
        if(this.times[this.currIndex].t < 54){
            let posX:number = 400 * this.times[this.currIndex].t + 350;
            console.log(posX);
            if(posX - (-this.node.x) < this.viewWidth * 1.3){//显示障碍物
                this.createObs(cc.v2(posX, this.times[this.currIndex].y));
                this.currIndex++;
            }
        }else{

        }
    }

    private createObs(pos:cc.Vec2):void{
        let node:cc.Node = cc.instantiate(this.pres[Math.floor(Math.random() * this.pres.length)]);
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
}
