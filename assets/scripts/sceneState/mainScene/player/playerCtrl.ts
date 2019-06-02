import { mainExterior } from "../mainExterior";

const {ccclass, property} = cc._decorator;

/**状态枚举 */
enum PlayerState{
    idle = 0,
    jump,
    down,
    squat
}

@ccclass
export class playerCtrl extends cc.Component {

    @property({type:cc.Float, tooltip:"重力加速度"})
    public mGravity:number = 0;
    @property({type:cc.Float, tooltip:"向上跳跃的初始速度"})
    public jumpSpeed:number = 0;

    private posX:number = 0;                                    //玩家初始X坐标
    private downSpeed:number = 0;                               //下落速度
    private maxdownSpeed:number = 0;                            //下落最大速度
    private currJumpSpeed:number = 0;                           //跳跃速度
    private mPlayerState:PlayerState = PlayerState.down;        //玩家状态
    private collider:cc.BoxCollider = null;                     //玩家自身的碰撞

    private collCount:number = 0;                               //记录玩家碰撞其它collider的数量
    private obstacleCount:number = 0;                           //碰到的障碍物个数
    private rightStepNode:cc.Node = null;                       //右台阶

    onLoad () {
        let manager=cc.director.getCollisionManager();  // 获取碰撞检测类
        manager.enabled = true;                         // 开启碰撞检测
        //manager.enabledDebugDraw = true                   //显示碰撞检测区域

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start():void{
        this.posX = this.node.x;
        this.currJumpSpeed = this.jumpSpeed;
        this.collider = this.node.getComponent(cc.BoxCollider);
    }

    public changeState(playerState:PlayerState):void{
        if(playerState == PlayerState.idle)
            this.idleStart();
        else if(playerState == PlayerState.jump)
            this.jumpStart();
        else if(playerState == PlayerState.down)
            this.downStart();
        else
            this.squatStart();
    }

    update(dt):void{

        this.moveBack(dt);

        if(this.mPlayerState == PlayerState.idle)
            this.idleUpdate();
        else if(this.mPlayerState == PlayerState.jump)
            this.jumpUpdate(dt);
        else if(this.mPlayerState == PlayerState.down)
            this.downUpdate(dt);
        else
            this.squatUpdate();
    }

    private moveBack(dt):void{
        if(this.node.x < this.posX){
            if(this.obstacleCount <= 0){
                this.node.x += dt * 100;
            }
        }
    }

//#region StateHandle

    private idleStart():void{
        this.mPlayerState = PlayerState.idle;

        this.downSpeed = 0;
    }
    private jumpStart():void{
        this.mPlayerState = PlayerState.jump;

        this.downSpeed = 0;
        this.currJumpSpeed = this.jumpSpeed;
    }
    private downStart():void{
        this.mPlayerState = PlayerState.down;
    }
    private squatStart():void{
        this.mPlayerState = PlayerState.squat;

        this.node.height *= .5;
        this.node.width *= .5;
        this.node.y -= this.node.height * .5;
        this.collider.size.width = this.node.width;
        this.collider.size.height = this.node.height;
    }

    private idleUpdate():void{
        if(this.collCount <= 0){
            if(this.rightStepNode != null){
                if(this.rightStepNode.isValid)
                    this.node.y -= this.ComputeUpSpeed(this.rightStepNode);
            }
        }
    }
    private jumpUpdate(dt):void{
        this.node.y += this.currJumpSpeed * dt;
        this.currJumpSpeed -= this.mGravity * dt;
        if(this.currJumpSpeed < 0){
            this.changeState(PlayerState.down);
        }
    }
    private downUpdate(dt):void{
        this.node.y += -this.downSpeed * dt;
        this.downSpeed += this.mGravity * dt;
    }
    private squatUpdate():void{
        if(this.collCount <= 0){
            if(this.rightStepNode != null){
                if(this.rightStepNode.isValid)
                    this.node.y -= this.ComputeUpSpeed(this.rightStepNode);
            }
        }
    }

//#endregion

//#region 碰撞检测

    onCollisionEnter(other, self) {
        this.collCount++;

        if(this.mPlayerState != PlayerState.idle && this.mPlayerState != PlayerState.squat){
            let localOtherPos:cc.Vec2 = GlobalVar.switchPosToNode(other.node, self.node.parent);
            switch(other.tag){
                case 0:
                    this.changeState(PlayerState.idle);
                    self.node.y = localOtherPos.y + other.node.height * .5 + self.node.height * .5;
                    break;
                case 3:
                    this.obstacleCount++;
                    if(this.isCollisionLeft(other, self)){//在障碍物左边发生碰撞
                        //let localOtherPos:cc.Vec2 = GlobalVar.switchPosToNode(other.node, self.node.parent);
                        self.node.x = localOtherPos.x - self.node.width * .5 - other.node.width * .5;
                    }else if(this.isCollisionUp(other, self)){
                        self.node.y = localOtherPos.y + other.node.height * .5 + self.node.height * .5;
                        this.changeState(PlayerState.idle);
                    }else if(this.isCollisionBottom(other, self)){
                        this.changeState(PlayerState.down);
                    }
                    break;
                default:
                    this.changeState(PlayerState.idle);
                    break;
            }
        }

        if(other.tag == 2)
            this.rightStepNode = other.node;
    }
    onCollisionStay(other, self) {
        if(other.tag == 1){//左台阶
            this.node.y += this.ComputeUpSpeed(other.node);
        }

        if(other.tag == 3){//障碍物
            if(this.isCollisionLeftStay(other, self)){//在障碍物左边发生碰撞
                let localOtherPos:cc.Vec2 = GlobalVar.switchPosToNode(other.node, self.node.parent);
                self.node.x = localOtherPos.x - self.node.width * .5 - other.node.width * .5;
            }
        }
    }
    onCollisionExit(other, self) {
/*         if(this.mPlayerState == PlayerState.idle)
            this.changeState(PlayerState.down); */
        this.collCount--;
        if(other.tag == 3){
            this.obstacleCount--;
            if(this.collCount == 0){
                if(this.mPlayerState != PlayerState.jump)
                    this.changeState(PlayerState.down);
            }
        }

        if(other.tag == 4){
            this.changeState(PlayerState.down);
        }
    }

    /**在障碍物左边发生碰撞 */
    private isCollisionLeft(other, self):boolean{
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

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){//在X轴方向发生碰撞
            return true;
        }
        return false;
    }
    /**在障碍物上面发生碰撞 */
    private isCollisionUp(other, self):boolean{
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

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {//在Y轴上发生碰撞
            if(selfPreAabb.yMax > otherPreAabb.yMax)
                return true;
        }
        return false;
    }

