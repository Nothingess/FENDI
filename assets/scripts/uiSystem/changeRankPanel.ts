import { IUIBase, PanelLayer } from "./IUIBase";
import { startExterior } from "../sceneState/startScene/startExterior";
import { AudioManager, AudioType } from "../comms/AudioManager";
import { GameLoop } from "../GameLoop";
import { strateA } from "./openAction/IOpenStrategy";
import { rankItem } from "../other/rankItem";

interface RankItem{
    Name:string,
    Avatar:string,
    Total:number
}

export class changeRankPanel extends IUIBase {

    private closeBtn: cc.Node = null;
    private leftBtn:cc.Node = null;
    private rightBtn:cc.Node = null;
    private rankList:Array<RankItem> = null;
    private pageIndex:number = 0;

    private itemRank:Array<rankItem> = null;                //排行榜 item 列表
    private myRankItem:rankItem = null;
    private load:cc.Node = null;

    private isCanNext:boolean = true;                       //是否能翻页

    public initStrategy(): void {
        this.mOpenStrategy = new strateA(this.skin);
    }

    public init(Params?: any[]): void {
        super.init(Params);
        this.skinPath = "changeRankPanel";
        this.layer = PanelLayer.funcPanel;
    }
    public onShowed(): void {
        this.initComponent();
    }

    public initComponent(): void {
        this.rankList = new Array<RankItem>();
        this.closeBtn = cc.find("close_btn", this.skin);
        this.leftBtn = cc.find("btn_left", this.skin);
        this.rightBtn = cc.find("btn_right", this.skin);
        this.load = cc.find("load", this.skin);

        this.closeBtn.on("touchend", this.onCloseBtn, this);
        this.leftBtn.on("touchend", this.onLeftBtn, this);
        this.rightBtn.on("touchend", this.onRightBtn, this);

        this.itemRank = cc.find("Display/view/context", this.skin).getComponentsInChildren(rankItem);
        this.myRankItem = cc.find("block", this.skin).getComponent(rankItem);

        this.btnAction();

        this.getRank();
    }

    private getRank():void{
        if(GameLoop.getInstance().platform != null){
            GameLoop.getInstance().platform.getRank(this.getRankData.bind(this));
        }
    }

    private getRankData(myRank, rankList:Array<RankItem>):void{
        this.load.active = false;
        this.setMyRank(myRank);
        this.rankList = rankList;
        this.setRank();
    }

    private setMyRank(myRank):void{
        if(GameLoop.getInstance().platform == null)return;
        this.myRankItem.node.active = true;
        if(myRank != null)
            this.myRankItem.init(myRank.Rank + 1, GameLoop.getInstance().platform.avtarUrl, GameLoop.getInstance().platform.nickName, `${myRank.Total}`, true);
        else{
            this.myRankItem.init(-1, GameLoop.getInstance().platform.avtarUrl, GameLoop.getInstance().platform.nickName, "0", true)
        }
    }
    private setRank():void{
        let start:number = this.pageIndex * 5;
        
        this.itemRank.forEach(e => {
            if(this.rankList.length - 1 >= start){
                if(!e.node.activeInHierarchy){
                    e.node.active = true;
                }
                e.init(start + 1, this.rankList[start].Avatar, this.rankList[start].Name, `${this.rankList[start].Total}`);
                start++;
            }else{
                e.node.active = false;
            }
        })
    }
    private nextPage():void{
        if(!this.isCanNext)return;
        this.isCanNext = false;
        this.scheduleOnce(()=>{
            this.isCanNext = true;
        }, 0.5)

        let start:number = (this.pageIndex+1) * 5;
        if(this.rankList.length - 1 < start)return;
        this.pageIndex++;
        this.setRank();
    }
    private lastPage():void{
        if(!this.isCanNext)return;
        this.isCanNext = false;
        this.scheduleOnce(()=>{
            this.isCanNext = true;
        }, 0.5)

        if(this.pageIndex == 0)return;
        this.pageIndex--;
        this.setRank();
    }
    private btnAction():void{
        this.leftBtn.runAction(cc.spawn(cc.moveBy(.3, cc.v2(-100, 0)).easing(cc.easeBackOut()), cc.fadeIn(.3)));
        this.rightBtn.runAction(cc.spawn(cc.moveBy(.3, cc.v2(100, 0)).easing(cc.easeBackOut()), cc.fadeIn(.3)));
    }

    private onCloseBtn(): void {
        startExterior.getInstance().uiSys.closePanel(this.getSkinName());
        AudioManager.getInstance().playSound(AudioType.CLICK);
    }
    private onLeftBtn():void{
        this.lastPage();
    }
    private onRightBtn():void{
        this.nextPage();
    }

    onDestroy(): void {
        if(GameLoop.getInstance().platform != null)
            GameLoop.getInstance().platform.isNeedLoadRank = false;
        this.closeBtn.off("touchend", this.onCloseBtn, this);
        this.leftBtn.off("touchend", this.onLeftBtn, this);
        this.rightBtn.off("touchend", this.onRightBtn, this);
    }
}
