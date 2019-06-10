import { UISystem } from "../../systems/UISystem";
import { playerCtrl } from "./player/playerCtrl";

export class mainExterior{
    private constructor(){this.init();}

    private static _instance:mainExterior = null;
    public static getInstance():mainExterior{
        if(this._instance == null)
            this._instance = new mainExterior();
        return this._instance;
    }

    private uiMgr:UISystem = null;

    //UI Element
    private hearts:cc.Node = null;

    private init():void{
        this.initComponent();
    }
    private initComponent():void{
        this.uiMgr = new UISystem();

        this.hearts = cc.find("Canvas/UILayer/uiElement/heart");
    }
    public update():void{
        this.uiMgr.sysUpdate();
    }
    public end():void{
        this.uiMgr.sysRelease();
    }

    //#region 监听事件



    //#endregion

//#region 其它

    //public getCurrBgMoveSpeed():number{return this.mBgCtrl.getCurrBgMoveSpeed();}

//#endregion
}
