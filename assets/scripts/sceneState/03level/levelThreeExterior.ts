import { mainExterior } from "../01level/mainExterior";
import { level_3State } from "../ISceneState";
import { UISystem } from "../../systems/UISystem";
import { GameLoop } from "../../GameLoop";
import { playerCtrl } from "../01level/player/playerCtrl";
import { winPanel } from "../../uiSystem/winPanel";
import { LayerRun } from "../01level/bgModule/LayerRun";

export class levelThreeExterior {

    private constructor(){this.init();}

    private static _instance:levelThreeExterior = null;
    public static getInstance():levelThreeExterior{
        if(this._instance == null)
            this._instance = new levelThreeExterior();
        return this._instance;
    }
    public static endInstance(){
        this._instance = null;
    }

    private lvThreeState:level_3State = null;
    public uiMgr:UISystem = null;
    public pyCtrl:playerCtrl = null;

    private init():void{
        this.initComponent();
    }
    private initComponent():void{
        this.uiMgr = new UISystem();
        this.uiMgr.sysInit();

        this.createRole();
    }

    private createRole():void{
        let self = this;
        let node:cc.Node = null;
        if(GameLoop.getInstance().isMan){
            cc.loader.loadRes("prefabs/manRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(playerCtrl);
                self.pyCtrl.state = 1;
            })
        }else{
            cc.loader.loadRes("prefabs/womanRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(playerCtrl);
                self.pyCtrl.state = 1;
            })
        }
    }

    public setLevelThreeState(level3:level_3State):void{
        this.lvThreeState = level3;
    }
    public gotoStartState():void{
        this.lvThreeState.setStartState();
    }
    public update():void{
        this.uiMgr.sysUpdate();
    }
    public end():void{
        this.uiMgr.sysRelease();
    }

    public win():void{
        this.uiMgr.openPanel(winPanel, "winPanel");
    }

    public stop():void{
        let childs:Array<cc.Node> = cc.find("Canvas/run_layer").children;

        childs.forEach(e => {
            let layerrun:LayerRun = e.getComponent(LayerRun);
            if(layerrun != null){
                layerrun.stop = true;
            }
        })
    }
}
