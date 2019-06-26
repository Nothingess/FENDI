import { mainExterior } from "../mainExterior";
import { ISpineCtrl } from "./ISpineCtrl";
import { CameraShake } from "../../../comms/CameraShake";
import { GameLoop } from "../../../GameLoop";
import { AudioManager, AudioType } from "../../../comms/AudioManager";
import { levelTwoExterior } from "../../02level/levelTwoExterior";
import { smoke } from "../../../other/smoke";
import { explosion } from "../../../other/explosion";
import { EventManager, EventType } from "../../../comms/EventManager";
import { goldAction } from "../../../other/goldAction";
import { packAction } from "../../../other/packAction";

const { ccclass, property } = cc._decorator;

/**状态枚举 */
enum PlayerState {
    idle = 0,
    jump,
    down,
    squat
}

@ccclass
export class playerCtrl extends cc.Component {

    @property({ type: cc.Float, tooltip: "重力加速度" })
    public mGravity: number = 0;
    @property({ type: cc.Float, tooltip: "向上跳跃的初始速度" })
    public jumpSpeed: number = 0;

    public state: number = 0;           //角色形态（0：奔跑，1：摩托，2：飞行）

    private posX: number = 0;                                    //玩家初始X坐标
    private downSpeed: number = 0;                               //下落速度
    private maxdownSpeed: number = 0;                            //下落最大速度
    private currJumpSpeed: number = 0;                           //跳跃速度
    private mPlayerState: PlayerState = PlayerState.down;        //玩家状态
    private collider: cc.BoxCollider = null;                     //玩家自身的碰撞

    private collCount: number = 0;                               //记录玩家碰撞其它collider的数量
    private rightStepNode: cc.Node = null;                       //右台阶
    public spCtrl: ISpineCtrl = null;                            //spine动画控制器
    private smokeCtrl: smoke = null;                             //烟雾控制，起跳和下落时
    private explosionCtrl: explosion = null;                     //爆炸控制，碰撞到障碍物时触发

    private squatBtn: cc.Node = null;                            //按钮
    private jumpBtn: cc.Node = null;
    private onSquatBtn:boolean = false;                          //按下下蹲键
    private onJumpBtn:boolean = false;                           //按下跳跃键

    private cameraShake: CameraShake = null;

    private isSquat: boolean = false;
    private isOver: boolean = false;

    private isUpCol:boolean = false;
    private isLeft:boolean = false;

    private isComplete: boolean = false;
    private isGamePause: boolean = false;


    private isNeedCheck: boolean = false;                        //是否需要检测回复原来位置

    onLoad() {
        let manager = cc.director.getCollisionManager();  // 获取碰撞检测类
        manager.enabled = true;                         // 开启碰撞检测
        //manager.enabledDebugDraw = true                   //显示碰撞检测区域

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.spCtrl = this.getComponentInChildren(ISpineCtrl);

        this.squatBtn = cc.find("Canvas/UILayer/uiElement/squat_btn");
        this.jumpBtn = cc.find("Canvas/UILayer/uiElement/jump_btn");
        this.cameraShake = cc.find("Canvas/Main Camera").getComponent(CameraShake);
        this.smokeCtrl = cc.find("Canvas/run_layer/ground_layer/smoke").getComponent(smoke);
        this.explosionCtrl = cc.find("Canvas/run_layer/ground_layer/explosion").getComponent(explosion);

    }

    start(): void {
        this.posX = this.node.x;
        this.currJumpSpeed = this.jumpSpeed;
        this.collider = this.node.getComponent(cc.BoxCollider);

        //注册按钮事件
        this.squatBtn.on("touchstart", this.getSquatKeyDown, this);
        this.squatBtn.on("touchend", this.getSquatKeyUp, this);
        this.squatBtn.on("touchcancel", this.getSquatKeyUp, this);
        this.jumpBtn.on("touchstart", this.getJumpKeyDown, this);
        this.jumpBtn.on("touchend", this.getJumpKeyUp, this);
        this.jumpBtn.on("touchcancel", this.getJumpKeyUp, this);
        EventManager.getInstance().addEventListener(EventType.onHide, this.onHide.bind(this), "playerCtrl");
        EventManager.getInstance().addEventListener(EventType.onShow, this.onShow.bind(this), "playerCtrl");

        if (this.state == 0)
            this.spCtrl.jump();
        else if (this.state == 1) {
            this.spCtrl.motuo_run();
            this.changeColSizeMotuo(1);
        }
    }

