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

    start () {
        this.load();
    }

    private load():void{
        cc.director.preloadScene(this.nextScene, this.onProgress.bind(this), this.complete.bind(this));
    }

    private onProgress(com:number, total:number, item:any):void{
        this.bar.fillRange = com / total;
        this.mark.x = this.bar.node.width * this.bar.fillRange;
        this.txt.string = `${(this.bar.fillRange * 100).toFixed(2)}%`;
    }
    private complete():void{
        cc.loader.loadResDir("prefabs/uiPanels", this.onProgress.bind(this), this.completeRes.bind(this));
    }
    private completeRes():void{
        cc.director.loadScene(this.nextScene);
    }
}
