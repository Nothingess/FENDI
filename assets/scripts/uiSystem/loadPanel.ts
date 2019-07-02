import { IUIBase, PanelLayer } from "../uiSystem/IUIBase";
import { strateC } from "../uiSystem/openAction/IOpenStrategy";
import { GameLoop } from "../GameLoop";

const { ccclass, property } = cc._decorator;

@ccclass
export class loadPanel extends IUIBase {

    private pro: cc.Sprite = null;
    private mark: cc.Node = null;
    private txt: cc.Label = null;
    private loadScene: string = "";

    private speed: number = .5;
    private currPro: number = 0;
    private maxPro: number = 0;
    private isComplete: boolean = false;

    private isAlreadyLoadScene: boolean = false;     //是否已经切换场景

    private level_1:Array<string> = new Array<string>();
    private level_2:Array<string> = new Array<string>();
    private level_3:Array<string> = new Array<string>();
    private level_4:Array<string> = new Array<string>();

    public initStrategy(): void {
        this.mOpenStrategy = new strateC(this.skin);
    }
    public init(params?: any[]): void {
        super.init(params);
        this.skinPath = "loadPanel";
        this.layer = PanelLayer.funcPanel;
    }

    update(dt): void {
        if (this.isComplete && this.currPro >= 1) {
            if (this.isAlreadyLoadScene) return;
            this.isAlreadyLoadScene = true;
            if (this.loadScene == "01level") {
                this.args[1].setMainState();
            } else if (this.loadScene == "02level") {
                this.args[1].setLevel_2State();
            } else if (this.loadScene == "03level") {
                this.args[1].setLevel_3State();
            }
            else if (this.loadScene == "04level") {
                this.args[1].setLevel_4State();
            }
            else if (this.loadScene == "01startScene") {
                this.args[1].gotoStartState();
            }
        }
        if (this.currPro < this.maxPro) {
            this.currPro += dt * this.speed;

            this.pro.fillRange = this.currPro;
            this.mark.x = this.pro.node.width * this.pro.fillRange;
            this.txt.string = `${(this.pro.fillRange * 100).toFixed(2)}%`;
        }
    }

    public onShowing(): void {
        super.onShowing();
        this.initComponent();
    }
    public initComponent(): void {
        this.level_1 = [
            "prefabs/bgModule/01level/01screen_2",
            "prefabs/bgModule/01level/01screen_3",
            "prefabs/bgModule/01level/01screen_4",
            "prefabs/bgModule/01level/01screen_5",
            "prefabs/bgModule/01level/01screen_6",
            "prefabs/bgModule/01level/01screen_7",
            "prefabs/bgModule/01level/01screen_g2",
            "prefabs/bgModule/01level/01screen_g3",
            "prefabs/bgModule/01level/01screen_g4",
            "jsons/bgm_1",
            "prefabs/obstacle/fountain",
            "prefabs/manRole",
            "prefabs/womanRole"
        ]
        this.level_2 = [
            "prefabs/bgModule/02level/02screen_2",
            "prefabs/bgModule/02level/02screen_3",
            "prefabs/bgModule/02level/02screen_4",
            "prefabs/bgModule/02level/02screen_5",
            "prefabs/bgModule/02level/02screen_6",
            "prefabs/bgModule/02level/02screen_7",
            "prefabs/bgModule/02level/02screen_8",
            "prefabs/bgModule/02level/02screen_9",
            "prefabs/bgModule/02level/02screen_10",
            "prefabs/bgModule/02level/02screen_11",
            "prefabs/manRole",
            "prefabs/womanRole",
            "prefabs/other/jinbichufa"
        ]
        this.level_3 = [
            "prefabs/bgModule/03level/screen_2",
            "prefabs/bgModule/03level/screen_3",
            "prefabs/bgModule/03level/screen_4",
            "prefabs/bgModule/03level/screen_5",
            "prefabs/bgModule/03level/screen_6",
            "prefabs/bgModule/03level/screen_7",
            "prefabs/manFly",
            "prefabs/womanFly"
        ]
        this.level_4 = [
            "prefabs/bgModule/04level/04screen_2",
            "prefabs/bgModule/04level/04screen_3",
            "prefabs/bgModule/04level/04screen_4",
            "prefabs/bgModule/04level/04screen_5",
            "prefabs/bgModule/04level/04screen_6",
            "prefabs/bgModule/04level/04screen_7",
            "prefabs/bgModule/04level/04screen_8",
            "prefabs/bgModule/04level/04screen_9",
            "prefabs/bgModule/04level/04screen_10",
        ]


        this.pro = cc.find("pro/bar", this.skin).getComponent(cc.Sprite);
        this.mark = cc.find("pro/bar/mark", this.skin);
        this.txt = this.mark.getComponentInChildren(cc.Label);

        if (!!this.args) {
            if (this.args[2] != null) {
                this.speed = this.args[2];
            }
        }

    }

