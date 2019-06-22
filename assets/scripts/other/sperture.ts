
const {ccclass, property} = cc._decorator;

@ccclass
export class sperture extends cc.Component {

    @property({type:cc.Prefab})
    pre:cc.Prefab = null;
    @property({type:cc.Node})
    uiElement:cc.Node = null;

    private pool:cc.NodePool = null;

    start():void{
        this.pool = new cc.NodePool();
        for(let i = 0; i < 2; i++){
            let node:cc.Node = cc.instantiate(this.pre);
            this.pool.put(node);
        }

        this.node.on("touchstart", this.play, this);
    }

    public play():void{
        console.log("touchstart")
        let node:cc.Node = null;
        if(this.pool.size() > 0){
            node = this.pool.get();
        }
        else{
            node = cc.instantiate(this.pre);
        }
        this.uiElement.addChild(node);
        node.setPosition(this.node.position);
        node.opacity = 255;
        node.runAction(
            cc.sequence(
                cc.spawn(cc.scaleTo(.5, 1.3),cc.fadeOut(.5)),
                cc.callFunc(()=>{
                    node.scale = 1;
                    this.pool.put(node);
                })
            )
        )
    }
}
