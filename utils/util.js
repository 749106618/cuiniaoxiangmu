var emojimap = require('./emojimap.js').default
var emoji = emojimap.emojiList.emoji

function formatDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(date) {
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const KEY_LOGS = 'logs'

function clearLog() {
    wx.removeStorageSync(KEY_LOGS)
}

function pushLog(msg) {
    var logs = wx.getStorageSync(KEY_LOGS) || []
    logs.unshift({
        date: Date.now(),
        msg
    })
    wx.setStorageSync(KEY_LOGS, logs)
}

/**
 * 验证数据长度有效性
 */
function checkStringLength(str, max, min) {
    if (str && str.toString().length <= max && str.toString().length >= min) {
        return true
    } else {
        return false
    }
}

/**
 * 检测字符串类型
 * str: 传入待验证的字符串
 * type: 检测类型
 *       string-number : 仅限字母、数字
 *       string-number-hanzi : 仅限中文、字母、汉字
 */
function validStringType(str, type) {
    let result = null
    switch (type) {
        case 'string-number':
            result = /^[A-Za-z0-9]+$/.test(str)
            break
        case 'string-number-hanzi':
            result = /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(str)
            break
        case 'email':
            result = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
            break
        case 'phone':
            result = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str)
            break
        default:
            break
    }
    return result
}
/**
 * 字符串数组排序：包含中文字符
 */
function sortStringArray(srcArr) {
    return srcArr.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'base'}))
}
/**
 * 输入Unix时间戳，返回指定时间格式
 */
function calcTimeHeader(time) {
    // 格式化传入时间
    let date = new Date(parseInt(time)),
        year = date.getUTCFullYear(),
        month = date.getUTCMonth(),
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getUTCMinutes()
    // 获取当前时间
    let currentDate = new Date(),
        currentYear = date.getUTCFullYear(),
        currentMonth = date.getUTCMonth(),
        currentDay = currentDate.getDate()
    // 计算是否是同一天
    if (currentYear == year && currentMonth == month && currentDay == day) {//同一天直接返回
        if (hour > 12) {
            return `${hour}:${minute < 10 ? '0' + minute : minute}`
        } else {
            return `${hour}:${minute < 10 ? '0' + minute : minute}`
        }
    }
    // 计算是否是昨天
    let yesterday = new Date(currentDate - 24 * 3600 * 1000)
    if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth() && day == yesterday.getDate()) {//昨天
        return `昨天 ${hour}:${minute < 10 ? '0' + minute : minute}`
    } else {
        return `${year}-${month + 1}-${day} ${hour}:${minute < 10 ? '0' + minute : minute}`
    }
}
/**
 * 输入Unix时间戳，返回mm-dd
 */
function mmdd(time) {
    // 格式化传入时间
    let date = new Date(parseInt(time)),
        month = date.getUTCMonth() + 1,
        day = date.getDate();
        if(day>10){
            return `${month}-${day}`
        }
        return `${month}-0${+day}`
}
/**
 * 输入Unix时间戳，返回指定时间格式 消息
 */
function calcTimeHeaderMessage(time) {
    // 格式化传入时间
    let date = new Date(parseInt(time)),
        year = date.getUTCFullYear(),
        month = date.getUTCMonth(),
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getUTCMinutes()
    // 获取当前时间
    let currentDate = new Date(),
        currentYear = date.getUTCFullYear(),
        currentMonth = date.getUTCMonth(),
        currentDay = currentDate.getDate()
    // 计算是否是同一天
    if (currentYear == year && currentMonth == month && currentDay == day) {//同一天直接返回
        if (hour > 12) {
            return `${hour}:${minute < 10 ? '0' + minute : minute}`
        } else {
            return `${hour}:${minute < 10 ? '0' + minute : minute}`
        }
    }
    // 计算是否是昨天
    let yesterday = new Date(currentDate - 24 * 3600 * 1000)
    if (year == yesterday.getUTCFullYear() && month == yesterday.getUTCMonth() && day == yesterday.getDate()) {//昨天
        return `昨天`
    } else {
        return `${month + 1}月${day}日`
    }
}
/**
 * 播放网络音频
 */
function playNetAudio({dur, mp3Url}) {
    const audioContext = wx.createInnerAudioContext()
    audioContext.src = mp3Url
    audioContext.play()
    audioContext.onPlay((res) => {
        // console.log(res)
    })
}
/**
 * 输出猜拳图片对象，用于生成富文本图片节点
 */
