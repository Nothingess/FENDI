import { EventManager, EventType } from "../../../comms/EventManager";


const {ccclass, property} = cc._decorator;

@ccclass
export class onCultureEvent extends cc.Component {

    @property({type:cc.Node})
    walls:cc.Node = null;
    @property({type:cc.Node})
    obs:cc.Node = null;

    onLoad () {

        EventManager.getInstance().addEventListener(EventType.zoomIn, this.onZoomIn.bind(this), "onCultureEvent");
    }

    private onZoomIn():void{
        this.node.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(()=>{
                this.walls.opacity = this.obs.opacity = 255;
            })
        ))
    }

    onDestroy():void{

        EventManager.getInstance().removeEventListenerByTag(EventType.zoomIn, "onCultureEvent");
    }

}
