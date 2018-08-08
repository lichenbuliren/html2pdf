/**
 * Create by maoshuchen
 * Date: 2017/10/27
 * Time: 上午11:30
 * Desc:
 */

let path = require('path');
let projectPath = path.resolve('./');

console.log(path.join(projectPath, 'src'));

module.exports = {
    projectPath: projectPath,
    src: path.join(projectPath, 'src/**/*.js'),
    dest: path.join(projectPath, 'lib'),
}