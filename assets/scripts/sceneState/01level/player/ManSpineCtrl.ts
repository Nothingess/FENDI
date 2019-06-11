import { ISpineCtrl } from "./ISpineCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export class ManSpineCtrl extends ISpineCtrl {

    start():void{
        this._setMix("nanren_pao", "nanren_tiao", 0.2);
        this._setMix("nanren_pao", "nanren_xiatan", 0.1);
    }

    public jump():void{
        this.spine.setAnimation(0, "nanren_tiao", false);
        super.jump();
    }
    public squat():void{
        this.spine.setAnimation(0, "nanren_xiatan", true);
        super.squat();
    }
    public run():void{
        this.spine.setAnimation(0, "nanren_pao", true);
        super.run();
    }
}
