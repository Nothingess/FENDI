export class IPlatform {

    public liuhai: number = 0;           //设备刘海高度
    public nickName: string = "";         //用户名称
    public avtarUrl: string = "";
    public avtarTex:cc.Texture2D = null;

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
    public showModal(tip: string, context: string, trueCall, falseCall): void { }

    public postMessageToOpenDataContext(data: any): void { }
    public requestNet(): void { }
    public getUnionid(): void { }
    public updateScore(sc: number, lv: number): void { }
    public getRank(call:Function): void { }
    public uploadScoreToServ(val: number): void { }
    public getScoreFromServ(): void { }
    public onShow(callback: (res) => void): void { }
    public onHide(callback: (res) => void): void { }
    public offShow(callback: (res) => void): void { }
    public offHide(callback: (res) => void): void { }
    public showShareMenu(): void { }
}

export class WeChatPlatform extends IPlatform {

    private _canvas = null;
    private updateManager = null;
    private session_key = null;

    public init(): void {
        if (typeof wx === 'undefined') return;
        wx.setPreferredFramesPerSecond(60);
        setInterval(()=>{wx.triggerGC();}, 10000)               //每30秒加快触发一次没存回收
        let self = this;
        this.updateManager = wx.getUpdateManager();
        this.updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(`检查是否有新的版本：${res.hasUpdate}`)
        })
        this.updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        self.updateManager.applyUpdate()
                    }
                }
            })
        })
        this.updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            console.log("新版本下载失败！")
        })

        this.showShareMenu();
        this.requestNet();
        this.getUnionid();

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
            self.nickName = userInfo.nickName;
            self.avtarUrl = userInfo.avatarUrl;
            cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                self.avtarTex = texture;
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
            let url: string = `https://wx.duligame.cn/fendi/imgs/scene_${sc}.png`;
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
            imageUrl: "https://wx.duligame.cn/fendi/imgs/share.jpg"
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
    public showModal(tip: string, context: string, trueCall, falseCall): void {
        wx.showModal({
            title: tip,
            content: context,
            success(res) {
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
    public requestNet(call?:Function): void {
        let self = this;
        console.log("==userLogins==");
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
                            self.session_key = res.data.data.session_key;
                            self.postMessageToOpenDataContext({ k: "openid", v: res.data.data.openid })
                            if(!!call)
                                call();
                            console.log(res.data)
                        },
                        fail() {
                            self.requestNet(call);
                        }
                    })
                }
            }
        });
    }
    //#region 登陆流程
    //#endregion
    public getUnionid(): void {
        let self = this;
        let LoginError = function () {
            console.log('LoginError')
        }
        let LoginSuccess = function () {
            console.log('LoginSuccess')
        }
        let LoginFail = function () {
            console.log('LoginFail');
        }
        let BindUserInfo = function (encryptedData, iv, session_key) {
            wx.request({
                url: 'https://wxfendi.duligame.cn/BindUserInfo',
                data: {
                    encryptedData: encryptedData,
                    iv: iv,
                    session_key: session_key,
                },
                success: function (res) {
                    console.log(res)
                    LoginSuccess()
                },
                fail: function () {
                    console.log("BindUserInfo", "fail")
                    LoginFail()
                },
            })
        }

        let getUserInfo = function () {
            wx.getUserInfo({
                withCredentials: true,
                lang: "zh_CN",
                success: function (res) {
                    console.log("wx.getUserInfo", "success", res)
                    BindUserInfo(res.encryptedData, res.iv, session_key)
                },
                fail: function () {
                    console.log("wx.getUserInfo", "fail")
                    LoginFail()
                },
            })
        }

        let noUnionId = function () {
            wx.getSetting({
                success: function (res) {
                    console.log(res.authSetting)
                    if (!res.authSetting['scope.userInfo']) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: function () {
                                getUserInfo()
                            },
                            fail: function () {
                                console.log("wx.authorize", "fail")
                                LoginFail()
                            }
                        })
                    } else {
                        getUserInfo()
                    }
                },
                fail: function () {
                    console.log("wx.getSetting", "fail")
                    LoginFail()
                }
            })
        }

        let login = function () {
            console.log("login")
            wx.login({
                success: function (res) {
                    console.log("res.code", res.code)
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://wxfendi.duligame.cn/Login',
                            data: {
                                code: res.code
                            },
                            success: function (res) {
                                console.log(res)
                                session_key = res.data.data.session_key
                                self.session_key = session_key;
                                wx.setStorageSync("session_key", session_key)
                                if (res.data.data.unionid == "") {
                                    noUnionId()
                                } else {
                                    LoginSuccess()
                                }
                            },
                            fail: function () {
                                console.log("wx.request", "Login", "fail")
                                LoginFail()
                            }
                        })
                    }
                },
                fail: function () {
                    console.log("wx.login", "fail")
                    LoginError()
                }
            })
        }
        let session_key = wx.getStorageSync("session_key")
        console.log("getStorageSync", "session_key", session_key, session_key != "")
        if (session_key != "") {
            wx.checkSession({
                success() {
                    //session_key 未过期，并且在本生命周期一直有效
                    self.session_key = session_key;
                    console.log("wx.checkSession", "success")
                    LoginSuccess()
                },
                fail() {
                    console.log("wx.checkSession", "fail")
                    // session_key 已经失效，需要重新执行登录流程
                    login()
                }
            })
        } else {
            login()
        }
    }
    public updateScore(sc: number, lv: number): void {
        let self = this;
        if(this.session_key == null){
            //this.requestNet(this.getRank);
            self.getUnionid();
            return;
        }
        wx.checkSession({
            success() {
                //session_key 未过期，并且在本生命周期一直有效
                wx.request({
                    url: 'https://wxfendi.duligame.cn/UpdateScore',
                    data: {
                        session: self.session_key,
                        score: sc, //得分
                        level: lv, //关卡 可选值 0,1,2,3
                        name: self.nickName,
                        avatar: self.avtarUrl
                    },
                    success: function (res) {
                        console.log("UpdateScore", "success", res)
                        if (res.data.err) {
                            //login()
                        }
                    },
                    fail: function () {
                        console.log("UpdateScore", "fail")
                        this.updateScore(sc, lv);
                    },
                })
            },
            fail() {
                console.log("wx.checkSession", "fail")
                // session_key 已经失效，需要重新执行登录流程
                self.getUnionid();
            }
        })


    }
    public getRank(call:Function): void {
        let self = this;
        if(this.session_key == null){
            //this.requestNet(this.getRank);
            self.getUnionid();
            return;
        }
        wx.checkSession({
            success() {
                //session_key 未过期，并且在本生命周期一直有效
                wx.request({
                    url: 'https://wxfendi.duligame.cn/GetRank',
                    data: {
                        session: self.session_key,
                    },
                    success: function (res) {
                        console.log("GetRank", "success", res)
                        if(!!call)
                            call(res.data.data.myRank, res.data.data.rankList)
                    },
                    fail: function () {
                        console.log("BindUserInfo", "fail")
                    },
                })
            },
            fail() {
                console.log("wx.checkSession", "fail")
                // session_key 已经失效，需要重新执行登录流程
                //login()
                self.getUnionid();
            }
        })
/*         wx.request({
            url: 'https://wxfendi.duligame.cn/GetRank',
            data: {
                session: self.session_key,
            },
            success: function (res) {
                console.log("GetRank", "success", res)
                if(!!call)
                    call(res.data.data.myRank, res.data.data.rankList)
            },
            fail: function () {
                console.log("BindUserInfo", "fail")
            },
        }) */

    }
    public uploadScoreToServ(val: number): void {

    }
    public getScoreFromServ(): void {

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
    public showShareMenu(): void {
        wx.showShareMenu();
        wx.onShareAppMessage(() => {
            return {
                title: '想与我一起探索“FENDI 罗马奇遇记” 吗?',
                imageUrl: 'https://wx.duligame.cn/fendi/imgs/share.jpg' // 图片 URL
            }
        })

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
            context.font = '90px 微软雅黑'; //设置字体
            context.fillStyle = '#c67861'; //设置字体的颜色
            context.textAlign = "center";
            context.drawImage(arr[0].img, 0, 0, arr[0].img.width, arr[0].img.height); // 绘制图片上去  （所绘制图片资源,x,y,width,height）
            context.fillText(score, canvas.width * .5, 480, canvas.width);// 绘制文字上去  （文字,x,y,width）

            context.font = '50px 微软雅黑'; //设置字体
            context.fillStyle = '#3b3a3a'; //设置字体的颜色
            context.textAlign = "center";
            context.fillText(ths.nickName, canvas.width * .5, 380, canvas.width);// 绘制文字上去  （文字,x,y,width）
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
