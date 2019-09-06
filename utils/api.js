/**
 * request 请求
 */
let {config} = require('../config.js');
const request = {
    apiPost: (url, param = {}) => {
        return new Promise((resolve, reject) => {
            let token = wx.getStorageSync('token');
            wx.request({
                url: config.baseUrl + url + '?token=' + token,
                data: param,
                method: 'POST',
                header: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "appVersion": "1.0.9"
                },
                success: (res) => {
                    wx.hideLoading();
                    let result = res.data;
                    let status = result.status;
                    console.log(result);
                    if (status == 200) {
                        resolve(result)
                    } else if (status == 407 || status == 401) {
                        wx.navigateTo({
                            url: '/login/login/login'
                        })
                    } else if (status == -2) {
                        wx.showToast({
                            title: '数据不能为空',
                            icon: 'none'
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    //wx.navigateBack()
                                }
                            }
                        })
                    }
                },
                fail: (res) => {
                    wx.hideLoading();
                    console.info(res)
                    if (res.errMsg) {
                        wx.showToast({
                            title: '请检查网络链接状态',
                            icon: 'none',
                            duration: 2000
                        })
                        return;
                    }
                    wx.showModal({
                        title: '提示',
                        content: '系统请求',
                        showCancel: false,
                    })
                }
            })
        })
    },
    /*获取图片高宽*/
    uploadFile: (count = 1, res) => {
        return new Promise((resolve, reject) => {
            wx.showLoading({title: '上传中...', mask: true})
            let token = wx.getStorageSync('token');
            for (let i = 0; i < res.tempFilePaths.length; i++) {//循环上传
                wx.uploadFile({
                    url: config.baseUrl + 'fileupload/imgUpload?token=' + token,
                    filePath: res.tempFilePaths[i],
                    name: 'files',
                    success (result) {
                        let data = JSON.parse(result.data);
                        console.log(data);
                        wx.hideLoading();
                        resolve(data);
                    },
                    fail: () => {
                        wx.hideLoading();
                        if (res.errMsg) {
                            wx.showToast({
                                title: '请检查网络链接状态',
                                icon: 'none',
                                duration: 2000
                            })
                            return;
                        }
                        wx.showModal({
                            title: '提示',
                            content: '系统异常，请联系管理员'
                        })
                    }
                })
            }
        })
    },
    apiGet: (url, param = {}) => {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                    title: '加载中...',
                    mask: false
                })
            let token = wx.getStorageSync('token');
            wx.request({
                url: config.baseUrl + url + '?token=' + token,
                data: param,
                header: {
                    "X-Requested-With": "XMLHttpRequest",
                    "appVersion": "1.0.9"
                },
                success: (res) => {
                    wx.hideLoading();
                    //console.log(res);
                    let status = res.data.status;
                    if (status == 200) {
                        resolve(res)
                    } else if (status == 407 || status == 401) {
                        wx.navigateTo({
                            url: '/login/login/login'
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    if (url == 'user/getSms') {
                                        return;
                                    }
                                    wx.navigateBack()
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                },
                fail: (res) => {
                    wx.hideLoading();
                    console.info(res)
                    if (res.errMsg) {
                        wx.showToast({
                            title: '请检查网络链接状态',
                            icon: 'none',
                            duration: 2000
                        })
                        return;
                    }
                    wx.showModal({
                        title: '提示',
                        content: '系统异常，请联系管理员',
                        showCancel: false
                    })
                }
            })
        })
    }
}

/**
 * 设置storage
 */
const setStorage = ({key, data}) => {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key,
            data,
            success: (res) => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

/**
 * 获取storage
 */
const getStorage = (key) => {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key,
            success: (res) => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

/**
 * 获取通知时间间隔
 */
const formatDateInterval = (oldTime) => {
    let _nowTime = new Date().getTime();
    let _oldTime = new Date(oldTime.replace(/-/g, "/")).getTime();
    let _formDate = Math.floor((_nowTime - _oldTime) / (1000 * 60));
    if (_formDate < 60) {
        return _formDate + '分钟前'
    } else if (_formDate < 1440) {
        return parseInt(_formDate / 60) + '小时前'
    } else if (_formDate < 2880) {
        return '昨天'
    } else {
        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        let getFormatDate = (arg) => {
            if (arg == undefined || arg == '') {
                return '';
            }
            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }
            return re;
        }
        Date.prototype.toLocaleString = function () {
            return this.getFullYear() + "年" + getFormatDate(this.getMonth() + 1) + "月" + getFormatDate(this.getDate()) + "日 "// + this.getHours() + "点" + this.getMinutes() + "分" + this.getSeconds() + "秒";
        };
        let _date = new Date(_oldTime);
        return _date.toLocaleString();
    }
}

module.exports = {
    request,
    setStorage,
    getStorage,
    formatDateInterval
}