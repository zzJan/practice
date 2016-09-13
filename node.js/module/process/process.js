'use strict';

process.nextTick(function() {		// 将在下个循环调用
	console.log('nextTick run, write first!')
})

console.log(`process === global.process?	${process === global.process}`)
console.log(`process.version?	${process.version}`)
console.log(`process.platform?	${process.platform}`)
console.log(`process.arch?	${process.arch}`)
console.log(`process.cwd()?	${process.cwd()}`)	// 返回当前目录地址
console.log(`process.chdir('./foo')?	${process.chdir('./foo')}`)	// 切换工作目录
console.log(`process.cwd()?	${process.cwd()}`)

process.on('exit', function() {		// 程序结束后调用
	console.log('goodbye')
})