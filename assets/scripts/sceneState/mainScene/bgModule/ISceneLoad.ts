export interface Element{
    name:string,
    path:string,
    x:number,
    y:number,
    sizeX:number,
    sizeY:number
}

const {ccclass, property} = cc._decorator;
@ccclass
export class ISceneLoad extends cc.Component {//地图加载器，分层加载，每层之间独立

    protected maxScreen:number = 0;
    protected currIndex:number = 0;
    protected pools:Map<string, cc.Node> = null;

    protected isComplete:boolean = false;

    protected showNextScreen():void{
        this.currIndex++;
        if(this.currIndex >= this.maxScreen - 1){
            this.isComplete = true;
            return;
        }

    }

}
