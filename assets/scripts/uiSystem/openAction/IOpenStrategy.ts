/**动画策略类 */
export class IOpenStrategy {

    public constructor(obj:cc.Node){
        this.mObj = obj;
    }

    protected mObj:cc.Node = null;                    //操作对象
    protected mOpenVec:cc.Vec2 = cc.v2(0, 0);         //动画开始位置
    protected mEndVec:cc.Vec2 = cc.v2(0, 0);          //动画结束位置
    protected mSpeed:number = .2;                     //动画播放速度
    /**设置动画速度 */
    public setActionSpeed(val:number):void{
        this.mSpeed = val;
    }
    public open(callback:Function):void{

    }
    public close(callback:Function):void{
        
    }
}

export class strateA extends IOpenStrategy{
    public open(callback:Function):void{
        this.mObj.scale = 0;
        this.mObj.opacity = 0;
        this.mObj.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeTo(this.mSpeed, 255),
                    cc.scaleTo(this.mSpeed, 1).easing(cc.easeBackOut())
                ),
                cc.callFunc(()=>{callback();})
            )
        )
    }
    public close(callback:Function):void{
        this.mObj.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeTo(this.mSpeed, 0),
                    cc.scaleTo(this.mSpeed, 0).easing(cc.easeBackIn())
                ),
                cc.callFunc(()=>{callback();})
            )
        )
    }
}

export class strateB extends IOpenStrategy{
    public open(callback:Function):void{
        this.mObj.scale = 2;
        this.mObj.opacity = 0;
        this.mObj.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeTo(this.mSpeed, 255),
                    cc.scaleTo(this.mSpeed, 1).easing(cc.easeBackOut())
                ),
                cc.callFunc(()=>{callback();})
            )
        )
    }
    public close(callback:Function):void{
        this.mObj.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeTo(this.mSpeed, 0),
                    cc.scaleTo(this.mSpeed, 2).easing(cc.easeBackIn())
                ),
                cc.callFunc(()=>{callback();})
            )
        )
    }
}

export class strateC extends IOpenStrategy{
    public open(callback:Function):void{
        this.mObj.opacity = 0;
        this.mObj.runAction(
            cc.sequence(
                cc.fadeIn(this.mSpeed),
                cc.callFunc(()=>{callback();})
            )
        )
    }
    public close(callback:Function):void{
        this.mObj.runAction(
            cc.sequence(
                cc.fadeOut(this.mSpeed),
                cc.callFunc(()=>{callback();})
            )
        )
    }
}