function generateFingerGuessImageFile(value) {
    let file = {w: 50, h: 50, url: ''}
    switch (value) {
        case 1:
            file.url = 'http://yx-web.nos.netease.com/webdoc/h5/im/play-1.png'
            break
        case 2:
            file.url = 'http://yx-web.nos.netease.com/webdoc/h5/im/play-2.png'
            break
        case 3:
            file.url = 'http://yx-web.nos.netease.com/webdoc/h5/im/play-3.png'
            break
        default:
            break
    }
    return file
}
/**
 * 输出贴图表情对象，用于生成富文本图片节点
 * content:"{"type":3,"data":{"catalog":"ajmd","chartlet":"ajmd010"}}"
 */
function generateBigEmojiImageFile(content) {
    let prefix = 'http://yx-web.nosdn.127.net/webdoc/h5/emoji/'
    let file = {w: 100, h: 100, url: ''}
    file.url = `${prefix}${content.data.catalog}/${content.data.chartlet}.png`
    return file
}
/**
 * 生成富文本节点
 */
function generateRichTextNode(text) {
    let tempStr = text
    let richTextNode = []
    let leftBracketIndex = tempStr.indexOf('[')
    let rightBracketIndex = tempStr.indexOf(']')
    let countOfWord = 0
    Array.from(tempStr).map(item => {
        if (item != '[' && item != ']') {
            countOfWord++
        }
    })
    if (leftBracketIndex == -1 || rightBracketIndex == -1 || countOfWord == 0) {//没有emoji
        richTextNode.push({
            type: 'text',
            text: tempStr
        })
        return richTextNode
    }
    while (tempStr.length != 0) {
        leftBracketIndex = tempStr.indexOf('[')
        rightBracketIndex = tempStr.indexOf(']')
        if (leftBracketIndex == 0) { // 开头是[
            rightBracketIndex = tempStr.indexOf(']')
            if (rightBracketIndex == -1) {
                richTextNode.push({
                    type: 'text',
                    text: tempStr
                })
                tempStr = ''
            } else {
                let emojiName = tempStr.slice(0, rightBracketIndex + 1)
                if (emoji[emojiName]) { // 有效emoji
                    richTextNode.push({
                        name: 'img',
                        attrs: {
                            width: '30rpx',
                            height: '30rpx',
                            src: emoji[emojiName].img
                        }
                    })
                } else {//无效emoji
                    richTextNode.push({
                        type: 'text',
                        text: emojiName
                    })
                }
                tempStr = tempStr.substring(rightBracketIndex + 1, tempStr.length)
            }
        } else { // 开头不是[
            if (leftBracketIndex == -1) {// 最后全是文字
                richTextNode.push({
                    type: 'text',
                    text: tempStr.slice(0, tempStr.length)
                })
                tempStr = ''
            } else {
                richTextNode.push({
                    type: 'text',
                    text: tempStr.slice(0, leftBracketIndex)
                })
                tempStr = tempStr.substring(leftBracketIndex, tempStr.length + 1)
            }
        }
    }
    return richTextNode
}
/**
 * 处理图片富文本节点
 */
function generateImageNode(file) {
    console.log(file)
    let width = 0, height = 0
    if (file.w > 250) {
        width = 200
        height = file.h / (file.w / 200)
    } else {
        width = file.w
        height = file.h
    }
    let richTextNode = []
    richTextNode.push({
        name: 'img',
        attrs: {
            width: `${width}rpx`,
            height: `${height}rpx`,
            src: file.url
        }
    })
    return richTextNode
}
/**
 * 深度克隆
 */
function deepClone(srcObj, out) {
    let outObj = out || {}
    for (let key in srcObj) {
        if (typeof srcObj[key] === 'object') {
            outObj[key] = (srcObj[key].constructor === Array) ? [] : {}
            deepClone(srcObj[key], outObj[key])
        } else {
            outObj[key] = srcObj[key]
        }
    }
    return outObj
}
/**
 * 判断自定义文件类型
 */
