const {ccclass, property} = cc._decorator;

enum LayerType{
    cloud = 0,
    build,
    tree,
    player,
    ground
}

@ccclass
export class LayerRun extends cc.Component {

    @property({type:cc.Enum(LayerType), tooltip:"层级枚举"})
    public layer:LayerType = LayerType.cloud;
    @property({type:cc.Float, tooltip:"移动速度"})
    public moveSpeed:number = 0;

    public stop:boolean = false;

    update(dt):void{
        if(this.stop) return;
        this.node.x -= this.moveSpeed * dt;
    }
}
