const {ccclass, property} = cc._decorator;

@ccclass
export class glod extends cc.Component {

    public index:number = 0;

    start():void{
        let anims:Array<string> = ["jinbi", "tongbi", "yinbi"]
        let ran:number = Math.random();
        if(ran > .9)
            this.index = 0;
        else if(ran > .65)
            this.index = 1;
        else
            this.index = 2;
        this.index = Math.floor(Math.random() * 3);
        this.node.children.forEach(e=>{
            let spine:sp.Skeleton = e.getComponent(sp.Skeleton);
            spine.setAnimation(0, anims[this.index], true);
        })

        if(this.index == 0)
            this.index = 50;
        else if(this.index == 1)
            this.index = 20;
        else
            this.index = 10;
    }

}
