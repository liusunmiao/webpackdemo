'use strict'
// 颜色插件
const chalk = require('chalk')
//semver 就是专门用于语义化版本号检查的库，其也是语义化版本标准的制定者。
const semver = require('semver')
const packageConfig = require('../package.json')
//Shell是linux下的脚本语言解析器，拥有丰富且强大的底层操作权限
const shell = require('shelljs')

//child_process模块用来启动一个新的进程，一般用在处理一些定时执行的操作
function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
    {
        // node版本信息
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node
    }
]
if (shell.which('npm')) {
    //执行到的脚本是npm
    versionRequirements.push({
        //npm版本信息
        name: 'npm',
        //通过执行npm --version 命令获取npm的版本信息
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    })
}
module.exports = function () {
    const warnings = []
    //变量版本信息
    for (let i = 0; i < versionRequirements.length; i++) {
        //获取对应的版本信息
        const mod = versionRequirements[i];
        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(mod.name + ':' +
                chalk.red(mod.currentVersion) + ' should be ' +
                chalk.green(mod.versionRequirement)
            )
        }
    }
    if (warnings.length) {
        //打印版本信息
        for (let i = 0; i < warnings.length; i++) {
            console.log(' ' + warnings[i])
        }
        //终止当前进程并返回code的值，默认code返回0
        process.exit(1)
    }
}
