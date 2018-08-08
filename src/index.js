const puppeteer = require('puppeteer');
const util = require('./util/');
const path = require('path');
const ora = require('ora');
const _extend = require('extend');

exports.init = function(opts) {
  return new Promise(async (resolve, reject) => {
    const spinner = ora('capturing page').start();

    const defaultConfig = {
      url: '',
      type: 'pdf', // 截图类型，默认 PDF，可选 [pdf, all]
      path: './capture.pdf',
      cookies: [],
      delay: 1000,
      lazyDelay: 20,
      expires: 1 / 24,
      screenshot: {
        path: './capture.png',
        type: 'png', // png
        // quality: 100,
        fullPage: true,
        // clip: {
        //   x: 0,
        //   y: 0,
        //   width: 1240,
        //   height: 800,
        // },
        omitBackground: true,
      },
      pdf: {
        path: './capture.pdf',
        scale: 1,
        displayHeaderFooter: false,
        headerTemplate: '', // PDF 头部信息，内部的 HTML 标签可包含 title/date/url/pageNumber/totalPages
        footerTemplate: '', // 同上
        printBackground: true,
        landscape: false, // 是否横屏
        pageRanges: '', // 打印页码区间，比如 '1-5'
        format: 'A4', // 规格，默认 「Letter」，可选 A4 等,
        width: '1280px',
        height: '',
        margin: {
          // pdf 内容四周的边距
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
        },
      },
      evaluateFn: () => {}, // 用户额外模拟操作
      viewportWidth: 1280, // headless 模拟器宽度
      viewportHeight: 800, // headless 模拟器视窗高度
      mobile: false, // 是否是移动端
      userAgent: false, // 指定 userAgent
      mediaTypePrint: true,
      lazyLoad: true, // 是否滚动懒加载
    };
    const config = _extend(true, defaultConfig, opts);

    if (config.type === 'pdf') {
      config.pdf.path = path.resolve(__dirname, config.path);
    }

    if (config.type === 'image') {
      config.screenshot.path = path.resolve(__dirname, config.path);
    }

    if (!config.url) {
      spinner.fail('Bad', 'url is required!');
    }

    var result = {
      status: 'OK',
    };

    /**
     * Logs json to the console and if required terminates the process
     *
     * @param status
     * @param message
     * @param terminate
     */
    function log(status, message, terminate) {
      result.status = status;

      if (message) {
        result.message = message;
      }

      if (terminate) {
        process.exit(terminate);
      }
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox','--disable-setuid-sandbox']
    })
    const page = await browser.newPage();

    // set the media type
    if (config.mediaTypePrint) {
      await page.emulateMedia('print');
    } else {
      await page.emulateMedia('screen');
    }

    // set the user agent if one is provided
    if (config.userAgent) {
      await page.setUserAgent(config.userAgent);
    }

    if (config.mobile) {
      // set user agent to be as Chrome 60 for Android
      await page.setUserAgent(
        'Mozilla/5.0 (Linux; Android 5.1; XT1039 Build/LPBS23.13-17.6-1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Mobile Safari/537.36'
      );

      // set mobile viewport
      await page.setViewport({ width: 320, height: 480 });
    } else {
      await page.setViewport({ width: parseInt(config.viewportWidth), height: parseInt(config.viewportHeight) }); // set default view port size
    }

    if (config.cookies.length) {
      for (let i = 0; i < config.cookies.length; i++) {
        await page.setCookie(config.cookies[i]);
      }
    }

    await page.goto(config.url, { waitUntil: ['networkidle0', 'load', 'domcontentloaded'] }).catch(function(e) {
      spinner.fail('Promise rejected while last scrolling for lazy load images.');
      reject(e);
    });

    // const evaluateFn = config.evaluateFn;

    // const keys = Object.keys(evaluateFn);

    // for (let i = 0; i < keys.length; i++) {
    //   await page.evaluate(myFunctionText => {
    //     const myFunction = new Function(' return (' + myFunctionText + ').apply(null, arguments)');
    //     return myFunction.call(null);
    //   }, evaluateFn[keys[i]].toString());
    // }

    // attempt to load lazy load images
    if (config.lazyLoad) {
      var maxScroll = await page
        .evaluate(function() {
          return Promise.resolve(
            Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            ) - window.innerHeight
          );
        })
        .catch(function(e) {
          spinner.fail('evaluate lazyload fail')
          reject(e);
        });

      var fullScrolls = Math.floor(maxScroll / config.viewportHeight); // how many times full scroll needs to be done
      var lastScroll = maxScroll % config.viewportHeight; // amount left to get to the bottom of the page after doing the full scrolls

      // do full scrolls if there is any
      for (var i = 1; i <= fullScrolls; i++) {
        await page
          .evaluate(
            function(i, viewportHeight) {
              return Promise.resolve(window.scrollTo(0, i * viewportHeight));
            },
            i,
            config.viewportHeight
          )
          .catch(function(e) {
            spinner.fail('Promise rejected while last scrolling for lazy load images.');
            reject(e);
          });
        await util.delay(config.lazyDelay);
      }

      // do last scroll if there is any
      if (lastScroll > 0) {
        await page
          .evaluate(function(maxScroll) {
            return Promise.resolve(window.scrollTo(0, maxScroll + 25));
          }, maxScroll)
          .catch(function(e) {
            spinner.fail('evaluate lazyload fail')
            reject(e);
          });
      }
    }

    config.pageLoaded && (await config.pageLoaded());
    await util.delay(config.delay);

    if (config.type === 'pdf') {
      // save pdf
      await page.pdf(config.pdf);
    } else if (config.type === 'image') {
      // save screenshot
      await page.screenshot(config.screenshot);
    }

    config.afterScreenshot && (await config.afterScreenshot());

    await browser.close();
    spinner.succeed(result.status);

    resolve(result);
  });
};
