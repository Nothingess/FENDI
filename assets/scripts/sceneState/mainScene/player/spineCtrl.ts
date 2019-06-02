const {ccclass, property} = cc._decorator;

@ccclass
export class spineCtrl extends cc.Component {

    @property(cc.Float)
    mixTime: number = 0;

    private spine:sp.Skeleton = null;

    onLoad () {
        this.spine = this.getComponent(sp.Skeleton);
        

    }

    start () {
        
    }

    /**设置动画切换时的过渡时间 */
    private _setMix(anim1:string, anim2:string):void{
        this.spine.setMix(anim1, anim2, this.mixTime);
        this.spine.setMix(anim2, anim1, this.mixTime);
    }
}
