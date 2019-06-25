
const {ccclass, property} = cc._decorator;

@ccclass
export class rankItem extends cc.Component {

    @property({type:cc.Float})
    index:number = 0;

    @property({type:[cc.SpriteFrame]})
    spList:Array<cc.SpriteFrame> = [];

    @property(cc.Label)
    rankStr: cc.Label = null;

    @property(cc.Sprite)
    avatar: cc.Sprite = null;

    @property(cc.Label)
    userName:cc.Label = null;

    @property(cc.Label)
    score:cc.Label = null;

    public init(rankStr:number, avatar:string, userName:string, score:string, isSelf:boolean = false):void{
        let self = this;
        if(rankStr < 4){
            this.rankStr.string = '';
            if(isSelf){
                if(rankStr < 0){
                    this.rankStr.string = "未上榜";
                }else{
                    let sp:cc.Sprite = this.rankStr.getComponentInChildren(cc.Sprite);
                    sp.enabled = true;
                    sp.spriteFrame = this.spList[rankStr - 1];
                }
            }else{
                if(this.index < 3)
                    this.rankStr.getComponentInChildren(cc.Sprite).enabled = true;                    
            }
        }else{
            this.rankStr.string = `${rankStr}`;
            if(this.index < 3)
                this.rankStr.getComponentInChildren(cc.Sprite).enabled = false;
        }
        cc.loader.load({ url: avatar, type: 'png' }, (err, texture) => {
            if (err) {
                console.error(err);
                return;
            }
            self.avatar.spriteFrame = new cc.SpriteFrame(texture);
        });
        this.userName.string = userName;
        this.score.string = score;
    }

}
