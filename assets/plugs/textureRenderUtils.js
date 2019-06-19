cc.Class({
    extends: cc.Component,

    properties: {
        _canvas: null
    },


    // 加载资源----step1
    saveFile() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            const ths = this;

            // img: 图片保存对象; src: 图片资源路径
            let imgArr = [
                { img: null, src: 'https://cdn.duligame.cn/minigame-fendi/imgs/scene_1' },
            ]
            let compNum = 0; // 成功加载资源数量

            // 单个资源加载成功回调
            let successFn = () => {
                compNum++;
                if (compNum == imgArr.length) {
                    ths.drawImg(imgArr);
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
    },

    // 拼接海报----step2
    drawImg(arr) {
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
            context.font = '30px 宋体'; //设置字体
            context.fillStyle = '#FFF'; //设置字体的颜色
            context.drawImage(arr[1].img, 155, 560, 140, 140); // 绘制图片上去  （所绘制图片资源,x,y,width,height）
            context.fillText('胜利者', 140, 740, 200);// 绘制文字上去  （文字,x,y,width）

            this.canvasToImg(canvas);
        } catch (e) {
            console.log('drawImg error:', e);
        }
    },

    // canvas转换图片---- step3
    canvasToImg(canvas) {
        try {
            canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: canvas.width,
                height: canvas.height,
                destWidth: canvas.width,
                destHeight: canvas.height,
                fileType: 'jpg',
                quality: 1,
                success: (e) => {
                    console.log('保存路径成功:', e.tempFilePath);
                    this.getPhotosAlbum(e.tempFilePath)

                },
                fail: (e) => {
                    console.log('保存路径失败:', e)
                }
            });
        } catch (e) {
            console.log('canvas转图片失败:', e)
        }
    },

    // wx获取授权----step4
    getPhotosAlbum(path) {
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
    },

    // 保存成功----step5
    savePicture(path) {
        wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
                console.log('保存成功');
            },
            fail(e) {
                console.log('保存失败:', e);
            }
        })
    },

    // 清空canvas
    clearCanvas() {
        let ctx = this._canvas.getContext('2d');

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    },

    // 加载资源失败
    failSave() {
        console.log('保存失败');
    }
});
