import { UISystem } from "../../systems/UISystem";
import { gameOverPanel } from "../../uiSystem/gameOverPanel";
import { LayerRun } from "./bgModule/LayerRun";
import { playerCtrl } from "./player/playerCtrl";
import { mainSceneState } from "../ISceneState";
import { winPanel } from "../../uiSystem/winPanel";
import { GameLoop } from "../../GameLoop";

export class mainExterior{
    private constructor(){this.init();}

    private static _instance:mainExterior = null;
    public static getInstance():mainExterior{
        if(this._instance == null)
            this._instance = new mainExterior();
        return this._instance;
    }
    public static endInstance(){
        this._instance = null;
    }

    private mainState:mainSceneState = null;
    public uiMgr:UISystem = null;
    public pyCtrl:playerCtrl = null;

    private heartNum:number = 3;
    private score:number = 0;
    private isGameOver:boolean = false;

    //UI Element
    private heart:cc.Node = null;
    private scoreLa:cc.Label = null;

    private init():void{
        this.initComponent();
    }
    private initComponent():void{
        this.uiMgr = new UISystem();
        this.uiMgr.sysInit();

        //this.pyCtrl = cc.find("Canvas/run_layer/player_layer/role").getComponent(playerCtrl);
        this.createRole();
        this.heart = cc.find("Canvas/UILayer/uiElement/heart");
        this.scoreLa = cc.find("Canvas/UILayer/uiElement/score").getComponent(cc.Label);
    }
    private createRole():void{
        let self = this;
        let node:cc.Node = null;
        if(GameLoop.getInstance().isMan){
            cc.loader.loadRes("prefabs/manRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(playerCtrl);
            })
        }else{
            cc.loader.loadRes("prefabs/womanRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").addChild(node);
                self.pyCtrl = node.getComponent(playerCtrl);
            })
        }
    }
    public setMainState(main:mainSceneState):void{
        this.mainState = main;
    }
    public gotoStartState():void{
        this.mainState.setStartState();
    }
    public update():void{
        this.uiMgr.sysUpdate();
    }
    public end():void{
        this.uiMgr.sysRelease();
    }

    //#region 监听事件


    //#endregion

    //#region gameManager
    public addScore(val:number):void{
        this.score += val;
        this.updateScore();
    }
    private updateScore():void{
        this.scoreLa.string = `Score : ${this.score}`;
    }

    public minusHeart():void{
        this.heartNum--;
        if(this.heartNum >= 0){
            this.heart.children[this.heartNum].color = cc.Color.GRAY;
        }
        if(this.heartNum == 0){
            this.uiMgr.openPanel(gameOverPanel, "gameOverPanel");
            this.isGameOver = true;
            this.stop();
            this.pyCtrl.stop();
        }
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
