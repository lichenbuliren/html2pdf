const capture = require('../lib/');
const util = require('../lib/util/');

(async () => {
  try {
    await capture.init({
      url: 'https://www.baidu.com',
      path: '../baidu.pdf',
      evaluateFn: {
        hideTop: () => {
          const search = 'hello';
          document.getElementById('kw').value = search;
        }
      },
      pdf: {
        margin: {
          top: '60px',
          bottom: '60px'
        }
      },
      pageLoaded: () => {
        console.log('\npage loaded');
      },
      afterScreenshot: () => {
        console.log('\nscreen shot');
      }
    })
  } catch (error) {
    console.log(error);
  }
  
})()

