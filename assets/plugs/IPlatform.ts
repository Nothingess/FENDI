export class IPlatform {

    public liuhai:number = 0;           //设备刘海高度
    
    public init () : void {

    }
    public setUserCloudStorage(KVData:Array<{key:string, value:string}>):void{}
}

export class WeChatPlatform extends IPlatform {

    public init():void{
        if (typeof wx === 'undefined') return;
 
        let systemInfo = wx.getSystemInfoSync();
        this.liuhai = systemInfo.statusBarHeight;           //后面可存为全局数据信息
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });
 
        button.onTap((res) => {
            let userInfo = res.userInfo;
            if (!userInfo) {
                //this.tips.string = res.errMsg;
                return;
            }
 
            cc.loader.load({url: userInfo.avatarUrl, type: 'png'}, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                //this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });
 
/*             wx.getOpenDataContext().postMessage({
                message: "User info get success."
            }); */
 
/*             this.wxSubContextView.runAction(this._showAction);
            this._isShow = true; */
 
            button.hide();
            button.destroy();
        });
    }

    public setUserCloudStorage(KVData:Array<{key:string, value:string}>):void{
        wx.setUserCloudStorage({
            KVDataList:KVData,
            success:()=>{
                console.log("上传数据成功！")
            },
            fail:()=>{
                console.log("上传数据失败！")
            },
            complete:()=>{}
        })
    }
}

export class QQPlay extends IPlatform{

}
