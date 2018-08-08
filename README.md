# html-capture

> 一键将 URL 截图全屏导出工具，支持导出 PDF 格式，导出 'png|jpg|jpeg' 格式
> 该工具将会自动计算页面高度，自动滚动到底部加载所有内容

# 特性
1. 可导出 PDF 或者 image 类型文件
2. 可自定义在加载页面完成之后执行的页面内脚本操作
3. 提供命令行版本和 node 使用版本

# 使用方法

``` bash
capture -h

Usage: capture [optioons]

  Options:
    -V, --version          output the version number
    -u, --url <url>        link url
    -t, --type [type]      export type (default: pdf)
    -c, --cookies [cookies]  page cookies
    -p, --path <path>      file path to save (default: ./capture.pdf)
    -h, --help             output usage information
```

**命令行脚本执行**

``` bash
# 导出页面为 PDF 类型。（默认 PDF，不需要指定）
# 命令行调用相比 Node 调用的方式，没有那么丰富的 API
capture -u http://heavenru.com/blog/ -p ./capture.pdf
```

**node 服务调用**
``` bash
const capture = require('html-capture');
capture.init({
  url: 'http://heavenru.com/blog/',
  type: 'pdf',
  path: './capture.pdf',
  cookies: xxxx,
  evaluateFn: () => {
    domOpertaion: () => {
      console.log('dom operation');
    }
    // 页面加载后执行脚本，目前只支持同步方法
  }
})
```

# API

## 公共参数
- `-u, --url`：抓去页面 URL
- `-t, --type`：导出文件类型，默认 PDF
- `-c, --cookies`：数组类型，注入 `cookies`；多个 `cookies` 值按照 `requrest` 请求头中的格式传入:
  - name: <string> required
  - value: <string> required
  - url: [string]
  - domain: [string]
  - path: [string]
  - expires: [number],
  - httpOnly: [string],
- `-e, --expires`: `cookies` 过期时间，单位为「天」。如果要设置 `cookie`,这里必填，不然的话 `cookie` 会立即过期无效，例如：`new Date().getTime() + 10 * 60 * 1000` 十分钟
- `-p, --path`：文件保存路径，带后缀名，默认为 `./capture.pdf`

## node 服务参数
- `delay`: 页面滚动到底部，在执行截取操作前的延迟时间，单位毫秒
- `evaluateFn`: [object] 页面加载执行脚本对象
- `screentshot`: [object] 单独配置截图信息
  - `path`: [string] 优先取 `--path`，文件保存路径
  - `fullPage`: [boolean] 是否截取全屏，默认 true
  - `type`: [string] 图片类型，默认 png，支持 'png|jpeg'
  - `omitBackground`: [boolean] 是否同时抓去背景，默认 true
- `pdf`: [object] 导出 PDF 配置信息
  - `path`: 同上
  - `scale`: [number] 缩放比例，默认为 1
  - `displayHeaderFooter`: [boolean] 是否显示页头页脚，默认 false
  - `printBackground`: [boolean] 是否抓取背景，默认 true
  - `landscape`: [boolean] 是否横屏，默认 false
  - `pageRanges`: [string] 打印页码区间，比如 '1-5',默认 '' 表示全部打印
  - `format`: [string] PDF 规格，默认 'A4',支持的格式如下：
    ``` text
    Letter: 8.5in x 11in
    Legal: 8.5in x 14in
    Tabloid: 11in x 17in
    Ledger: 17in x 11in
    A0: 33.1in x 46.8in
    A1: 23.4in x 33.1in
    A2: 16.5in x 23.4in
    A3: 11.7in x 16.5in
    A4: 8.27in x 11.7in
    A5: 5.83in x 8.27in
    A6: 4.13in x 5.83in
    ```
  - `headerTemplate`: [string] 页头 HTML 编码字符串，内部标签使用如下 `class` 即可获取对应页面信息
    - date 格式化之后的日期
    - title 文档标题 = document.title
    - url 页面地址 = document location
    - pageNumber 当前页码
    - totalPages 总页数
  - `footerTemplate`: 同上
  - `margin`: 页面边距设置
    - top
    - bottom
    - left
    - right
- `viewportWidth`: [number] 页面模拟器宽度
- `viewportHeight`: [number] 页面模拟器首屏高度
- `mobile`: [boolean] 是否模拟移动端
- `userAgent`: [string] 指定 userAgent
- `lazyLoad`: [boolean] 是否延时滚动加载，默认 true
 
# Q&A

为了保证导出的 PDF 文件中的表格或者其他图形不被截断，需要给那些不希望截断的元素加上 `page-break-inside: avoid !important;` CSS 样式。
当然你也可以在 `evaluateFn` 里面设置一个专门的方法来做这件事情。