import { GameLoop } from "../../GameLoop";

const {ccclass, property} = cc._decorator;

@ccclass
export class FlyCtrl extends cc.Component {

    @property({type:cc.Float, tooltip:"速度"})
    moveSpeed:number = 0;
    @property({type:cc.Float, tooltip:"最大旋转角度"})
    maxRot:number = 0;
    @property({type:cc.Float, tooltip:"旋转速度"})
    rotSpeed:number = 0;

    private maxBorder:number = 0;           //上边最大距离
    private dir:number = 0;                 //移动方向（-1， 0， 1）

    //控制按钮
    private downBtn:cc.Node = null;
    private upBtn:cc.Node = null;
    private child:cc.Node = null;

    private isDown:boolean = false;
    private isUp:boolean = false;

    private isOver:boolean = false;
    private isComplete:boolean = false;

    onLoad () {
        let manager=cc.director.getCollisionManager();  // 获取碰撞检测类
        manager.enabled = true;                         // 开启碰撞检测
    }

    start () {
        this.maxBorder = cc.view.getVisibleSize().height;
        this.downBtn = cc.find("Canvas/UILayer/uiElement/down_btn");
        this.upBtn = cc.find("Canvas/UILayer/uiElement/up_btn");
        this.child = this.node.children[0];

        this.onBtnEvent();
    }

    update (dt) {
        this.dir = (this.isUp?1:0) + (this.isDown?-1:0);

        this.rotate(dt);
        this.move(dt);

        if(this.isComplete){
            this.node.x += dt * 400;
        }
    }

    private move(dt):void{
        this.node.y -= this.moveSpeed * (Math.abs(this.child.rotation) / this.maxRot) * (this.child.rotation > 0?1:-1) * dt;


        if(this.node.y < this.maxBorder * .2){
            this.node.y = this.maxBorder * .2;
        }
        if(this.node.y > this.maxBorder * .8){
            this.node.y = this.maxBorder * .8;
        }
    }
    private rotate(dt):void{
        if(this.dir == 0){
            if(Math.abs(this.child.rotation) < 1){
                this.child.rotation = 0;
            }else if(this.child.rotation > 0){
                this.child.rotation -= this.rotSpeed * dt;
            }else{
                this.child.rotation += this.rotSpeed * dt;
            }
        }else if(this.dir > 0){
            if(this.child.rotation > -this.maxRot)
                this.child.rotation -= this.rotSpeed * dt;
            else{
                this.child.rotation = -this.maxRot;
            }
        }else{
            if(this.child.rotation < this.maxRot)
                this.child.rotation += this.rotSpeed * dt;
            else
                this.child.rotation = this.maxRot;
        }
    }

    public complete():void{
        this.isComplete = true;
    }

    //#region 按键输入

    private onBtnEvent():void{
        this.downBtn.on("touchstart", this.getDownBtnDown, this);
        this.downBtn.on("touchend", this.getDownBtnUp, this);
        this.downBtn.on("touchcancel", this.getDownBtnUp, this);

        this.upBtn.on("touchstart", this.getUpBtnDown, this);
        this.upBtn.on("touchend", this.getUpBtnUp, this);
        this.upBtn.on("touchcancel", this.getUpBtnUp, this);
    }

    private getDownBtnDown():void{
        this.isDown = true;
    }
    private getDownBtnUp():void{
        this.isDown = false;
    }
    private getUpBtnDown():void{
        this.isUp = true;
    }
    private getUpBtnUp():void{
        this.isUp = false;
    }
    //#endregion

    onCollisionEnter(other, self):void{
        if(other.tag == 7){
            GameLoop.getInstance().win();
        }
    }
    onDestroy():void{
        this.downBtn.off("touchstart", this.getDownBtnDown, this);
        this.downBtn.off("touchend", this.getDownBtnUp, this);
        this.downBtn.off("touchcancel", this.getDownBtnUp, this);

        this.upBtn.off("touchstart", this.getUpBtnDown, this);
        this.upBtn.off("touchend", this.getUpBtnUp, this);
        this.upBtn.off("touchcancel", this.getUpBtnUp, this);
    }
}
