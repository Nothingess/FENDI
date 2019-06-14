import { EventManager, EventType } from "../comms/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class zoomTrigger extends cc.Component {

    onCollisionEnter(other, self):void{
        if(other.tag == 10){//玩家
            EventManager.getInstance().dispatchEvent(EventType.zoomTrigger);
        }
    }
}
