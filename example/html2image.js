const capture = require('../lib/');
const util = require('../lib/util/');

const testCookie = '这里填写 url 请求头的 cookie 字符串';

(async () => {
  await capture.init({
    url: 'https://sqlserver.qcloud.com/?from=new_mc',
    type: 'image',
    path: '../sqlserver.jpg',
    screenshot: {
      type: 'jpeg',
      quality: 80
    },
    cookie: util.splitCookies(testCookie, 'https://sqlserver.qcloud.com/', 1 / 24),
    evaluateFn: {
      hideTop: () => {
        // 隐藏不必要的头部 DOM 元素
        document.querySelector('.manage-area-title').style.display = 'none';
      }
    },
    pageLoaded: () => {
      console.log('page loaded');
    },
    afterScreenshot: () => {
      console.log('screen shot');
    }
  })
})()