function judgeCustomMessageType(type, content) {
    let res = ''
    if (type === 'custom' && content['type'] === 1) {
        res = '猜拳'
    } else if (type === 'custom' && content['type'] === 2) {
        res = '阅后即焚'
    } else if (type === 'custom' && content['type'] === 3) {
        res = '贴图表情'
    } else if (type === 'custom' && content['type'] === 4) {
        res = '白板消息'
    } else if (type === 'custom' && content['type'] === 7 ){
        res = '药品详情'
    }else if (type === 'custom' && content['type'] === 8 ){
        res = '诊断金'
    }else if (type === 'custom' && content['type'] === 9 ){
        res = '处方'
    }else if (type === 'custom' && content['type'] === 10 ){
        res = '用户支付诊断金'
    }else if (type === 'custom' && content['type'] === 11 ){
        res = '通过好友'
    }else if (type === 'custom' && content['type'] === 12 ){
        res = '医生转发消息'
    } else if (type === 'custom' && content['type'] === 13 ){
        res = '用户支付药品'
    } else {
        res = type
    }
    return res
}
/**
 * 单击用户头像，查询并跳转到指定页面
 * account: 账户, isPush: 新页面是跳转方式，true为压栈，false为重定向
 */
function clickLogoJumpToCard(account, isPush) {
    var app = getApp()
    let isFriend = true
    let friendsAccountArr = []
    app.globalData.friends.map(friend => {
        friendsAccountArr.push(friend.account)
    })
    if (friendsAccountArr.indexOf(account) !== -1) {
        if (isPush === true) {
            wx.navigateTo({
                url: '/partials/personcard/personcard?account=' + account,
            })
        } else {
            wx.redirectTo({
                url: '/partials/personcard/personcard?account=' + account,
            })
        }

    } else {
        app.globalData.nim.getUser({
            account: account,
            done: function (err, user) {
                if (err) {
                    // console.log(err)
                    return
                }
                if (isPush === true) {
                    wx.navigateTo({
                        url: '/partials/strangercard/strangercard?user=' + encodeURIComponent(JSON.stringify(user)),
                    })
                } else {
                    wx.redirectTo({
                        url: '/partials/strangercard/strangercard?user=' + encodeURIComponent(JSON.stringify(user)),
                    })
                }

            }
        })
    }
}
/**
 * post 方法，接受params参数对象
 */
function post(params) {
    let url = params.url,
        header = params.header || {},
        data = params.data;

    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            header: header,
            method: 'POST',
            success: function (data, statusCode, header) {
                resolve({data, statusCode, header})
            },
            fail: function () {
                reject('请求失败，请重试！')
            }
        })
    })

}

let {request} = require('./api.js');
let {regExp} = require('../config.js');
const sendMobileCode = function (self, _tel) {
    console.info(_tel)
    if (!_tel || !regExp.mobileRegExp.test(_tel)) {
        showMessage('手机号格式不正确')
        return;
    } else {
        request.apiGet('user/getSms', {phone: _tel}).then(() => {
            self.setData({
                qrObj: {
                    qrDisabled: true
                }
            })
            let getCountDown = function (t) {
                if (t == 0) {
                    self.setData({
                        qrObj: {
                            qrText: '重新获取验证码',
                            qrDisabled: false
                        }
                    })
                } else {
                    self.setData({
                        qrObj: {
                            qrText: t + 's',
                            qrDisabled: true
                        }
                    })
                    t--;
                    setTimeout(function () {
                        getCountDown(t);
                    }, 1000);
                }
            }
            getCountDown(120);
        })
    }
}

const showMessage = function (content) {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: content,
            icon: 'none',
            mask: true,
            success () {
                if (resolve) {
                    setTimeout(function () {
                        resolve()
                    }, 2000)
                }
            }
        })
    })
}

const showLoading = function (title = "登录中...") {
    wx.showLoading({title, mask: false})
}

const hideLoading = function () {
    wx.hideLoading();
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
const formatDateInterval = (oldTime, format) => {
    let _nowTime = new Date().getTime();
    let _oldTime = new Date(oldTime.replace(/-/g, "/")).getTime();
    let _formDate = Math.floor((_nowTime - _oldTime) / (1000 * 60));
    if (_formDate < 60) {
        return _formDate <= 0 ? '刚刚' : _formDate + '分钟前'
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
            if (format == 'hh:mm') {
                return getFormatDate(this.getHours()) + ":" + getFormatDate(this.getSeconds())
            } else if (format == 'yy-mm-dd') {
                return this.getFullYear() + "年" + getFormatDate(this.getMonth() + 1) + "月" + getFormatDate(this.getDate()) + "日 "
            } else if (format == 'week') {
                return this.getDay();
            } else if (format == 'mm-dd') {
                return getFormatDate(this.getMonth() + 1) + '-' + getFormatDate(this.getDate())
            }
        };
        let _date = new Date(_oldTime);
        return _date.toLocaleString();
    }
}

