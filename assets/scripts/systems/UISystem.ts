import { ISystem } from "./ISystem";
import { IUIBase, PanelLayer } from "../uiSystem/IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { GameLoop } from "../GameLoop";

export  class UISystem extends ISystem {

    private uiLayer:cc.Node;                        //背景节点
    private layerDict:Map<string, cc.Node>;         //存放各层级面板所对应的父物体
    private dict:Map<string, IUIBase>;              //用于存放已打开的面板

    private mMaskLayer:cc.Node = null;              //遮罩层（对底层UI遮罩）

    public sysInit():void{
        this.initLayer();
        this.dict = new Map<string, IUIBase>();
        //this.closeMask();
    }

    /**初始化层级 */
    private initLayer():void{
        this.uiLayer = cc.find("Canvas/UILayer");
        this.mMaskLayer = cc.find("funcPanel/mask", this.uiLayer);
        if(this.uiLayer == null)
            console.error("UISystem.initLayer fail, uiLayer is null!");

        this.layerDict = new Map<PanelLayer, cc.Node>();
        for(let pl in PanelLayer){
            //this.layerDict[pl] = this.uiLayer.getChildByName(pl);//该方法不会自动计数
            this.layerDict.set(pl, this.uiLayer.getChildByName(pl));
        }
    }

    /**
     * 打开任意类型面板（泛型方法）
     * @param panelType 面板类型
     * @param args 参数
     */
    public openPanel<T extends IUIBase>(panelType:new()=>T,name:string, args?:any[]):void{
        if(this.dict.get(name) != null) return;
        this.openMask();
        let uiPanel:IUIBase = this.uiLayer.addComponent(panelType);
        uiPanel.init(args);
        this.dict.set(name, uiPanel);
        cc.loader.loadRes(uiPanel.getSkinPath(), cc.Prefab, (e, res)=>{
            if(e){
                console.log(e);
                return;
            }
            if(res == null)
                console.error(`UISys.openPanel fail, skin is null, skinPath = ${uiPanel.getSkinPath()}`);
            uiPanel.skin = cc.instantiate(res);
            uiPanel.initStrategy();
            let parent:cc.Node = this.layerDict.get(uiPanel.layer);
            uiPanel.skin.setParent(parent);
            uiPanel.open();
        })
    }
    /**关闭面板 */
    public closePanel(name:string){
        let panel:IUIBase = this.dict.get(name);
        if(panel == null) return;
        this.closeMask();
        panel.Close(()=>{this.closeEndHandle(panel)});
    }
    private closeEndHandle(panel:IUIBase):void{
        panel.skin.destroy();
        this.uiLayer.removeComponent(panel);
        this.dict.delete(panel.getSkinName());
    }
    /**开启遮罩 */
    private openMask():void{
        if(this.dict.size == 0){
            this.mMaskLayer.active = true;
            if(GameLoop.getInstance().currIndex == -1)
                startExterior.getInstance().hideUI();
        }
    }
    /**关闭遮罩 */
    private closeMask():void{
        if(this.dict.size <= 1){
            this.mMaskLayer.active = false;
            if(GameLoop.getInstance().currIndex == -1)
                startExterior.getInstance().showUI();
        }
    }
}
