import { IBgModule } from "./IBgModule";

const {ccclass, property} = cc._decorator;

@ccclass
export class forwardBg extends IBgModule {

    update(dt){
        super.update(dt);
        this.checkIsNext();
    }
}
