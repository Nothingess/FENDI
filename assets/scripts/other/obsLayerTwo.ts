import { obs } from "./obsLayer";

const {ccclass, property} = cc._decorator;

enum LevelType{
    two,
    three
}

@ccclass
export class obsLayerTwo extends cc.Component {
    @property([cc.Prefab])
    public pres:Array<cc.Prefab> = [];
    @property({type:cc.Enum(LevelType)})
    lvType:LevelType = LevelType.two;
    private times:Array<obs> = null;

    private currIndex:number = 1;
    private viewWidth:number = 0;

    private interval:number = 1;

    onLoad () {
        cc.loader.loadRes("jsons/bgm_2", cc.JsonAsset, (err, res)=>{
            this.times = (this.lvType == LevelType.two)?res.json.bgm2:res.json.bgm3;
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


        let posX:number = 400 * this.times[this.currIndex].t + 600;

        if(posX - (-this.node.x) < this.viewWidth * 1.5){//显示障碍物
            this.createObs(cc.v2(posX, this.times[this.currIndex].y));
            this.currIndex++;
        }
    }

    private createObs(pos:cc.Vec2):void{
        let index:number = Math.floor(Math.random() * this.pres.length);
        let node:cc.Node = cc.instantiate(this.pres[index]);
        this.node.addChild(node);
        if(this.lvType == LevelType.two){
            if(pos.y == 0){
                pos.y = 60;
            }else if(pos.y == 1){
                pos.y = 188;
            }else if(pos.y == 2){
                pos.y = 170;
            }
        }else{
            if(pos.y == 0){
                pos.y = 300;
            }else if(pos.y == 1){
                pos.y = 400;
            }
        }
        pos.y += node.height * .5;
        node.setPosition(pos);
    }
}