    public changeState(playerState: PlayerState): void {

        if (playerState == PlayerState.idle)
            this.idleStart();
        else if (playerState == PlayerState.jump)
            this.jumpStart();
        else if (playerState == PlayerState.down)
            this.downStart();
        else
            this.squatStart();

        if (playerState != PlayerState.squat && this.isSquat) {
            this.isSquat = false;
            if (this.state == 0)
                this.changeColSize(1);
            else if (this.state == 1)
                this.changeColSizeMotuo(1);
        }
    }

    update(dt): void {

        //this.moveBack(dt);
        dt = 0.0172;
        if (this.mPlayerState == PlayerState.idle)
            this.idleUpdate();
        else if (this.mPlayerState == PlayerState.jump)
            this.jumpUpdate(dt);
        else if (this.mPlayerState == PlayerState.down)
            this.downUpdate(dt);
        else
            this.squatUpdate();

        if (this.isComplete) {
            this.node.x += dt * GameLoop.getInstance().currIndex == 0 ? 3 : 6;
        }
        else {
            if (this.isNeedCheck) {
                this.checkMoveBack(dt);
            }
        }
    }

    private checkMoveBack(dt): void {
        if (this.node.convertToWorldSpaceAR(cc.v2(0, 0)).x > 350) {
            this.node.x -= dt * 50;
        }
    }

    //#region StateHandle

    private idleStart(): void {
        this.mPlayerState = PlayerState.idle;

        this.downSpeed = 0;

        if (this.state == 0)
            this.spCtrl.run();
        else if (this.state == 1)
            this.spCtrl.motuo_run();

        //console.log("idleStart");
    }
    private jumpStart(): void {
        this.mPlayerState = PlayerState.jump;

        this.downSpeed = 0;
        this.currJumpSpeed = this.jumpSpeed;

        if (this.state == 0)
            this.spCtrl.jump();
        else if (this.state == 1)
            this.spCtrl.motuo_jump();

        this.smokeCtrl.play(this.node.position);
    }
    private downStart(): void {
        this.mPlayerState = PlayerState.down;

        //console.log("downStart");
    }
    private squatStart(): void {
        this.mPlayerState = PlayerState.squat;

        if (this.state == 0)
            this.changeColSize(0);
        else if (this.state == 1)
            this.changeColSizeMotuo(0);
        this.isSquat = true;

        if (this.state == 0)
            this.spCtrl.squat();
        else if (this.state == 1)
            this.spCtrl.motuo_squat();
    }

    private idleUpdate(): void {
        if (this.collCount <= 0) {
            if (this.rightStepNode != null) {
                if (this.rightStepNode.isValid)
                    this.node.y -= this.ComputeUpSpeed(this.rightStepNode);
            }
        }

        if(this.onJumpBtn){
            //if (this.mPlayerState == PlayerState.idle || this.mPlayerState == PlayerState.squat)
            this.changeState(PlayerState.jump);
        }
        else if(this.onSquatBtn){
            //if (this.mPlayerState == PlayerState.idle)
            this.changeState(PlayerState.squat);
        }
    }
    private jumpUpdate(dt): void {
        this.node.y += this.currJumpSpeed * dt;
        this.currJumpSpeed -= this.mGravity * dt;
        if (this.currJumpSpeed < 0) {
            this.changeState(PlayerState.down);
        }
    }
    private downUpdate(dt): void {
        this.node.y += -this.downSpeed * dt;
        this.downSpeed += this.mGravity * dt;
    }
    private squatUpdate(): void {
        if (this.collCount <= 0) {
            if (this.rightStepNode != null) {
                if (this.rightStepNode.isValid)
                    this.node.y -= this.ComputeUpSpeed(this.rightStepNode);
            }
        }
        if(this.onJumpBtn){
            //if (this.mPlayerState == PlayerState.idle || this.mPlayerState == PlayerState.squat)
            this.changeState(PlayerState.jump);
        }else if(!this.onSquatBtn){
            this.changeState(PlayerState.idle);
        }
    }

    //#endregion

    //#region 碰撞检测

