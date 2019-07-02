
const {ccclass, property} = cc._decorator;

@ccclass
export class destroyCheck extends cc.Component {

    @property({type:cc.Float})
    type:number = 0;

    private checkInterval:number = 3;

    update (dt) {
        dt = 0.0167;
        this.checkInterval -= dt;
        if(this.checkInterval < 0){
            this.checkInterval = 3;
            if(this.node.children.length == 0){
                this.node.destroy();
                return;
            }
            this.node.children.forEach(e=>{
                if(this.type == 0){
                    if(e.convertToWorldSpaceAR(cc.v2(0, 0)).x + e.width * (1 - e.anchorX) * e.scaleX + (e.name == "room"?800:0) < 0){
                        e.destroy();
                    }
                }
                else{
                    if(e.convertToWorldSpaceAR(cc.v2(0, 0)).x + e.width * .5 < -100){
                        e.destroy();
                    }
                }
            })
        }
    }
}
