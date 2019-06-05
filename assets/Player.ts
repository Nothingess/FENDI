const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private rb:cc.RigidBody = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        this.rb = this.getComponent(cc.RigidBody);
    }

    update(dt):void{
        //this.jump();
    }

    private onKeyDown(event):void{
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.jump();
                break;
            case cc.macro.KEY.s:
                break;
        }
    }
    private onKeyUp(event):void{
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                break;
            case cc.macro.KEY.s:
                break;
        }
    }

    private jump():void{
        this.rb.applyForceToCenter(cc.v2(10, 300000), true);
    }

    // update (dt) {}
}
