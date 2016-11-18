// Promise.resolve和Promise.reject会快速的返回一个Promise对象


function asyncPromise() {
    // return Promise.resolve(42)
    return Promise.reject(new Error(42))
}

asyncPromise().then((data) => {
    console.log(data)
}).catch((err) => {
    console.error(err)
})
