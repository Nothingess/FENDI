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
    WIN,
    BGM_1,
    BGM_2,
    BGM_3,
    BGM_CAT,
    BGM_4,
    UNLOCK
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
        if(GameLoop.getInstance().isMuteAudio)return;
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
        cc.audioEngine.play(GameLoop.getInstance().audios[type], loop?loop:false, volume?volume:.5);
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
        this.playSound(AudioType.CLICK, false, 0);
    }

    public playBGM(aty:AudioType)
    {
/*         if(this.bgm == soundName)
        {
            return;
        }
        this.bgm = soundName;
        if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        {
            return;
        }
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
        }); */
        
        if(GameLoop.getInstance().isMuteAudio)return;
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(GameLoop.getInstance().audios[aty], true);
    }
    public stopBgm():void{
        cc.audioEngine.stopMusic();
    }
    public pauseMusic():void{
        if(cc.audioEngine.isMusicPlaying())
            cc.audioEngine.pauseMusic();
    }
    public resumeBGM()
    {
/*         cc.audioEngine.stopMusic();
        let path = GlobalVar.ConstVal.AUDIO_DIR + this.bgm;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    cc.audioEngine.playMusic(clip, true);
        }); */
        if(!cc.audioEngine.isMusicPlaying()){
            cc.audioEngine.resumeMusic();
        }
    }
}
