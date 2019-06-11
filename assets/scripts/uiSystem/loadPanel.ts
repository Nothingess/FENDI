import { IUIBase, PanelLayer } from "../uiSystem/IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { strateC } from "../uiSystem/openAction/IOpenStrategy";
import { mainExterior } from "../sceneState/01level/mainExterior";
import { GameLoop } from "../GameLoop";

let level_1:Array<string> = [
    "prefabs/bgModule/01level/build_loop",
    "prefabs/bgModule/01level/build_end",
    "prefabs/bgModule/01level/ground_loop",
    "prefabs/bgModule/01level/ground_end"
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
    private loadScene:string = "";

    private isLoadScene:boolean = false;

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
    }
    private complete():void {
        this.pro.fillRange = 0;
        if(this.loadScene == "01level"){
            cc.loader.loadResArray(level_1, this.loadResProgress.bind(this), this.loadResComplete);
        }else if(this.loadScene == "02level"){

        }else if(this.loadScene == "03level"){
            cc.loader.loadResArray(level_3, this.loadResProgress.bind(this), this.loadLevel_3Complete.bind(this));
        }
        else if(this.loadScene == "01startScene"){
            GameLoop.getInstance().buildNode = [];
            GameLoop.getInstance().groundNode = [];
            mainExterior.getInstance().gotoStartState();
        }
    }
    private loadResProgress(com:number, total:number, item:any):void{
        this.pro.fillRange = com / total;
    }
    private loadResComplete(err, res):void{
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[1]));

        GameLoop.getInstance().groundNode.push(cc.instantiate(res[2]));
        GameLoop.getInstance().groundNode.push(cc.instantiate(res[2]));
        GameLoop.getInstance().groundNode.push(cc.instantiate(res[2]));
        GameLoop.getInstance().groundNode.push(cc.instantiate(res[3]));

        startExterior.getInstance().enterMainState();
    }
    private loadLevel_3Complete(err, res):void{
        res.forEach(element => {
            GameLoop.getInstance().buildNode.push(cc.instantiate(element));
        });
        startExterior.getInstance().enterLevel_3();
    }

}
