
const { ccclass, property } = cc._decorator;

@ccclass
export class obsGroup extends cc.Component {

    @property({ type: [cc.Vec2], tooltip: "初始位置" })
    vecs: Array<cc.Vec2> = [];

    public init(): void {
        for (let i = 0; i < this.vecs.length; i++) {
            if (!this.node.children[i].activeInHierarchy)
                this.node.children[i].active = true;
            this.node.children[i].position = this.vecs[i];
        }
    }

    public rand(): void {
        let random: number = Math.random();
        if (random > .95) return;
        else if (random > .5) {
            //this.node.children[0].y -= 100;
            this.node.children[1].y -= 100;
            this.node.children[2].y -= 100;
        } else if (random > .05) {
            //this.node.children[1].y -= 100;
            this.node.children[2].y -= 100;
        } else {
            //this.node.children[2].y -= 100;
            this.node.children[0].y -= 100;
            this.node.children[1].y -= 100;
            this.node.children[2].y -= 100;
        }
    }
}
