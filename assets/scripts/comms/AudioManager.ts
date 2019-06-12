import { GameLoop } from "../GameLoop";

/**音效索引 */
export enum AudioType{
    /**点击 */
    CLICK,
    /**获取金币 */
    GLOD,
    /**失败 */
    LOST,
    /**障碍物-男 */
    OBSMAN,
    /**障碍物-女 */
    OBSWOMAN,
    /**胜利 */
    WIN
}

export class AudioManager {
    private constructor(){}
    private static _instance:AudioManager = null;
    public static getInstance():AudioManager{
        if(this._instance == null)
            this._instance = new AudioManager();
        return this._instance;
    }

    private bgm:string = "";

    public playSound(type: AudioType, loop?: boolean, volume?: number)
    {
/*         if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        {
            return;
        } */
        //TODO判断全局变量是否静音
/*         let path = GlobalVar.ConstVal.AUDIO_DIR + soundName;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    var audioID = cc.audioEngine.play(clip, loop?loop:false, volume?volume:1);
        }); */
        cc.audioEngine.play(GameLoop.getInstance().audios[type], loop?loop:false, volume?volume:1);
    }

    public stopAll()
    {
        cc.audioEngine.stopAll();
    }

    public pauseAll()
    {
        cc.audioEngine.pauseAll();
    }

    public resumeAll()
    {
        cc.audioEngine.resumeAll();
    }

    public playBGM(soundName: string)
    {
        if(this.bgm == soundName)
        {
            return;
        }
        this.bgm = soundName;
/*         if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        {
            return;
        } */
        cc.audioEngine.stopMusic();
        let path = GlobalVar.ConstVal.AUDIO_DIR + soundName;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    cc.audioEngine.playMusic(clip, true);
		});
    }

    public resumeBGM()
    {
        cc.audioEngine.stopMusic();
        let path = GlobalVar.ConstVal.AUDIO_DIR + this.bgm;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    cc.audioEngine.playMusic(clip, true);
		});
    }
}
