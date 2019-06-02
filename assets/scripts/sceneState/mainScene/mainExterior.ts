import { bgCtrl } from "./bgCtrl";
import { forwardState } from "./IBgState";
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

    private mPlayerCtrl:playerCtrl = null;
    //private mBgCtrl:bgCtrl = null;
    private uiMgr:UISystem = null;

    private init():void{
        this.initComponent();
    }
    private initComponent():void{
        //this.mBgCtrl = new bgCtrl();
        //this.mBgCtrl.setState(new forwardState(this.mBgCtrl));
        this.uiMgr = new UISystem();
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