    onCollisionEnter(other, self) {
        this.collCount++;

        //待优化
        switch (other.tag) {
            case 0://ground
                if (this.mPlayerState != PlayerState.idle && this.mPlayerState != PlayerState.squat) {
                    this.changeState(PlayerState.idle);
                    //this.node.y = other.world.aabb.yMax + this.node.height * .5 - 0.5;
                    this.node.y = other.node.y + other.node.height * other.node.scaleY * .5 - .1;
                }
                break;
            case 2://右台阶
                this.rightStepNode = other.node;
                if (this.mPlayerState != PlayerState.squat)
                    this.changeState(PlayerState.idle);
                break;
            case 11://障碍物
            case 12:
            case 13:
            case 14:
                if (this.isCollisionLeft(other, self)) {
                    this.isLeft = true;
                    this.isUpCol = false;
                    if (GameLoop.getInstance().currIndex == 0)
                        mainExterior.getInstance().minusHeart(this.node.position);
                    else if (GameLoop.getInstance().currIndex == 1)
                        levelTwoExterior.getInstance().minusHeart(this.node.position);

                    //重新加入障碍物对象池
                    EventManager.getInstance().dispatchEvent(EventType.addObsPool, other.node);
                    //other.node.destroy();
                    this.cameraShake.shake();
                    this.explosionCtrl.play(other.node.position);
                    AudioManager.getInstance().playSound(GameLoop.getInstance().isMan ? AudioType.OBSMAN : AudioType.OBSWOMAN);
                } else if (this.isCollisionUp(other, self)) {
                    this.isLeft = false;
                    this.isUpCol = true;
                    this.node.y = other.node.y + other.node.height * other.node.scaleY * .5 - .1;
                    this.changeState(PlayerState.idle);
                } else if (this.isCollisionBottom(other, self)) {
                    //this.changeState(PlayerState.down);
                    if (GameLoop.getInstance().currIndex == 0)
                        mainExterior.getInstance().minusHeart(this.node.position);
                    else if (GameLoop.getInstance().currIndex == 1)
                        levelTwoExterior.getInstance().minusHeart(this.node.position);

                    //重新加入障碍物对象池
                    EventManager.getInstance().dispatchEvent(EventType.addObsPool, other.node);
                    //other.node.destroy();
                    this.cameraShake.shake();
                    this.explosionCtrl.play(other.node.position);
                    AudioManager.getInstance().playSound(GameLoop.getInstance().isMan ? AudioType.OBSMAN : AudioType.OBSWOMAN);
                }
                break;
            case 5:
                break;
            case 6://金币
                this.collCount--;
                let go: goldAction = other.node.getComponent(goldAction);
                go.hide();
                if (GameLoop.getInstance().currIndex == 0) {
                    mainExterior.getInstance().addScore(go.score, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), go.goldId);
                }
                else if (GameLoop.getInstance().currIndex == 1) {
                    levelTwoExterior.getInstance().addScore(go.score, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), go.goldId);
                }


