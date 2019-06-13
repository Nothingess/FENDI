import { level_2State } from "../ISceneState";
import { UISystem } from "../../systems/UISystem";
import { accountsPanel } from "../../uiSystem/accountsPanel";
import { playerCtrl } from "../01level/player/playerCtrl";
import { GameLoop } from "../../GameLoop";
import { LayerRun } from "../01level/bgModule/LayerRun";
import { AudioManager, AudioType } from "../../comms/AudioManager";

export class levelTwoExterior {

    private constructor(){this.init();}

    private static _instance:levelTwoExterior = null;
    public static getInstance():levelTwoExterior{
        if(this._instance == null)
            this._instance = new levelTwoExterior();
        return this._instance;
    }
    public static endInstance(){
        this._instance = null;
    }

    private lvTwoState:level_2State = null;
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
        console.log("===============");
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

    public setLevelTwoState(level2:level_2State):void{
        this.lvTwoState = level2;
    }
    public gotoStartState():void{
        this.lvTwoState.setStartState();
    }
    public update():void{
        this.uiMgr.sysUpdate();
    }
    public end():void{
        this.uiMgr.sysRelease();
    }
    public win():void{
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel");
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
