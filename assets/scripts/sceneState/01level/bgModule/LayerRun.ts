const {ccclass, property} = cc._decorator;

enum LayerType{
    default = 0,
    loop,
}

@ccclass
export class LayerRun extends cc.Component {

    @property({type:cc.Enum(LayerType), tooltip:"层级枚举"})
    public layer:LayerType = LayerType.default;
    @property({type:cc.Float, tooltip:"移动速度"})
    public moveSpeed:number = 0;

    public stop:boolean = false;
    private loops:Array<cc.Node> = null;

    start():void{
        this.loops = new Array<cc.Node>();
        this.loops = this.node.children;
    }

    update(dt):void{
        if(this.stop) return;
        this.node.x -= this.moveSpeed * 0.0172;
        

        if(this.layer === LayerType.loop){
            this.check();
        }
    }

    public setSpeed(val:number = 200):void{
        this.moveSpeed = val;
    }
    /**设置运动速度的倍率 */
    public setMultiple(val:number):void{
        this.moveSpeed *= val;
    }

    /**检测是否需要换位 */
    private check():void{
        if(this.loops[0].convertToWorldSpaceAR(cc.v2(0, 0)).x < 0){
            let node:cc.Node = this.loops.shift();
            node.x = this.loops[this.loops.length - 1].x + Math.random() * 400 + 800;
            node.setScale(1, .6 + Math.random() * .4);
            this.loops.push(node);
        }
    }
}
