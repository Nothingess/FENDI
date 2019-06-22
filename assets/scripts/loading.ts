const {ccclass, property} = cc._decorator;

@ccclass
export class loading extends cc.Component {

    @property({type:cc.Sprite, tooltip:"进度条"})
    bar: cc.Sprite = null;
    @property({type:cc.Node, tooltip:"进度标记"})
    mark:cc.Node = null;
    @property({type:cc.Label, tooltip:"进度显示"})
    txt:cc.Label = null;
    @property({tooltip:"加载的下一个场景"})
    nextScene:string = "01startScene";

    private currPro:number  = 0;
    private maxPro:number = 0;
    private isComplete:boolean = false;

    private isAlreadyLoadScene:boolean = false;

    start () {
        this.load();
    }

    update(dt):void{
        if(this.isComplete && this.currPro >= 1){
            if(this.isAlreadyLoadScene)return;
            this.isAlreadyLoadScene = true;
            cc.director.loadScene(this.nextScene);
        }
        if(this.currPro < this.maxPro){
            this.currPro += dt * .5;

            this.bar.fillRange = this.currPro;
            this.mark.x = this.bar.node.width * this.bar.fillRange;
            this.txt.string = `${(this.bar.fillRange * 100).toFixed(2)}%`;
        }
    }

    private load():void{
        cc.director.preloadScene(this.nextScene, this.onProgress.bind(this), this.complete.bind(this));
    }

    private onProgress(com:number, total:number, item:any):void{
        if((com / total) > this.maxPro)
            this.maxPro = com / total;
    }
    private complete():void{
        cc.loader.loadResDir("prefabs/uiPanels", this.onProgress.bind(this), this.completePres.bind(this));
    }
    private completePres():void{
        cc.loader.loadResDir("imgs", this.onProgress.bind(this), this.completeImgs.bind(this));
    }
    private completeImgs():void{
        this.isComplete = true;
    }
}