    private isCollisionBottom(other, self):boolean{
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

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {//在Y轴上发生碰撞
            if(selfPreAabb.yMin < otherPreAabb.yMin)
                return true;
        }
        return false;
    }

    private isCollisionLeftStay(other, self):boolean{

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


        let otherWorld:number = other.world.aabb.x;
        let selfWorld:number = self.world.aabb.x + self.node.width - 15;
        if(selfWorld < otherWorld)//在障碍物左边发生碰撞
            return true;
        return false;
    }


    /**计算上坡速度 */
    private ComputeUpSpeed(node:cc.Node):number{
        let time:number = node.width / (200 * .016);
        return node.height / time;
    }
//#endregion

//#region 按键输入

    private onKeyDown(event):void{
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.offSquat();
                this.onJump();
                break;
            case cc.macro.KEY.s:
                this.onSquat();
                break;
        }
    }
    private onKeyUp(event):void{
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                break;
            case cc.macro.KEY.s:
                this.offSquat();
                break;
        }
    }

    private onJump():void{
        if(this.mPlayerState == PlayerState.idle || this.mPlayerState == PlayerState.squat)
            this.changeState(PlayerState.jump);
    }
    private onSquat():void{
        if(this.mPlayerState == PlayerState.idle)
            this.changeState(PlayerState.squat);
    }
    private offSquat():void{
        if(this.mPlayerState == PlayerState.squat){
            this.changeState(PlayerState.idle);

            this.node.height *= 2;
            this.node.width *= 2;
            this.node.y += this.node.height * .25;
            this.collider.size.width = this.node.width;
            this.collider.size.height = this.node.height;
        }
    }

//#endregion

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}