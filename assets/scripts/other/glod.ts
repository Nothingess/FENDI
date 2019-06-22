import { goldAction } from "./goldAction";

const {ccclass, property} = cc._decorator;

@ccclass
export class glod extends cc.Component {

    public index:number = 0;

    start():void{
        this.init();
    }

    public init():void{
        let ran:number = Math.random();
        if(ran > .9){
            this.index = 0;
        }
        else if(ran > .65){
            this.index = 1;
        }
        else{
            this.index = 2;
        }
        //this.index = Math.floor(Math.random() * 3);
        this.node.children.forEach(e=>{
            e.getComponent(goldAction).setGoldId(this.index);
        })
    }
}
