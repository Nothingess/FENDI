
const {ccclass, property} = cc._decorator;

@ccclass
export class goldAction extends cc.Component {

    @property({type:[cc.SpriteFrame]})
    goldSpList:Array<cc.SpriteFrame> = [];

    public goldId:number = 0;
    public score:number = 0;

    start () {
        this.action();
    }

    public setGoldId(val:number):void{
        this.node.getComponent(cc.Sprite).spriteFrame = this.goldSpList[val];
        this.goldId = val;

        if(this.goldId == 0)
            this.score = 50;
        else if(this.goldId == 1)
            this.score = 20;
        else
            this.score = 10;
    }

    private action():void{
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(.4, 0, 1),
                    cc.scaleTo(.4, 1, 1)
                )
            )
        )
    }

    // update (dt) {}
}
