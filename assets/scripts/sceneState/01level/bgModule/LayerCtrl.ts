import { GameLoop } from "../../../GameLoop";

enum LayerType{
    build = 0,
    ground
}

const {ccclass, property} = cc._decorator;

@ccclass
export class LayerCtrl extends cc.Component {

    @property({type:cc.Enum(LayerType)})
    public layerType:LayerType = LayerType.build;

    private currWay:cc.Node = null;                 //当前运动的路段
    private oldWay:cc.Node = null;
    private nextPos:cc.Node = null;                 //下一个路段的位置

    private isComplete:boolean = false;             //路段是否加载完成

    private interval:number = 1;                    //检测时间间隔，检测是否需要加载下一个路段
    private timer:number = 0;                       //计时器

    private loadNodes:Array<cc.Node> = new Array<cc.Node>();

    // onLoad () {}

    start () {
        this.init();
    }

    private init():void{
        this.timer = this.interval;
        this.currWay = this.node.children[0];
        this.nextPos = this.currWay.getChildByName("nextPos");

        if(this.layerType == LayerType.build){
            this.loadNodes = GameLoop.getInstance().buildNode;
            GameLoop.getInstance().buildNode = [];
        }else if(this.layerType == LayerType.ground){
            this.loadNodes = GameLoop.getInstance().groundNode;
            GameLoop.getInstance().groundNode = [];
        }
    }

    update (dt) {
        if(this.isComplete)return;
        this.timer -= 0.0172;
        if(this.timer < 0){
            this.timer = this.interval;
            this.check();
        }
    }

    private check():void{
        if(this.loadNodes.length == 0)return;
        let worldPosX:number = GlobalVar.switchPosToNode(this.nextPos, this.node).x;
        if(worldPosX + this.node.x < cc.view.getVisibleSize().width * 1.3){
            this.nextWay();
        }

        //检测旧路段是否需要销毁
        if(this.oldWay == null || !this.oldWay.isValid)return;
        let oldWorldPosX:number = this.oldWay.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        if(oldWorldPosX < 0){//销毁
            this.oldWay.parent.destroy();
        }
    }

    /**加载下一个路段 */
    private nextWay():void{
        if(this.loadNodes.length == 0){
            this.isComplete = true;
            return;
        }else{
            this.setNextWay();
        }
    }
    /**设置下一个路段 */
    private setNextWay():void{
        this.oldWay = this.nextPos;             //保存oldWay，在适当的时间销毁
        this.currWay = this.loadNodes.shift();

        this.node.addChild(this.currWay);
        this.currWay.setPosition(GlobalVar.switchPosToNode(this.nextPos, this.node));
        this.nextPos = this.currWay.getChildByName("nextPos");
    }
}
