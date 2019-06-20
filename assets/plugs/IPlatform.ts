export class IPlatform {

    public liuhai: number = 0;           //设备刘海高度

    public init(): void {

    }
    public setUserCloudStorage(KVData: Array<{ key: string, value: string }>): void { }
    /**
     * 场景id: 1/2/3
     * 分数值
     */
    public saveFile(sc: number, score: string): void { }
    public shareAppMessage(): void { }
    public showToast(context: string, icon: number, isMask: boolean = true): void { }
    public hideToast(): void { }
    public showLoading(context: string, isMask: boolean = true): void { }
    public hideLoading(): void { }
    public showModal(tip:string, context:string, trueCall, falseCall):void{}

    public postMessageToOpenDataContext(data: any): void { }
    public requestNet(): void { }

    public onShow(callback: (res) => void): void { }
    public onHide(callback: (res) => void): void { }
    public offShow(callback: (res) => void): void { }
    public offHide(callback: (res) => void): void { }
}

export class WeChatPlatform extends IPlatform {

    private _canvas = null;

    public init(): void {
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

            cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, texture) => {
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
    public setUserCloudStorage(KVData: Array<{ key: string, value: string }>): void {
        console.log("setUserCloudStorage")
        this.postMessageToOpenDataContext({ k: `${KVData[0].key}`, v: `${KVData[0].value}` })
        /*         wx.setUserCloudStorage({
                    KVDataList:KVData,
                    success:()=>{
                        console.log("上传数据成功！")
                    },
                    fail:()=>{
                        console.log("上传数据失败！")
                    },
                    complete:()=>{}
                }) */
    }
    // 加载资源----step1
    public saveFile(sc: number, score: string): boolean {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.showToast("海报生成中...", 1);

            const ths = this;

            // img: 图片保存对象; src: 图片资源路径
            let url: string = `https://cdn.duligame.cn/minigame-fendi/imgs/scene_${sc}.png`;
            let imgArr = [
                { img: null, src: url },
            ]
            let compNum = 0; // 成功加载资源数量

            // 单个资源加载成功回调
            let successFn = () => {
                compNum++;
                if (compNum == imgArr.length) {
                    ths.drawImg(imgArr, score);
                }
            };

            // 单个资源加载失败回调
            let failFn = () => {
                ths.failSave();
            };

            try {
                for (let i = 0; i < imgArr.length; i++) {
                    imgArr[i].img = wx.createImage();
                    imgArr[i].img.src = imgArr[i].src;
                    imgArr[i].img.onload = successFn;
                    imgArr[i].img.onerror = failFn;
                }
            } catch (e) {
                console.log('报错:', e)
            }
        } else {
            console.log('it not wechat');
            return false;
        }
    }
    public shareAppMessage(): void {
        console.log("shareAppMessage")
        wx.shareAppMessage({
            title: "想与我一起探索“FENDI 罗马奇遇记” 吗?",
            imageUrl: "https://cdn.duligame.cn/minigame-fendi/imgs/share.jpg"
        })
    }
    public showToast(context: string, icon: number, isMask: boolean = true): void {
        let iconStr: string = "";
        iconStr = (icon == 0) ? "success" : (icon == 1) ? "loading" : "none";
        wx.showToast({
            title: context,
            icon: iconStr,
            duration: 2000,
            mask: isMask
        })
    }
    public hideToast(): void {
        wx.hideToast();
    }
    public showLoading(context: string, isMask: boolean = true): void {
        wx.showLoading({
            title: context,
            mask: isMask
        })

    }
    public hideLoading(): void {
        wx.hideLoading();
    }
    public showModal(tip:string, context:string, trueCall, falseCall):void{
        wx.showModal({
            title: tip,
            content: context,
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                trueCall();
              } else if (res.cancel) {
                console.log('用户点击取消')
                falseCall();
              }
            }
          })
    }
    /**向开放数据域传递消息 */
    public postMessageToOpenDataContext(data: any): void {
        wx.getOpenDataContext().postMessage(data);
    }
    public requestNet(): void {
        let self = this;
        //console.log("==userLogins==")
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        url: 'https://wxfendi.duligame.cn/Login',
                        data: {
                            code: res.code,
                        },
                        success(res) {
                            //Global.session = res.data.data
                            self.postMessageToOpenDataContext({ k: "openid", v: res.data.data.openid })
                            console.log(res.data)
                        },
                        fail() {

                        }
                    })
                }
            }
        });
        /*         wx.request({
                    url: 'https://wxfendi.duligame.cn/Login',
                    data: {
                        code: '',
                    },
                    success(res) {
                        let session = res.data
                        console.log(res.data)
                    },
                    fail() {
        
                    }
                }) */
    }

    public onShow(callback: (res) => void): void {
        wx.onShow(callback);
    }
    public onHide(callback: (res) => void): void {
        wx.onHide(callback);
    }
    public offShow(callback: (res) => void): void {
        wx.offShow(callback)
    }
    public offHide(callback: (res) => void): void {
        wx.offHide(callback);
    }
    // 拼接海报----step2
    private drawImg(arr, score) {
        const ths = this;

        try {
            let canvas = null;
            if (ths._canvas) {
                ths.clearCanvas();
                canvas = ths._canvas; // 清空画布
            } else {
                ths._canvas = canvas = wx.createCanvas();// 创建canvas
            };
            let context = canvas.getContext('2d');

            canvas.width = arr[0].img.width; // 设置画布宽（第一张图默认背景图）或者自己设置
            canvas.height = arr[0].img.height; // 设置画布高（第一张图默认背景图）或者自己设置
            context.font = '70px 微软雅黑'; //设置字体
            context.fillStyle = '#c67861'; //设置字体的颜色
            context.textAlign = "center";
            context.drawImage(arr[0].img, 0, 0, arr[0].img.width, arr[0].img.height); // 绘制图片上去  （所绘制图片资源,x,y,width,height）
            context.fillText(score, canvas.width * .5, 425, canvas.width);// 绘制文字上去  （文字,x,y,width）

            this.canvasToImg(canvas);
        } catch (e) {
            console.log('drawImg error:', e);
        }
    }

    // canvas转换图片---- step3
    private canvasToImg(canvas) {
        try {
            canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
                destWidth: canvas.width,
                destHeight: canvas.height,
                fileType: 'png',
                quality: 1,
                success: (e) => {
                    console.log('保存路径成功:', e.tempFilePath);
                    //this.hideToast();
                    this.getPhotosAlbum(e.tempFilePath)

                },
                fail: (e) => {
                    console.log('保存路径失败:', e)
                }
            });
        } catch (e) {
            console.log('canvas转图片失败:', e)
        }
    }

    // wx获取授权----step4
    private getPhotosAlbum(path) {
        wx.authorize({
            scope: "scope.writePhotosAlbum",

            success: () => {
                console.log('获取授权成功')
                this.savePicture(path);
            },

            fail: () => {
                console.log('获取授权失败')
            }
        })
    }

    // 保存成功----step5
    private savePicture(path) {
        let self = this;
        wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
                self.showToast("海报已保存至相册", 0)
                /*                 setTimeout(function () {
                                    wx.hideToast();
                                  }, 2000) */
                console.log('保存成功');
            },
            fail(e) {
                console.log('保存失败:', e);
            }
        })
    }

    // 清空canvas
    private clearCanvas() {
        let ctx = this._canvas.getContext('2d');

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    // 加载资源失败
    private failSave() {
        console.log('保存失败');
    }
}

export class QQPlay extends IPlatform {

}
