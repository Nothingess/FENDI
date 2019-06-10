const { ccclass, property } = cc._decorator;

@ccclass
export class Loads extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

/*     @property(cc.Node)
    loadMaskN: cc.Node = null;

    @property(cc.Node)
    loadSprN: cc.Node = null;

    @property(cc.Node)
    connectFailN: cc.Node = null;

    progress: any; */

    onLoad() {
        //this.connectFailN.active = false;
    }

    start() {
        this.loadAllRes();
    }

    loadAllRes() {
        //加载all文件夹中资源
        cc.loader.loadResDir("all", this.progressCallback.bind(this), this.completeCallback.bind(this));
    }

    progressCallback(completedCount: any, totalCount: any, res: any) {
        // console.log("completedCount", completedCount);
        // console.log("totalCount", totalCount);
/*         this.progress = completedCount / totalCount;
        let progs = Math.floor(this.progress * 100);
        this.loadMaskN.width = this.progress * this.loadSprN.width; */
    }

    completeCallback(error, res) {
        console.log("==========加载资源完毕============");
    }
}
