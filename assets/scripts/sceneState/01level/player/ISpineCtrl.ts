const {ccclass, property} = cc._decorator;

@ccclass
export class ISpineCtrl extends cc.Component {

    @property(cc.Float)
    mixTime: number = 0;

    protected spine:sp.Skeleton = null;

    onLoad () {
        this.spine = this.getComponent(sp.Skeleton);
    }

    start () {

    }

//#region action

    /**播放跳跃动作 */
    public jump():void{
        this._setTimeScale(.3);
    }
    /**播放下蹲动作 */
    public squat():void{
        this._setTimeScale(.5);
    }
    /**播放奔跑动作 */
    public run():void{
        this._setTimeScale(1);
    }

    public stop():void{
        this.spine.paused = true;
    }
    public continue():void{
        this.spine.paused = false;
    }

    public motuo_jump():void{
        this._setTimeScale(.3);
    }
    public motuo_squat():void{
        this._setTimeScale(.5);
    }
    public motuo_run():void{
        this._setTimeScale(1);
    }

//#endregion


    /**设置动画切换时的过渡时间 */
    protected _setMix(anim1:string, anim2:string, val = this.mixTime):void{
        this.spine.setMix(anim1, anim2, val);
        this.spine.setMix(anim2, anim1, val);
    }
    /**设置时间大小 */
    public _setTimeScale(val:number):void{
        this.spine.timeScale = val;
    }
}
