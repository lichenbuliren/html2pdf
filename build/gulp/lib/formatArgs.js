// 将对象转成成命令行的参数
module.exports = function (obj) {
    let argStr = '';

    Object.keys(obj).forEach(function (param) {
        let value = obj[param];

        if (argStr) {
            argStr = `${argStr} --${param}=${value}`;
        } else {
            argStr = `--${param}=${value}`;
        }

        return true;
    });

    return argStr;
};
