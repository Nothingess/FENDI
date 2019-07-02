
const {ccclass, property} = cc._decorator;

@ccclass
export class loadRotate extends cc.Component {

    update(dt):void{
        dt = 0.0167;
        this.node.rotation += dt * 150;
    }
}