const formatDateOverplus = (time) => {
    let nowTime = new Date().getTime();
    let overPlusMin = Math.ceil((time - nowTime) / 1000);
    let hour = pad(parseInt(overPlusMin / (60 * 60)), 2);
    let min = pad(parseInt((overPlusMin - hour * 60 * 60) / 60), 2);
    let sec = pad(overPlusMin - hour * 60 * 60 - min * 60, 2);
    return hour + ":" + min + ":" + sec;
}

function pad(num, n) {
    if ((num + "").length >= n) return num;
    return pad("0" + num, n);
}

const removeOneInList = function (list, index) {
    let result = list.slice(0, index);
    list.slice(parseInt(index) + 1, list.length).forEach((res) => {
        result.push(res)
    })
    return result;
}

const navigateTo = function (url, param = {}) {
    wx.navigateTo({
        url: getUrlWithParam(url, param)
    })
}

const getUrlWithParam = function (url, param = {}) {
    var str = Object.keys(param).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(param[key])
    }).join('&')
    return str ? url + '?' + str : url;
}

const subReason = function (reason) {
    return reason.length > 72 ? reason.substring(0, 72) + "..." : reason;
}

const handelReasonToObject = function (reason) {
    let result = [];
    let reasonArray = reason.split('\n');
    for (let oneReasonText of reasonArray) {
        if (oneReasonText) {
            result.push({
                text: oneReasonText
            })
        }
    }
    return result.length > 0 ? JSON.stringify(result) : "";
}
function getStrLenght(message, MaxLenght) {
    let strlenght = 0; //初始定义长度为0
    let txtval = message;
    for (var i = 0; i < txtval.length; i++) {
        if (isCN(txtval.charAt(i)) == true) {
            strlenght = strlenght + 2; //中文为2个字符
        } else {
            strlenght = strlenght + 1; //英文一个字符
        }
    }
    return strlenght < MaxLenght ? true : false;
}
function silceLentgh(message, sliceLength, getStrLenght) {
    let inputLength = sliceLength; //初始定义长度为最大长度
    let txtval = message;
    if (txtval.length == inputLength * 2) {
        return inputLength * 2
    }
    for (var i = 0; i < txtval.length; i++) {
        if (isCN(txtval.charAt(i)) == false && inputLength < sliceLength * 2 && getStrLenght) {

            inputLength++;
        }
    }
    return inputLength

}

function isCN(str) { //判断是不是中文
    let regexCh = /[u00-uff]/;
    return !regexCh.test(str);
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}
let getQueryString = function (url,name) {
    console.log("url = "+url)
    console.log("name = " + name)
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
        console.log("r = " + r)
        console.log("r[2] = " + r[2])
        return r[2]
    }
    return null;
}

const getNewArr = function (picPath) {
    let picArr = picPath
    let picArrSmall = []
    for(let i = 0;i<picArr.length;i++){
        let temp = picArr[i];
        if (temp.indexOf('medkazo.com') > 0){
            let j = picArr[i].lastIndexOf('.')
            let strArr = picArr[i].split('')
            strArr.splice(j,1,'_small.')
            picArrSmall[i] = strArr.join('')
        }
    }
    //console.log(picArr);
    //console.log(picArrSmall);
    return picArrSmall
}

module.exports = {
    formatDate,
    formatTime,
    timestampToTime,
    pushLog,
    clearLog,
    post,
    checkStringLength,
    validStringType,
    sortStringArray,
    calcTimeHeader,
    generateFingerGuessImageFile,
    generateBigEmojiImageFile,
    generateRichTextNode,
    generateImageNode,
    deepClone,
    judgeCustomMessageType,
    clickLogoJumpToCard,
    isCN,
    silceLentgh,
    getStrLenght,
    sendMobileCode,
    showMessage,
    showLoading,
    hideLoading,
    setStorage,
    getStorage,
    formatDateInterval,
    formatDateOverplus,
    removeOneInList,
    navigateTo,
    getUrlWithParam,
    subReason,
    handelReasonToObject,
    getQueryString,
    getNewArr,
    calcTimeHeaderMessage,
    mmdd
}
