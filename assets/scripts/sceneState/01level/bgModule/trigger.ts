import { mainExterior } from "../mainExterior";
import { levelThreeExterior } from "../../03level/levelThreeExterior";
import { GameLoop } from "../../../GameLoop";
import { levelTwoExterior } from "../../02level/levelTwoExterior";

const {ccclass, property} = cc._decorator;

@ccclass
export class trigger extends cc.Component {

    @property(cc.Node)
    public mask: cc.Node = null;
    @property(cc.Node)
    public b1: cc.Node = null;
    @property(cc.Node)
    public b2: cc.Node = null;

    onCollisionEnter(other, self) {
        if(other.tag === 10){//玩家
            this.clearMask();
        }else if(other.tag === 7){
            if(GameLoop.getInstance().currIndex == 0){
                mainExterior.getInstance().stop();
                mainExterior.getInstance().pyCtrl.complete();
            }
            else if(GameLoop.getInstance().currIndex == 1){
                levelTwoExterior.getInstance().stop();
                levelTwoExterior.getInstance().pyCtrl.complete();
            }
            else if(GameLoop.getInstance().currIndex == 2){
                levelThreeExterior.getInstance().stop();
                levelThreeExterior.getInstance().pyCtrl.complete();
            }
        }
    }

    private clearMask():void{
        if(this.mask == null)return;
        this.mask.runAction(
            cc.sequence(
                cc.delayTime(.3),
                cc.fadeOut(0.2)
            )
        );
        if(this.b1 == null)return;
        this.b1.runAction(cc.fadeIn(.2));
        this.b2.runAction(cc.fadeIn(.2));
        mainExterior.getInstance().pyCtrl.zoomOut();
        mainExterior.getInstance().zoomOut();

        mainExterior.getInstance().decelerate();
    }
}
