import { IBgState } from "./IBgState";

export class bgCtrl {
    private mIBgState:IBgState = null;

    public setState(mIBgState:IBgState):void{
        let bornPos:cc.Vec2 = cc.v2(0, 0);
        if(this.mIBgState != null){
            bornPos = this.mIBgState.getNextPos();
        }

        this.mIBgState = mIBgState;
        this.mIBgState.setPos(bornPos);
    }

    //获取当前场景移动速度
    public getCurrBgMoveSpeed():number{return this.mIBgState.getBgMoveSpeed();}
}
