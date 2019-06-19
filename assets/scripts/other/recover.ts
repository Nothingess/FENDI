
const {ccclass, property} = cc._decorator;

@ccclass
export class recover extends cc.Component {

    onCollisionExit(other, self) {
        other.node.destroy();
    }

}
