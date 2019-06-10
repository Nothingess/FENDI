const {ccclass, property} = cc._decorator;

@ccclass
export class trigger extends cc.Component {

    @property(cc.Node)
    public mask: cc.Node = null;

    onCollisionEnter(other, self) {
        if(other.tag === 10){//玩家
            this.clearMask();
        }
    }

    private clearMask():void{
        this.mask.runAction(cc.fadeOut(0.2));
    }
}
