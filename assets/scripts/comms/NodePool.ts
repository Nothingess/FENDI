export class NodePool {

    constructor(){
        this.list = new Array<cc.Node>();
    }

    private list:Array<cc.Node> = null;
    /**向对象池里添加元素 */
    public put(node:cc.Node):void{
        node.parent = null;
        this.list.push(node);
    }
    /**按顺序获取元素 */
    public get():cc.Node{
        return this.list.shift();
    }
    /**随机获取元素 */
    public getRand():cc.Node{
        let ran:number = Math.floor(Math.random() * this.list.length);
        return this.list.splice(ran, 1)[0];
    }
    /**获取对象池大小 */
    public size():number{
        return this.list.length;
    }
    /**清除对象池 */
    public clear():void{
        this.list.forEach(e=>{e.destroy()})
        this.list = [];
    }

}
