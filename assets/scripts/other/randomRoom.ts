
const {ccclass, property} = cc._decorator;

@ccclass
export class randomRoom extends cc.Component {

    @property({type:[cc.SpriteFrame], tooltip:"随机房间数组"})
    rooms: Array<cc.SpriteFrame> = [];

    @property({type:[cc.Node], tooltip:"需要修改的节点"})
    nodes:Array<cc.Node> = [];

    private lastIndex:number = 0;

    // onLoad () {}

    start () {
        this.nodes.forEach(element => {
           let childs:Array<cc.Node> = element.children;
           childs.forEach(e => {
               let index:number = Math.floor(Math.random() * this.rooms.length);
               if(index == this.lastIndex){
                   index += Math.floor(Math.random() * (this.rooms.length - 1) + 1);
                   index = index % this.rooms.length;
               }
               e.getComponent(cc.Sprite).spriteFrame = this.rooms[index];
               this.lastIndex = index;
           });
        });
    }

    // update (dt) {}
}
