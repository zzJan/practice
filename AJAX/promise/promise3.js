 // Promise#then 不仅仅是注册一个回调函数那么简单，它还会将回调函数的返回值进行变换

 function increment(num) {
 	// Promise.reject(new Error(44))
 	return num + 1;
 }

 function doubleUp(num) {
 	return num * 2;
 }

 function output(num) {
 	console.log(num)
 }

 let promise = Promise.resolve(1);

 promise.then(increment)
 	.then(doubleUp)
 	.then(output)
 	.catch((err) => {
 		console.error(err)
 	})


 // 创建并返回一个promise对象
 // 1: 对同一个promise对象同时调用 `then` 方法
 let aPromise = new Promise(function(resolve) {
 	resolve(100);
 });
 aPromise.then(function(value) {
 	return value * 2;
 });
 aPromise.then(function(value) {
 	return value * 2;
 });
 aPromise.then(function(value) {
 	console.log("1: " + value); // => 100
 })

 // vs

 // 2: 对 `then` 进行 promise chain 方式进行调用
 let bPromise = new Promise(function(resolve) {
 	resolve(100);
 });
 bPromise.then(function(value) {
 	return value * 2;
 }).then(function(value) {
 	return value * 2;
 }).then(function(value) {
 	console.log("2: " + value); // => 100 * 2 * 2
 });
