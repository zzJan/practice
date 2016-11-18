function asyncPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve('hello world')
        }, 5000)
    })
}

asyncPromise().then((data) => {
    console.log(data)
}).catch((err) => {
    console.error(err)
})
