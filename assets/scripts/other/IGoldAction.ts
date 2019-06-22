
const { ccclass, property } = cc._decorator;

@ccclass
export class IGoldAction extends cc.Component {

    protected box: cc.BoxCollider = null;
    protected sp: cc.Sprite = null;

    onLoad(){
        this.box = this.getComponent(cc.BoxCollider);
        this.sp = this.getComponent(cc.Sprite);
    }
    start () {
        this.action();
    }

    public setGoldId(val: number): void { }
    protected action(): void { }

    /**隐藏 */
    public hide(): void {
        this.box.enabled = false;
        this.sp.enabled = false;
    }
    /**显示 */
    public show(): void {
        if (!this.box) return;
        if (this.box.enabled) return;
        this.box.enabled = true;
        this.sp.enabled = true;
    }
}
