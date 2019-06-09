/**资源加载策略 */
export class Loader {

    private constructor(){}
    private static _instance:Loader = null;
    public static getInstance():Loader{
        if(Loader._instance == null)
            Loader._instance = new Loader();
        return Loader._instance;
    }

    private mIsComplete:boolean = false;        //资源是否加载完成
    private assets:any[] = [];                  //场景中用到的动态资源

    /**动态加载资源 */
    public loader():void{
        cc.loader.loadResArray(paths, (e, res:any[])=>{
            if(e){
                console.error("Loader.loader is fail !");
                return;
            }
            this.assets = res;
            this.mIsComplete = true;
        })
    }

    public isLoadComplete():boolean{
        return this.mIsComplete;
    }

    /**即时释放资源的加载方式 */
    public loadInstantFree(path:string, callback:(asset)=>void):void{
        cc.loader.loadRes(path, (e, res)=>{
            if(e){
                console.log(e);
                return;
            }
            callback(res);
            cc.loader.release(res);
        });
    }
    public loadInstance(path:string, callback:(asset)=>void):void{
        cc.loader.loadRes(path, (e, res)=>{
            if(e){
                console.log(e);
                return;
            }
            callback(res);
        });
    }
    /**释放资源 */
    public release():void{
        cc.loader.release(paths);
        this.mIsComplete = false;
    }
    /**通过索引查找资源 */
    public getAssetByIndex(index:Assets):any{
        return this.assets[index];
    }
}

const paths:Array<string> = [
    "ui/FENDIUI"
]
export enum Assets{
    /**脑力游戏格子预制 */
    Grid,
}