import { IUIBase, PanelLayer } from "../uiSystem/IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { strateC } from "../uiSystem/openAction/IOpenStrategy";
import { GameLoop } from "../GameLoop";

let level_1:Array<string> = [
    "prefabs/bgModule/01level/01screen_2",
    "prefabs/bgModule/01level/01screen_3",
    "prefabs/bgModule/01level/01screen_4",
    "prefabs/bgModule/01level/01screen_5",
    "prefabs/bgModule/01level/01screen_6",
    "prefabs/bgModule/01level/01screen_7",
    "prefabs/bgModule/01level/01screen_g2",
    "prefabs/bgModule/01level/01screen_g3",
    "prefabs/bgModule/01level/01screen_g4",

]
let level_2:Array<string> = [
    "prefabs/bgModule/02level/02screen_2",
    "prefabs/bgModule/02level/02screen_3",
    "prefabs/bgModule/02level/02screen_4",
    "prefabs/bgModule/02level/02screen_5",
    "prefabs/bgModule/02level/02screen_6",
    "prefabs/bgModule/02level/02screen_7",
    "prefabs/bgModule/02level/02screen_8",
    "prefabs/bgModule/02level/02screen_9",
    "prefabs/bgModule/02level/02screen_10",
    "prefabs/bgModule/02level/02screen_11",
    "prefabs/bgModule/02level/02screen_g2",
    "prefabs/bgModule/02level/02screen_g3",
    "prefabs/bgModule/02level/02screen_g4",
]
let level_3:Array<string> = [
    "prefabs/bgModule/03level/screen_2",
    "prefabs/bgModule/03level/screen_3",
    "prefabs/bgModule/03level/screen_4",
    "prefabs/bgModule/03level/screen_5",
    "prefabs/bgModule/03level/screen_6",
    "prefabs/bgModule/03level/screen_7",
]

const {ccclass, property} = cc._decorator;

@ccclass
export class loadPanel extends IUIBase {

    private pro:cc.Sprite = null;
    private mark:cc.Node = null;
    private txt:cc.Label = null;
    private loadScene:string = "";
    private proVal:number = 0;

    public initStrategy():void{
        this.mOpenStrategy = new strateC(this.skin);
    }
    public init(params?:any[]):void{
        super.init(params);
        this.skinPath = "loadPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowing():void{
        super.onShowing();
        this.initComponent();
    }
    public initComponent():void{
        this.pro = cc.find("pro/bar", this.skin).getComponent(cc.Sprite);
        this.mark = cc.find("pro/bar/mark", this.skin);
        this.txt = this.mark.getComponentInChildren(cc.Label);
    }

    public onShowed():void{
        this.load(this.args[0]);
    }

    private load(name:string):void{
        this.loadScene = name;
        cc.director.preloadScene(name, this.onProgress.bind(this), this.complete.bind(this));
    }

    private onProgress(com:number, total:number, item:any):void{
        this.pro.fillRange = com / total;
        this.mark.x = this.pro.node.width * this.pro.fillRange;
        this.txt.string = `${(this.pro.fillRange * 100).toFixed(2)}%`;
    }
    private complete():void {
        this.pro.fillRange = 0;
        if(this.loadScene == "01level"){
            cc.loader.loadResArray(level_1, this.loadResProgress.bind(this), this.loadResComplete);
        }else if(this.loadScene == "02level"){
            cc.loader.loadResArray(level_2, this.loadResProgress.bind(this), this.loadLevel_2Complete.bind(this));
        }else if(this.loadScene == "03level"){
            cc.loader.loadResArray(level_3, this.loadResProgress.bind(this), this.loadLevel_3Complete.bind(this));
        }
        else if(this.loadScene == "01startScene"){
            GameLoop.getInstance().buildNode = [];
            GameLoop.getInstance().groundNode = [];
            this.args[1].gotoStartState();
        }
    }
    private loadResProgress(com:number, total:number, item:any):void{
        this.pro.fillRange = com / total;
        this.mark.x = this.pro.node.width * this.pro.fillRange;
        this.txt.string = `${(this.pro.fillRange * 100).toFixed(2)}%`;
    }
    private loadResComplete(err, res):void{

        let count:number = 0;
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));

        while(count < 3){
            for(let i = 1; i < 5; i++){
                GameLoop.getInstance().buildNode.push(cc.instantiate(res[i]));
            }
            count++;
        }
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[5]));

        count = 0;
        while(count < 3){
            for(let i = 6; i < 8; i++){
                GameLoop.getInstance().groundNode.push(cc.instantiate(res[i]))
            }
            count++;
        }

        GameLoop.getInstance().groundNode.push(cc.instantiate(res[8]));

        startExterior.getInstance().enterMainState();
    }
    private loadLevel_2Complete(err, res):void{
        let count:number = 0;
        res.forEach(element => {
            if(count < 10)
                GameLoop.getInstance().buildNode.push(cc.instantiate(element));
            else
                GameLoop.getInstance().groundNode.push(cc.instantiate(element));
            count++;
        });
        startExterior.getInstance().enterLevel_2();
    }
    private loadLevel_3Complete(err, res):void{
        res.forEach(element => {
            GameLoop.getInstance().buildNode.push(cc.instantiate(element));
        });
        startExterior.getInstance().enterLevel_3();
    }

}
