
const {ccclass, property} = cc._decorator;

@ccclass
export class settingBtnSp extends cc.Component {

    @property(cc.SpriteFrame)
    public bgs: Array<cc.SpriteFrame> = [];

}
