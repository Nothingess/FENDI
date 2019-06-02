export class AudioManager {
    private constructor(){}
    private static _instance:AudioManager = null;
    public static getInstance():AudioManager{
        if(this._instance == null)
            this._instance = new AudioManager();
        return this._instance;
    }

    private bgm:string = "";

    public playSound(soundName: string, loop?: boolean, volume?: number)
    {
/*         if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        {
            return;
        } */
        //TODO判断全局变量是否静音
        let path = GlobalVar.ConstVal.AUDIO_DIR + soundName;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if(err)
            {
                cc.error(err);
                return;
            }
		    var audioID = cc.audioEngine.play(clip, loop?loop:false, volume?volume:1);
		});
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
