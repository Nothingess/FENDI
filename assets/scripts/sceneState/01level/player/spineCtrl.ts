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
        this._setMix("nanren_pao", "nanren_tiao", 0.2);
        this._setMix("nanren_pao", "nanren_xiatan", 0.1);
    }

//#region action

    /**播放跳跃动作 */
    public jump():void{
        this.spine.setAnimation(0, "nanren_tiao", false);
        this._setTimeScale(.3);
    }
    /**播放下蹲动作 */
    public squat():void{
        this.spine.setAnimation(0, "nanren_xiatan", true);
        this._setTimeScale(.5);
    }
    /**播放奔跑动作 */
    public run():void{
        this.spine.setAnimation(0, "nanren_pao", true);
        this._setTimeScale(1);
    }

    public stop():void{
        this.spine.paused = true;
    }

//#endregion


    /**设置动画切换时的过渡时间 */
    private _setMix(anim1:string, anim2:string, val = this.mixTime):void{
        this.spine.setMix(anim1, anim2, val);
        this.spine.setMix(anim2, anim1, val);
    }
    /**设置时间大小 */
    private _setTimeScale(val:number):void{
        this.spine.timeScale = val;
    }
}
