
const {ccclass, property} = cc._decorator;

@ccclass
export class mask extends cc.Component {

    // onLoad () {}

    start () {
        this.node.on("touchstart", ()=>{console.log("onClick mask")}, this);
    }

    // update (dt) {}
}
