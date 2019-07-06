import { GameLoop } from "../GameLoop";

const {ccclass, property} = cc._decorator;

@ccclass
export default class logoHidePlay extends cc.Component {

    private isHold:boolean = false;
    private curTimer:number = 0;

    start () {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.node.on("touchcancel", this.onTouchCancel, this);
    }

    update(dt):void{
        if(!this.isHold)return;
        this.curTimer += dt;
        if(this.curTimer >= 10){
            GameLoop.getInstance().isUnLock = false;
            this.curTimer = 0;
        }
    }


    private onTouchStart():void{
        this.isHold = true;
    }
    private onTouchEnd():void{
        this.isHold = false;
        this.curTimer = 0;
    }
    private onTouchCancel():void{
        this.isHold = false;
        this.curTimer = 0;
    }

    onDestroy():void{
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchend", this.onTouchEnd, this);
        this.node.off("touchcancel", this.onTouchCancel, this);
    }
}
