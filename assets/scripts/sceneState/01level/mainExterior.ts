import { UISystem } from "../../systems/UISystem";
import { LayerRun } from "./bgModule/LayerRun";
import { playerCtrl } from "./player/playerCtrl";
import { mainSceneState } from "../ISceneState";
import { GameLoop } from "../../GameLoop";
import { accountsPanel } from "../../uiSystem/accountsPanel";
import { AudioManager, AudioType } from "../../comms/AudioManager";
import { EventManager, EventType } from "../../comms/EventManager";

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
    private heartLess:cc.Node = null;

    private zoomTimes:number = 0;               //循环的次数（循环三次就缩放场景）

    private runLayer:cc.Node = null;              //摄像机

    private init():void{
        this.initComponent();
    }
    private initComponent():void{
        this.uiMgr = new UISystem();
        this.uiMgr.sysInit();

        this.createRole();
        this.heart = cc.find("Canvas/UILayer/uiElement/heart");
        this.scoreLa = cc.find("Canvas/UILayer/uiElement/score").getComponent(cc.Label);
        this.heartLess = cc.find("Canvas/run_layer/player_layer/heart_less");
        this.runLayer = cc.find("Canvas/run_layer");

        //this.zoom();
        EventManager.getInstance().addEventListener(EventType.zoomTrigger, this.onZoomTrigger.bind(this), "mainExterior");
        AudioManager.getInstance().playBGM(AudioType.BGM_1);
    }
    private createRole():void{
        let self = this;
        let node:cc.Node = null;
        if(GameLoop.getInstance().isMan){
            cc.loader.loadRes("prefabs/manRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").insertChild(node, 0);
                self.pyCtrl = node.getComponent(playerCtrl);
            })
        }else{
            cc.loader.loadRes("prefabs/womanRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").insertChild(node, 0);
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
        EventManager.getInstance().removeEventListenerByTag(EventType.zoomTrigger, "mainExterior");
    }

    //#region 监听事件

    public onZoomTrigger(prams:any):void{//判断三次缩放场景
        this.zoomTimes++;
        if(this.zoomTimes > 2){
            this.zoomIn();
        }
    }

    //#endregion

    //#region gameManager
    public addScore(val:number):void{
        this.score += val;
        this.updateScore();
    }
    private updateScore():void{
        this.scoreLa.string = `Score : ${this.score}`;
    }

    public minusHeart(vec:cc.Vec2):void{
        this.heartNum--;
/*         this.heartNum = 2; */
        this.floatHeartLess(vec);
        if(this.heartNum >= 0){
            this.heart.children[this.heartNum].color = cc.Color.GRAY;
        }
        if(this.heartNum == 0){
            AudioManager.getInstance().playSound(AudioType.LOST);
            this.uiMgr.openPanel(accountsPanel, "accountsPanel");
            this.isGameOver = true;
            this.stop();
            this.pyCtrl.stop();
        }
    }
    /**飘动减血图标 */
    public floatHeartLess(vec:cc.Vec2):void{
        this.heartLess.setPosition(vec);
        this.heartLess.opacity = 0;
        this.heartLess.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveBy(.5, cc.v2(0, 100)),
                    cc.fadeIn(.5)
                ),
                cc.fadeOut(.5)
            )
        )
    }
    public win():void{
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel");
        this.uploadScore();
    }
    public zoomIn():void{
        cc.find("Canvas/run_layer").runAction(cc.scaleBy(3, .4, .4))
    }
    public zoomOut():void{
        cc.find("Canvas/run_layer").runAction(cc.sequence(
            cc.callFunc(()=>{
                this.setMultiple(.4);
            }),
            cc.spawn(
                cc.scaleTo(3, 2.3, 2.3),
                cc.callFunc(()=>{
                    this.runLayer.runAction(cc.moveBy(3, cc.v2(0, -300)))
                })
            ),
            cc.callFunc(()=>{
                this.setMultiple(2.5);
            })
        ))
    }
    /**停止背景循环 */
    public stop():void{
        let childs:Array<cc.Node> = cc.find("Canvas/run_layer").children;

        childs.forEach(e => {
            let layerrun:LayerRun = e.getComponent(LayerRun);
            if(layerrun != null){
                layerrun.stop = true;
            }
        })
    }
    public decelerate():void{
        let layer:cc.Node = cc.find("Canvas/run_layer");
        layer.children[3].getComponent(LayerRun).setSpeed();
        layer.children[5].getComponent(LayerRun).setSpeed();
    }
    /**设置运动速度的倍率 */
    public setMultiple(val:number):void{
        this.pyCtrl.spCtrl._setTimeScale(val==.4?.4:1);
        let childs:Array<cc.Node> = cc.find("Canvas/run_layer").children;

        childs.forEach(e => {
            let layerrun:LayerRun = e.getComponent(LayerRun);
            if(layerrun != null){
                layerrun.setMultiple(val);
            }
        })
    }
    public uploadScore(K:string = "rank_1", V:string = `${this.score}`):void{
        if(GameLoop.getInstance().platform == null)return;
        GameLoop.getInstance().platform.setUserCloudStorage(
            [{key:K, value:V}]
        )
    }
}
