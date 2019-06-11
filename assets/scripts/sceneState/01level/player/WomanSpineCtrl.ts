import { ISpineCtrl } from "./ISpineCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export class WomanSpineCtrl extends ISpineCtrl {

    start():void{
        this._setMix("nvren_pao", "nvren_tiao", 0.2);
        this._setMix("nvren_pao", "nvren_xiatan", 0.1);
        this._setMix("nvren__motuocherun", "nvren_motuochetiao", 0.2);
        this._setMix("nvren__motuocherun", "nvren_motuochexiahua", 0.1);
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

    public motuo_jump():void{
        this.spine.setAnimation(0, "nvren_motuochetiao", false);
        super.motuo_jump();
    }
    public motuo_squat():void{
        this.spine.setAnimation(0, "nvren_motuochexiahua", false);
        super.motuo_squat();
    }
    public motuo_run():void{
        this.spine.setAnimation(0, "nvren__motuocherun", true);
        super.motuo_run();
    }
}
