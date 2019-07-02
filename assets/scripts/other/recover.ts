import { EventManager, EventType } from "../comms/EventManager";
import { GameLoop } from "../GameLoop";

const { ccclass, property } = cc._decorator;

@ccclass
export class recover extends cc.Component {

    onCollisionExit(other, self) {
        //
        switch (other.tag) {
            case 11://障碍物
            case 12:
            case 13:
            case 14:
                EventManager.getInstance().dispatchEvent(EventType.addObsPool, other.node);
                break;
            case 20:
                EventManager.getInstance().dispatchEvent(EventType.addGoldPool, other.node);
                break;
            default:
                if(GameLoop.getInstance().currIndex == 3){
                    EventManager.getInstance().dispatchEvent(EventType.addObsPool, other.node);
                }else
                    other.node.destroy();
                break
        }

    }

}