                AudioManager.getInstance().playSound(AudioType.GLOD);
                break;
            case 7:
                GameLoop.getInstance().win();
                break;
            case 8:
                this.collCount--;
                break;
            case 9:
                this.collCount--;
                //other.node.destroy();
                let pack: packAction = other.node.getComponent(packAction);
                pack.hide();
                if (GameLoop.getInstance().currIndex == 0) {
                    mainExterior.getInstance().addScore(100, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), 3);
                }
                else if (GameLoop.getInstance().currIndex == 1) {
                    levelTwoExterior.getInstance().addScore(100, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), 3);
                }


                AudioManager.getInstance().playSound(AudioType.GLOD);
                break;
            case 30:
                other.node.getComponent(sp.Skeleton).enabled = false;
                cc.loader.loadRes("prefabs/other/jinbichufa", cc.Prefab, (err, res) => {
                    if(err){
                        console.log("playerCtrl load jinbichufa fail", err);
                        return;
                    }
                    let node: cc.Node = cc.instantiate(res);
                    other.node.addChild(node)
                    node.setPosition(cc.v2(0, 0));
                })
                if (GameLoop.getInstance().currIndex == 0) {
                    mainExterior.getInstance().addScore(200, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), 3);
                }
                else if (GameLoop.getInstance().currIndex == 1) {
                    levelTwoExterior.getInstance().addScore(200, other.node.convertToWorldSpaceAR(cc.v2(0, 0)), 3);
                }


                AudioManager.getInstance().playSound(AudioType.GLOD);
                break;
            default://其他
                if (this.mPlayerState != PlayerState.squat)
                    this.changeState(PlayerState.idle);
                break;
        }
    }
    onCollisionStay(other, self) {
        if (other.tag == 1) {//左台阶
            this.node.y += this.ComputeUpSpeed(other.node);
        }
    }
    onCollisionExit(other, self) {
        if (other.tag != 8 && other.tag != 6 && other.tag != 9)
            this.collCount--;
        if (this.collCount == 0) {
            if (this.isUpCol && this.mPlayerState != PlayerState.jump) {
                //判断是哪个方向离开的 TODO
                if (other.world.aabb.xMax < self.world.aabb.xMin)
                    this.changeState(PlayerState.down);

                this.isUpCol = this.isLeft = false;
            }
        }
    }

    /**在障碍物左边发生碰撞 */
    private isCollisionLeft(other, self): boolean {
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherAabb)) {//在X轴方向发生碰撞
            return true;
        }
        return false;
    }
    /**在障碍物上面发生碰撞 */
    private isCollisionUp(other, self): boolean {
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherAabb)) {//在Y轴上发生碰撞
            if (selfPreAabb.yMax > otherPreAabb.yMax)
                return true;
        }
        return false;
    }

    private isCollisionBottom(other, self): boolean {
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherAabb)) {//在Y轴上发生碰撞
            if (selfPreAabb.yMin < otherPreAabb.yMin)
                return true;
        }
        return false;
    }


    /**计算上坡速度 */
    private ComputeUpSpeed(node: cc.Node): number {
        let time: number = node.width / (400 * .016);
        return node.height / time;
    }
    //#endregion

    //#region 按键输入

    private onKeyDown(event): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.offSquat();
                this.onJump();
                break;
            case cc.macro.KEY.s:
                this.onSquat();
                break;
        }
    }
    private onKeyUp(event): void {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                break;
            case cc.macro.KEY.s:
                this.offSquat();
                break;
        }
    }

    //按钮输入
    private getSquatKeyDown(): void {//按下蹲下键
        this.onSquat();
    }
    private getSquatKeyUp(): void {//抬起蹲下键
        this.offSquat();
    }
    private getJumpKeyDown(): void {
        //this.offSquat();
        this.onJump();
    }
    private getJumpKeyUp():void{
        this.offJump();
    }

    private onJump(): void {
        if (this.isOver || this.isGamePause) return;
        this.onJumpBtn = true;
/*         if (this.mPlayerState == PlayerState.idle || this.mPlayerState == PlayerState.squat)
            this.changeState(PlayerState.jump); */
    }
    private onSquat(): void {
        if (this.isOver || this.isGamePause) return;
        this.onSquatBtn = true;
/*         if (this.mPlayerState == PlayerState.idle)
            this.changeState(PlayerState.squat); */
    }
    private offJump():void{
        if (this.isOver || this.isGamePause) return;
        this.onJumpBtn = false;
    }
    private offSquat(): void {
        if (this.isOver || this.isGamePause) return;
        this.onSquatBtn = false;
/*         if (this.mPlayerState == PlayerState.squat)
            this.changeState(PlayerState.idle); */
    }
    /**游戏完成 */
    public complete(): void {
        this.isComplete = true;
    }
    //#endregion

    /**蹲下时改变碰撞体形状
     * 0:下蹲形状
     */
    private changeColSize(val: any): void {
        if (val === 0) {
            this.collider.offset.y = 42.4;
            this.collider.size.height = this.node.height * .7;
        } else {
            this.collider.offset.y = 61.9;
            this.collider.size.height = this.node.height;
        }
    }
    /**改变摩托的碰撞体外形 */
    private changeColSizeMotuo(val: any): void {
        if (val === 0) {
            this.collider.offset = cc.v2(-2.8, 48.3);
            this.collider.size = cc.size(116.2, 96.6);
        } else {
            this.collider.offset = cc.v2(-2.8, 61.9);
            this.collider.size = cc.size(116.2, 123.8);
        }
    }

    public stop(): void {
        this.isOver = true;
        this.spCtrl.stop();
    }
    public pasue(): void {
        if (this.isOver) return;
        this.isGamePause = true;
        this.spCtrl.stop();
    }
    public continue(): void {
        if (this.isOver) return;
        this.isGamePause = false;
        this.spCtrl.continue();
    }

    /**缩小一半 */
    public zoomOut(): void {
        this.node.runAction(cc.scaleTo(.3, .8, .8));
        this.jumpSpeed *= .55;
        this.mGravity *= .55;
        this.isNeedCheck = true;        //场景放大了，需要复原玩家位置
    }

    //#region 监听事件


    private onHide(): void {
        this.pasue();
    }
    private onShow(): void {
        this.continue();
    }

    //#endregion

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.squatBtn.off("touchstart", this.getSquatKeyDown, this);
        this.squatBtn.off("touchend", this.getSquatKeyUp, this);
        this.squatBtn.off("touchcancel", this.getSquatKeyUp, this);
        this.jumpBtn.off("touchstart", this.getJumpKeyDown, this);

        EventManager.getInstance().removeEventListenerByTag(EventType.onHide, "playerCtrl");
        EventManager.getInstance().removeEventListenerByTag(EventType.onShow, "playerCtrl");
    }
}