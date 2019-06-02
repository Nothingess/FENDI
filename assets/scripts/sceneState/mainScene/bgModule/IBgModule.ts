import { IBgState } from "../IBgState";

const {ccclass, property} = cc._decorator;

@ccclass
export class IBgModule extends cc.Component {

    @property({type:cc.Node, tooltip:"衔接的下一个节点位置"})
    nextPos:cc.Node = null;

    protected bgMoveSpeed:number = 250;         //当前场景移动的速度
    public getBgMoveSpeed():number{return this.bgMoveSpeed;};
    protected bgState:IBgState = null;

    //背景层级
    protected cloudLayer:bgLayer = null;
/*     protected buildLayer:bgLayer = null;
    protected treeLayer:bgLayer = null;
    protected groundLayer:bgLayer = null; */

    protected isEnd:boolean = false;

    public setState(mIBgState:IBgState):void{
        this.bgState = mIBgState;
    }

    public getNextPos():cc.Vec2{
        return GlobalVar.switchPosToNodeLocalPos(
            this.nextPos,cc.v2(0, 0), this.nextPos.parent.parent
        )
    }

    start():void{
        this.initComponent();
    }

    protected initComponent():void{
        this.cloudLayer = new bgLayer(this.node.getChildByName("cloudLayer"), 50);
/*      this.buildLayer = new bgLayer(this.node.getChildByName("buildLayer"));
        this.treeLayer = new bgLayer(this.node.getChildByName("treeLayer"));
        this.groundLayer = new bgLayer(this.node.getChildByName("groundLayer")); */
    }

    update (dt) {

        //测试
        this.node.x -= dt * this.bgMoveSpeed;

        this.cloudLayer.update(dt);
/*         this.buildLayer.update(dt);
        this.treeLayer.update(dt);
        this.groundLayer.update(dt); */
    }

    protected checkIsNext():void{
        let worldPos:cc.Vec2 = this.node.convertToWorldSpaceAR(this.nextPos.position);
        if(!this.isEnd){
            if(worldPos.x < cc.view.getVisibleSize().width * 1.3){
                this.isEnd = true;
                this.bgState.setNextState();
            }
        }else{
            if(worldPos.x < 0){
                this.node.destroy();
            }
        }

    }
}

class bgLayer {
    private root:cc.Node = null;
/*     private showNodes: Array<cc.Node> = new Array<cc.Node>();
    private currIndex:number = 0;           //当前判断节点的索引
    private isEnd:boolean = false; */

    private moveSpeed:number = 0;
    public setMoveSpeed(val:number){
        this.moveSpeed = val;
    }

    constructor(root:cc.Node, speed:number = 0){
        this.root = root;
/*         this.showNodes = root.children; */

        //this.init();
        this.setMoveSpeed(speed);
    }

/*     private init():void{
        if(this.showNodes.length > 0){
            for(let i = 0; i < this.showNodes.length; i++){
                if(this.showNodes[i].activeInHierarchy)
                    this.currIndex++;
                else
                    break;
            }
        }
        if(this.currIndex > this.showNodes.length - 1)
            this.isEnd = true;
    } */

    public update(dt):void{

        //移动
        if(this.moveSpeed > 0)
            this.root.x += this.moveSpeed * dt;

/*         if(this.isEnd)return;
        if(this.checkDis())
            this.showNode(); */
    }

/*     private checkDis():boolean{
        let worldPos:cc.Vec2 = this.showNodes[this.currIndex].convertToWorldSpaceAR(new cc.Vec2(-this.showNodes[this.currIndex].width * .5, 0));
        if(worldPos.x < cc.view.getVisibleSize().width * 1.3)
            return true;
        else
            return false;
    } */
/*     private showNode():void{
        this.showNodes[this.currIndex].active = true;
        this.currIndex++;
        if(this.currIndex > this.showNodes.length - 1){
            this.isEnd = true;
        }
    } */
}
