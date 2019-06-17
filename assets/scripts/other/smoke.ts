const {ccclass, property} = cc._decorator;

enum SmokeType{
    Normal,
    motuo
}

@ccclass
export class smoke extends cc.Component {

    @property({type:cc.Enum(SmokeType), tooltip:"烟雾类型"})
    smokeTy:SmokeType = SmokeType.Normal;

    private sp:sp.Skeleton = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp = this.getComponent(sp.Skeleton);
    }

    public play(vec:cc.Vec2):void{
        vec.x -= this.node.parent.x;
        this.node.setPosition(vec);
        if(this.smokeTy == SmokeType.Normal){
            this.sp.setAnimation(0, "renyanwu", false);
        }else{
            this.sp.setAnimation(0, "motuocheyanwu", false);
        }
    }
}
