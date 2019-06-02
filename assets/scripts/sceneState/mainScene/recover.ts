const {ccclass, property} = cc._decorator;

@ccclass
export class recover extends cc.Component {

        /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter (other:any, self:any) {
        if(other.tag == 10){
            //TODO gameOver
        }
    }
}
