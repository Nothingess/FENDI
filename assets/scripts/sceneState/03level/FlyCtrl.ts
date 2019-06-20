import { GameLoop } from "../../GameLoop";
import { AudioManager, AudioType } from "../../comms/AudioManager";
import { CameraShake } from "../../comms/CameraShake";
import { levelThreeExterior } from "./levelThreeExterior";
import { glod } from "../../other/glod";
import { explosion } from "../../other/explosion";

const {ccclass, property} = cc._decorator;

@ccclass
export class FlyCtrl extends cc.Component {

    @property({type:cc.Float, tooltip:"速度"})
    moveSpeed:number = 0;
    @property({type:cc.Float, tooltip:"最大旋转角度"})
    maxRot:number = 0;
    @property({type:cc.Float, tooltip:"旋转速度"})
    rotSpeed:number = 0;

    private cameraShake:CameraShake = null;

    private maxBorder:number = 0;           //上边最大距离
    private dir:number = 0;                 //移动方向（-1， 0， 1）

    //控制按钮
    private downBtn:cc.Node = null;
    private upBtn:cc.Node = null;
    private child:cc.Node = null;

    private isDown:boolean = false;
    private isUp:boolean = false;

    private isComplete:boolean = false;
    private explosionCtrl:explosion = null;                     //爆炸控制，碰撞到障碍物时触发

    onLoad () {
        let manager=cc.director.getCollisionManager();  // 获取碰撞检测类
        manager.enabled = true;                         // 开启碰撞检测
    }

    start () {
        this.maxBorder = cc.view.getVisibleSize().height;
        this.downBtn = cc.find("Canvas/UILayer/uiElement/down_btn");
        this.upBtn = cc.find("Canvas/UILayer/uiElement/up_btn");
        this.cameraShake = cc.find("Canvas/Main Camera").getComponent(CameraShake);
        this.explosionCtrl = cc.find("Canvas/run_layer/ground_layer/explosion").getComponent(explosion);
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
        dt = 0.0172;
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

        switch(other.tag){
            case 6://金币
                other.node.destroy();
                let go:glod = other.node.parent.getComponent(glod);
                levelThreeExterior.getInstance().addScore(10, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), go.iii);

                AudioManager.getInstance().playSound(AudioType.GLOD);
            break;
            case 7:
                GameLoop.getInstance().win();
            break;
            case 9:
                other.node.destroy();
                levelThreeExterior.getInstance().addScore(200, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), 3);

                AudioManager.getInstance().playSound(AudioType.GLOD);
                break;
            case 15:
            case 16:
                this.explosionCtrl.play(other.node.position);
                levelThreeExterior.getInstance().minusHeart(this.node.position);
                other.node.destroy();
                this.cameraShake.shake();
                AudioManager.getInstance().playSound(GameLoop.getInstance().isMan?AudioType.OBSMAN:AudioType.OBSWOMAN);
            break;
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
