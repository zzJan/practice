function(a, b, c) {
    function q() {
        var d = Math.min((o ? e[h]().width : f.innerWidth) / (a / b), c);
        d != p && (k.innerHTML = "html{font-size:" + d + "px!important;" + n + "}", p = d)
    }
    function r() {
        clearTimeout(l), l = setTimeout(q, 500)
    }
    var l, d = document,
        e = d.documentElement,
        f = window,
        g = "addEventListener",
        h = "getBoundingClientRect",
        i = "pageshow",
        j = d.head || d.getElementsByTagName("HEAD")[0],
        k = d.createElement("STYLE"),
        m = "text-size-adjust:100%;",
        n = "-webkit-" + m + "-moz-" + m + "-ms-" + m + "-o-" + m + m,
        o = h in e,
        p = null;
    a = a || 320, b = b || 16, c = c || 32, j.appendChild(k), d[g]("DOMContentLoaded", q, !1), "on" + i in f ? f[g](i, function(a) {
        a.persisted && r()
    }, !1) : f[g]("load", r, !1), f[g]("resize", r, !1), q()
}(
320, // 设置设计稿基准宽度
16, // 设置开发时的被除数（见HOW TO USE第4步） 在设计稿基准宽度为320时最好设置为16（在在设计稿基准宽度为其他值时等比放大，如640时设置为32等）。因为浏览器默认的值就是16，这样代码失效或尚未起效时，不会有布局问题
32 // 设置最大根元素font-size，请注意这是一个css像素值，而非物理像素值。它的作用是，当用户用非常宽的屏幕（pad、pc）访问页面时，不至于使得根元素的font-size超过这个值，使得布局非常难看。
);


// 防止手机横屏和竖屏产生的问题
// var Dpr = 1, uAgent = window.navigator.userAgent;
// var isIOS = uAgent.match(/iphone/i);
// var isYIXIN = uAgent.match(/yixin/i);
// var is2345 = uAgent.match(/Mb2345/i);
// var ishaosou = uAgent.match(/mso_app/i);
// var isSogou = uAgent.match(/sogoumobilebrowser/ig);
// var isLiebao = uAgent.match(/liebaofast/i);
// var isGnbr = uAgent.match(/GNBR/i);
// function resizeRoot() {
//     var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth, wDpr, wFsize;
//     var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
//     if (window.devicePixelRatio) {
//         wDpr = window.devicePixelRatio;
//     } else {
//         wDpr = isIOS ? wWidth > 818 ? 3 : wWidth > 480 ? 2 : 1 : 1;
//     }
//     if (isIOS) {
//         wWidth = screen.width;
//         wHeight = screen.height;
//     }
//     // if(window.orientation==90||window.orientation==-90){
//     //     wWidth = wHeight;
//     // }else if((window.orientation==180||window.orientation==0)){
//     // }
//     if (wWidth > wHeight) {
//         wWidth = wHeight;
//     }
//     wFsize = wWidth > 1080 ? 144 : wWidth / 7.5;
//     wFsize = wFsize > 32 ? wFsize : 32;
//     window.screenWidth_ = wWidth;
//     if (isYIXIN || is2345 || ishaosou || isSogou || isLiebao || isGnbr) {//YIXIN 和 2345 这里有个刚调用系统浏览器时候的bug，需要一点延迟来获取
//         setTimeout(function () {
//             wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth;
//             wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
//             wFsize = wWidth > 1080 ? 144 : wWidth / 7.5;
//             wFsize = wFsize > 32 ? wFsize : 32;
//             // document.getElementsByTagName('html')[0].dataset.dpr = wDpr;
//             document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
//         }, 500);
//     } else {
//         // document.getElementsByTagName('html')[0].dataset.dpr = wDpr;
//         document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
//     }
//     // alert("fz="+wFsize+";dpr="+window.devicePixelRatio+";UA="+uAgent+";width="+wWidth+";sw="+screen.width+";wiw="+window.innerWidth+";wsw="+window.screen.width+window.screen.availWidth);
// }
// resizeRoot();
