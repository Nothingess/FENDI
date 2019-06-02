import { ISceneState } from "./ISceneState";

export class SceneController {

    private mSceneState:ISceneState = null;     //当前的场景状态
    private isLoadComplete:boolean = false;     //场景是否加载完成
    private isRunStart:boolean = false;         //是否运行过StateStart()方法，确保StateStart()只调用一次

    /**
     * 设置当前场景状态
     * @param sceneState 目标场景状态
     * @param isLoadScene 是否需要切换场景（默认需要）
     */
    public setState(sceneState:ISceneState, isLoadScene:boolean = true){
        if(this.mSceneState != null){
            this.mSceneState.stateEnd();
        }
        this.mSceneState = sceneState;
        if(isLoadScene){
            //TODO 通知场景管理器切换场景
            this.isLoadComplete = false;
            cc.director.loadScene(this.mSceneState.getSceneName(), ()=>{
                this.isLoadComplete = true;
            });
            this.isRunStart = false;
        }else{
            this.mSceneState.stateStart();
            this.isRunStart = true;
            this.isLoadComplete = true;
        }
    }
    /**状态更新 */
    public stateUpdate():void{
        if(!this.isLoadComplete) return;
        if(!this.isRunStart){
            this.mSceneState.stateStart();
            this.isRunStart = true;
        }
        if(this.mSceneState != null)
            this.mSceneState.stateUpdate();
    }
    /**状态结束 */
    public stateEnd():void{
        this.mSceneState.stateEnd();
    }
}
