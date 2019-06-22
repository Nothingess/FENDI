
const { ccclass, property } = cc._decorator;

@ccclass
export class scoreTip extends cc.Component {

    @property([cc.SpriteFrame])
    spList: Array<cc.SpriteFrame> = []

    @property(cc.Sprite)
    sp: cc.Sprite = null;

    public setSp(index: number): void {
        switch (index) {
            case 10:
                this.sp.spriteFrame = this.spList[0];
                break;
            case 20:
                this.sp.spriteFrame = this.spList[1];
                break;
            case 50:
                this.sp.spriteFrame = this.spList[2];
                break;
            case 100:
                this.sp.spriteFrame = this.spList[3];
                break;
            case 200:
                this.sp.spriteFrame = this.spList[4];
                break;
        }

    }
}
