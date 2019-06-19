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

    private heartNum:number = 3;
    private score:number = 0;

    //UI Element
    private heart:cc.Node = null;
    private scoreLa:cc.Label = null;
    private heartLess:cc.Node = null;

    private obsType:Array<number> = new Array<number>();
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

        AudioManager.getInstance().playBGM(AudioType.BGM_2);
    }

    private createRole():void{
        let self = this;
        let node:cc.Node = null;
        if(GameLoop.getInstance().isMan){
            cc.loader.loadRes("prefabs/manRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").insertChild(node, 0);
                self.pyCtrl = node.getComponent(playerCtrl);
                self.pyCtrl.state = 1;
            })
        }else{
            cc.loader.loadRes("prefabs/womanRole", cc.Prefab, (err, res)=>{
                node = cc.instantiate(res);
                cc.find("Canvas/run_layer/player_layer").insertChild(node, 0);
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

    public setMainState():void{
        this.lvTwoState.setMainState();
    }
    public setLevel_2State():void{
        this.lvTwoState.setLevel_2State();
    }
    public setLevel_3State():void{
        this.lvTwoState.setLevel_3State();
    }

    public update():void{
        this.uiMgr.sysUpdate();
    }
    public end():void{
        this.uiMgr.sysRelease();
        levelTwoExterior.endInstance();
    }
    public win():void{
        AudioManager.getInstance().playSound(AudioType.WIN);
        this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelTwoExterior.getInstance(), this.score]);
        this.uploadScore();
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


    public addScore(val:number):void{
        this.score += val;
        this.updateScore();
    }
    private updateScore():void{
        this.scoreLa.string = `Score : ${this.score}`;
    }

    public minusHeart(vec:cc.Vec2):void{
        this.heartNum--;
        //this.heartNum = 2;
        this.floatHeartLess(vec);
        if(this.heartNum >= 0){
            this.heart.children[this.heartNum].color = cc.Color.GRAY;
        }
        if(this.heartNum == 0){
            AudioManager.getInstance().playSound(AudioType.LOST);
            this.uiMgr.openPanel(accountsPanel, "accountsPanel", [levelTwoExterior.getInstance(), this.score]);
            this.stop();
            this.pyCtrl.stop();
            this.uploadScore();
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

    public triggerObs(node:cc.Node, tag:number):void{
        if(this.obsType.indexOf(tag) >= 0)return;
        this.obsType.push(tag);
        if(tag > 11){
            this.showObsTip(node, 1);
        }else{
            this.showObsTip(node, 0);
        }
    }
    /**显示障碍物的提示
     * ty: 障碍物的动作类型 0-下蹲 1-跳
     */
    public showObsTip(node:cc.Node, ty:number):void{
        cc.loader.loadRes(`prefabs/other/${ty == 0?"dd":"jj"}`, cc.Prefab, (err, res)=>{
            let child:cc.Node = cc.instantiate(res);
            node.addChild(child);
            child.setPosition(cc.v2(0, node.height * .5));
            child.scale = 0;
            child.runAction(cc.sequence(cc.delayTime(.5),cc.scaleTo(.3, 1).easing(cc.easeBackInOut())));
        })
    }

    public uploadScore(K:string = "rank_2", V:string = `${this.score}`):void{
        if(GameLoop.getInstance().platform == null)return;
        console.log("uploadScore")
        GameLoop.getInstance().platform.setUserCloudStorage(
            [{key:K, value:V}]
        )
    }
}
