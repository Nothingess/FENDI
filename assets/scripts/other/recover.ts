import { EventManager, EventType } from "../comms/EventManager";

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
                other.node.destroy();
                break
        }

    }

}
