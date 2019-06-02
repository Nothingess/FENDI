const {ccclass, property} = cc._decorator;

@ccclass
export class LayerRun extends cc.Component {

    @property({type:cc.Float, tooltip:"移动速度"})
    public moveSpeed:number = 0;

    update(dt):void{
        this.node.x -= this.moveSpeed * dt;
    }
}