    public onShowed(): void {
        this.load(this.args[0]);
    }

    private load(name: string): void {
        this.loadScene = name;
        this.releaseOldRes();
        let newPath: Array<string> = null;
        if (this.loadScene == "01level") {
            newPath = this.level_1;
        } else if (this.loadScene == "02level") {
            newPath = this.level_2;
        } else if (this.loadScene == "03level") {
            newPath = this.level_3;
        }

        GameLoop.getInstance().resUrl = newPath;

        cc.director.preloadScene(name, this.onProgress.bind(this), this.complete.bind(this));
    }

    private onProgress(com: number, total: number, item: any): void {
        if ((com / total) > this.maxPro)
            this.maxPro = com / total;
    }
    private complete(): void {
        if (this.loadScene == "01level") {
            cc.loader.loadResArray(this.level_1, this.loadResProgress.bind(this), this.loadResComplete.bind(this));
        } else if (this.loadScene == "02level") {
            cc.loader.loadResArray(this.level_2, this.loadResProgress.bind(this), this.loadLevel_2Complete.bind(this));
        } else if (this.loadScene == "03level") {
            cc.loader.loadResArray(this.level_3, this.loadResProgress.bind(this), this.loadLevel_3Complete.bind(this));
        }
        else if (this.loadScene == "04level") {
            cc.loader.loadResArray(this.level_4, this.loadResProgress.bind(this), this.loadLevel_4Complete.bind(this));
        }
        else if (this.loadScene == "01startScene") {
            GameLoop.getInstance().buildNode = [];
            GameLoop.getInstance().groundNode = [];

            this.isComplete = true;
        }
    }
    private loadResProgress(com: number, total: number, item: any): void {
        if ((com / total) > this.maxPro)
            this.maxPro = com / total;
    }
    private loadResComplete(err, res): void {
        if (err) {
            console.log("loadPanel res fail", err);
            return;
        }
        let count: number = 0;
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));

        while (count < 3) {
            for (let i = 1; i < 4; i++) {
                GameLoop.getInstance().buildNode.push(cc.instantiate(res[i]));
            }
            count++;
        }
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[4]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[5]));

        count = 0;
        while (count < 3) {
            for (let i = 6; i < 8; i++) {
                GameLoop.getInstance().groundNode.push(cc.instantiate(res[i]))
            }
            count++;
        }

        GameLoop.getInstance().groundNode.push(cc.instantiate(res[8]));

        this.isComplete = true;

    }
    private loadLevel_2Complete(err, res): void {
        if (err) {
            console.log("loadPanel res fail", err);
            return;
        }
        let count: number = 0;
        res.forEach(element => {
            if (count < 9)
                GameLoop.getInstance().buildNode.push(cc.instantiate(element));
            count++;
        });
        count = 0;
        res.forEach(element => {
            if (count < 9)
                GameLoop.getInstance().buildNode.push(cc.instantiate(element));
            count++;
        });
        /*         count = 0;
                res.forEach(element => {
                    if(count < 3)
                        GameLoop.getInstance().buildNode.push(cc.instantiate(element));
                    count++;
                }); */
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[9]));
        this.isComplete = true;
    }
    private loadLevel_3Complete(err, res): void {
        if (err) {
            console.log("loadPanel res fail", err);
            return;
        }
        let count: number = 0;
        res.forEach(element => {
            if (count < 5)
                GameLoop.getInstance().buildNode.push(cc.instantiate(element));
            count++;
        });
        count = 0;
        res.forEach(element => {
            if (count < 5)
                GameLoop.getInstance().buildNode.push(cc.instantiate(element));
            count++;
        });
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[5]));
        this.isComplete = true;
    }
    private loadLevel_4Complete(err, res): void {
        if (err) {
            console.log("loadPanel res fail", err);
            return;
        }

        GameLoop.getInstance().buildNode.push(cc.instantiate(res[0]));

        let count: number = 0;
        let index: number = 0;
        while (count < 3) {
/*             res.forEach(element => {
                if (index < 6)
                    GameLoop.getInstance().buildNode.push(cc.instantiate(element));
                index++;
            }); */

            for(let i = 1; i < 6; i++){
                GameLoop.getInstance().buildNode.push(cc.instantiate(res[i]));
            }

            count++;
            //index = 0;
        }
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[6]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[7]));
        GameLoop.getInstance().buildNode.push(cc.instantiate(res[8]));
        this.isComplete = true;
    }

    private releaseOldRes(): void {
        if (GameLoop.getInstance().resUrl != null) {
            cc.loader.release(GameLoop.getInstance().resUrl);
        }
    }
}
