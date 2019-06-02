import { IOpenStrategy } from "./openAction/IOpenStrategy";
const {ccclass, property} = cc._decorator;

/**面板层级 */
export enum PanelLayer{
    funcPanel = "funcPanel",        //功能面板
    alertTip = "alertTip",          //弹窗提示
    tipFloat = "tipFloat"           //浮动提示
}

const skinPathPrefix:string = "prefabs/uiPanels/";       //皮肤路径前缀
const itemPathPrefix:string = "prefabs/";

@ccclass
export class IUIBase extends cc.Component {
    protected skinPath:string;                          //皮肤路径（名称）
    public skin:cc.Node;                                //皮肤节点（面板）
    public layer:PanelLayer;                            //层级
    public args:any[];                                  //面板参数
    protected mOpenStrategy:IOpenStrategy = null;       //动画策略

    /**初始化动画策略 */
    public initStrategy():void{}
    /**获取皮肤路径 */
    public getSkinPath():string{
        return `${skinPathPrefix}${this.skinPath}`;
    }
    /**获取皮肤名称 */
    public getSkinName():string{
        return this.skinPath;
    }

    //#region 生命周期

    /**初始化 */
    public init(Params?:any[]):void{
        if(!!Params)
            this.args = Params;
    }
    /**初始化组件，节点 */
    protected initComponent():void{

    }
    public open():void{
        this.onShowing();
    }
    protected onShowing():void{
        this.mOpenStrategy.open(()=>{this.onShowed();});
    }
    protected onShowed():void{
        
    }
    /**面板更新(用于关闭时只是隐藏面板（没有销毁）的操作，重新打开时会执行，更新参数属性) */
    public update(dt):void{}
    public Close(cb:Function):void{
        this.onClosing(cb);
    }
    protected onClosing(cb:Function):void{
        this.mOpenStrategy.close(()=>{cb();this.onClosed()});
    }
    protected onClosed():void{
        
    }
    //#endregion
}
