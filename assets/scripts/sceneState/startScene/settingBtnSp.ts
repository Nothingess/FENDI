
const {ccclass, property} = cc._decorator;

@ccclass
export class settingBtnSp extends cc.Component {
    @property(cc.SpriteFrame)
    public close: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    public open: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    public bgs: Array<cc.SpriteFrame> = [];

}
