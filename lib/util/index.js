'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const suffix = exports.suffix = str => {
  return str.substring(str.lastIndexOf('.') + 1);
};

const delay = exports.delay = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

/**
 * 
 * @param {*} cookieStr cookie 字符串
 * @param {*} url 必选，指定 cookie 域
 * @param {*} expires 过期时间，单位 day；默认 1 小时
 */
const splitCookies = exports.splitCookies = (cookieStr, url, expires = 1 / 24) => {
  const cookies = [];
  if (cookieStr) {
    // 以 "; "分割
    cookieStr.split('; ').forEach(cookie => {
      let tmp = cookie.split('=');
      cookies.push({
        name: tmp[0],
        value: tmp[1],
        url: url,
        expires: new Date().getTime() + expires * 24 * 60 * 60 * 1000
      });
    });
  }
  return cookies;
};