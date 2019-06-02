import { IBgModule } from "./bgModule/IBgModule";
import { bgCtrl } from "./bgCtrl";

export class IBgState {
    constructor(mBgCtrl:bgCtrl){
        this.mBgCtrl = mBgCtrl;
    }

    protected mBgCtrl:bgCtrl = null;
    protected mIBgModule:IBgModule = null;
    protected loopTimes:number = 0;
    protected bornPos:cc.Vec2 = cc.v2(0, 0);

    public init(bgName:string):void{
        let self = this;
        cc.loader.loadRes(`prefabs/bg/${bgName}`, function (err, prefab) {
            let newNode:cc.Node = cc.instantiate(prefab);
            cc.find("Canvas/bg/bg_run").addChild(newNode);
            self.mIBgModule = newNode.getComponent(IBgModule);
            self.mIBgModule.setState(self);
            newNode.setPosition(self.bornPos);
        });
    }
    public setPos(pos:cc.Vec2):void{
        //this.mIBgModule.node.setPosition(pos);
        this.bornPos = pos;
    }

    public getNextPos():cc.Vec2{
        return this.mIBgModule.getNextPos();
    }

    public setNextState():void{

    }

    public getBgMoveSpeed():number{return this.mIBgModule.getBgMoveSpeed()}
}

export class forwardState extends IBgState{
    constructor(mBgCtrl:bgCtrl){
        super(mBgCtrl);
        this.init("forward");
    }

    public setNextState():void{
        this.mBgCtrl.setState(new loopState(this.mBgCtrl));
    }
}

export class loopState extends IBgState{
    constructor(mBgCtrl:bgCtrl){
        super(mBgCtrl);
        this.init("loop");

        this.loopTimes = 2;
    }

    public setNextState():void{
        if(this.loopTimes > 0){
            //this.mBgCtrl.setState(new loopState(this.mBgCtrl));
            this.setPos(this.mIBgModule.getNextPos());
            this.init("loop");
            this.loopTimes--;
        }else{
            this.mBgCtrl.setState(new endState(this.mBgCtrl));
        }
    }
}
export class endState extends IBgState{
    constructor(mBgCtrl:bgCtrl){
        super(mBgCtrl);
        this.init("end");
    }
}
