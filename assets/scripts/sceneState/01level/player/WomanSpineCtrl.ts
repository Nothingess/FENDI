import { ISpineCtrl } from "./ISpineCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export class WomanSpineCtrl extends ISpineCtrl {

    start():void{
        this._setMix("nvren_pao", "nvren_tiao", 0.2);
        this._setMix("nvren_pao", "nvren_xiatan", 0.1);
    }

    public jump():void{
        this.spine.setAnimation(0, "nvren_tiao", false);
        super.jump();
    }
    public squat():void{
        this.spine.setAnimation(0, "nvren_xiatan", true);
        super.squat();
    }
    public run():void{
        this.spine.setAnimation(0, "nvren_pao", true);
        super.run();
    }
}
