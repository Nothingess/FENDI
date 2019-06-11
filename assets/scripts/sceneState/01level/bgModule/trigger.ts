import { mainExterior } from "../mainExterior";

const {ccclass, property} = cc._decorator;

@ccclass
export class trigger extends cc.Component {

    @property(cc.Node)
    public mask: cc.Node = null;

    onCollisionEnter(other, self) {
        if(other.tag === 10){//玩家
            this.clearMask();
        }else if(other.tag === 7){
            mainExterior.getInstance().stop();
            mainExterior.getInstance().pyCtrl.complete();
        }
    }

    private clearMask():void{
        if(this.mask == null)return;
        this.mask.runAction(cc.fadeOut(0.2));
    }
}
