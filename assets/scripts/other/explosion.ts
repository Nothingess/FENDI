
const {ccclass, property} = cc._decorator;

@ccclass
export class explosion extends cc.Component {

    private sp:sp.Skeleton = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp = this.getComponent(sp.Skeleton);
    }

    public play(vec:cc.Vec2):void{
        this.node.setPosition(vec);
        this.sp.setAnimation(0, "animation", false);

    }
}
