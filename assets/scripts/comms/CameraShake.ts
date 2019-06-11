import { Shake } from "./Shake";

const {ccclass, property} = cc._decorator;

@ccclass
export class CameraShake extends cc.Component {

    public shake():void{
        let shakeAc:Shake = Shake.create(.5, 8, 8);
        this.node.runAction(cc.sequence(shakeAc, cc.callFunc(()=>{this.node.setPosition(cc.v2(0, 0))})))
    }
    
}
