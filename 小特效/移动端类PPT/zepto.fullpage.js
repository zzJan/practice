/*!
 * zepto.fullpage.js v0.5.0 (https://github.com/yanhaijing/zepto.fullpage)
 * API https://github.com/yanhaijing/zepto.fullpage/blob/master/doc/api.md
 * Copyright 2014 yanhaijing. All Rights Reserved
 * Licensed under MIT (https://github.com/yanhaijing/zepto.fullpage/blob/master/LICENSE)
 */
(function($, window, undefined) {
    if (typeof $ === 'undefined') {
        throw new Error('zepto.fullpage\'s script requires Zepto');
    }
    var fullpage = null;
    var d = {
        pageName: '.page',
        start: 0,    // 从第几屏开始，默认是第一屏
        duration: 500,    // 每屏动画切换的时间，这段时间内，不能重复切换，默认是500ms，这里只是js限制，css动画时间需要更改css文件
        loop: false,    // 是否开启循环滚动，默认false
        drag: false,    // 是否开启拖动功能，默认false
        preload: false,    // 是否开启图片预加载功能，默认false
        music: false,//{    // 是否开启音乐功能，默认开启
            // url: '../music/bg.mp3',    // 音乐的地址，默认为空
            // loop: true,    // 是否开启音乐循环播放，默认true
            // autoplay: true    // 是否开启音乐自动播放，默认true
        //},
        indicator: true,    // 是否开启右侧位置栏，默认true
        arrow: true,    // 是否开启箭头功能，默认true
        dir: 'v',    // 切换方向，默认垂直方向(v h)
        der: 0.1,   // 当滑动距离大于一个值时，才会引起滑动现象，滑动距离=der*屏幕高度|宽度，默认值为0.1
        beforeChange: function(data) {},    // 翻页前执行的回调
        change: function(data) {},    // 翻页时执行的回调
        afterChange: function(data) {},    // 翻页后执行的回调
        orientationchange: function(orientation) {}    // 旋转屏幕时执行的回调
    };

    function touchmove(e) {
        e.preventDefault();
    }

    // 循环翻页
    function fix(cur, pagesLength, loop) {
        if (cur < 0) {
            return !!loop ? pagesLength - 1 : 0;
        }

        if (cur >= pagesLength) {
            return !!loop ? 0 : pagesLength - 1;
        }


        return cur;
    }

    // 启用拖拽页面后，拖拽动画的定义
    function move($el, dir, dist) {
        var xPx = '0px', yPx = '0px';
        if(dir === 'v') {
            yPx = dist + 'px';
        } else {
            xPx = dist + 'px';
        }
        $el.css({
            '-webkit-transform' : 'translate3d(' + xPx + ', ' + yPx + ', 0px);',
            'transform' : 'translate3d(' + xPx + ', ' + yPx + ', 0px);'
        });
    }

    // 初始化
    function init(option) {
        var opt = $.extend(true, {}, d, option);
            that = this;

        // 当前页
        that.curIndex = -1;
        that.opt = opt;

        // 起始点
        that.startX = 0;
        that.startY = 0;
        // 是否正在翻页
        that.movingFlag = false;

        that.$el.addClass('fullPage-wp');
        // 根元素
        that.$parent = that.$el.parent();
        // 所有页
        that.$pages = that.$el.find(opt.pageName).addClass('fullPage-page fullPage-dir-' + opt.dir);
        // 总页数
        that.pagesLength = that.$pages.length;

        that.update();
        that.preload();
        that.initEvent();
        that.initDOM();
        that.start();
    }

    function Fullpage($el, option) {
        this.$el = $el;
        init.call(this, option);
    }

    $.extend(Fullpage.prototype, {
        // 此方法会重新计算和渲染每屏的高度还有滚屏的方向，当你发现如果每屏的高度有问题时，手动调用下此方法就可以了
        update: function() {
            if (this.opt.dir === 'h') {
                this.width = this.$parent.width();
                this.$pages.width(this.width);
                this.$el.width(this.width * this.pagesLength);
            }

            this.height = this.$parent.height();
            this.$pages.height(this.height);

            this.moveTo(this.curIndex < 0 ? this.opt.start : this.curIndex);
        },
        preload: function() {
            if(!this.opt.preload) return 0;
            var imgList = this.opt.preload,
                image = new Image(),
                loaded = 0;
            imgList.forEach(function(img, index) {
                image.onload = function() {
                    if(++loaded > imgList.length) {
                        console.log('加载完成');
                        setTimeout(function() {
                            $('#preload').removeClass('loading').remove('.loading-ani')
                        }, 0)
                    }
                }
                image.src = imgList[index].src
            })
        },
        initDOM: function() {
            var that = this;
            // 加载动画箭头
            if(this.opt.arrow) {
                $('body').append('<span id="arrow"></span>')
            }

            // 加载右侧位置栏
            if(this.opt.indicator) {
                $('body').append('<ul class="indicator"></ul>');
                for(var i=1;i<=this.pagesLength;i++) {
                    $('.indicator').append('<li>' + i + '</li>')
                }
                $('.indecator li').eq(0).addClass('cur');
                this.opt.change = function(data) {
                    $('.indicator li').removeClass('cur')
                        .eq(data.cur).addClass('cur');
                }
            }

            // 加载音乐模块
            if(this.opt.music) {
                var $music = $('body').append('<span id="music"></span>');

                // 创建音乐对象
                var bgAudio = new Audio();
                bgAudio.loadStatus = 'unload';
                bgAudio.loop = this.opt.music.loop;
                bgAudio.controls = 'controls';

                // 加载音乐
                this.loadAudio(bgAudio, this.opt.music.url);
                if(this.opt.music.autoplay) {
                    this.playAudio(bgAudio, this.opt.music.url);
                }

                // 根据播放情况增减动画
                bgAudio.addEventListener('playing', function() {
                    $music.addClass('playing');
                })
                bgAudio.addEventListener('pause', function() {
                    $music.removeClass('playing');
                })

                // 点击开启和关闭音乐，尝试修复ios需要触摸才能播放的问题？？
                $('body').one('touchstart', function () {
                    that.playAudio(bgAudio, this.opt.music.url);
                    $('#music').on('touchstart', function (e) {
                        if (bgAudio.paused) {
                            that.playAudio(bgAudio, this.opt.music.url);
                            return 0;
                        }
                        that.stopAudio();
                        return 1;
                    });
                });
            }
        },
        initEvent: function() {
            var that = this,
                $el = that.$el;

            $el.on('touchstart', function(e) {
                if (!that.status) {
                    // 需要用户点击某个按钮才能继续，获取最近元素，并触发事件
                    $(event.target).triggerHandler('tap');
                    return 1;
                }
                //e.preventDefault();
                if (that.movingFlag) {
                    return 0;
                }

                that.startX = e.targetTouches[0].pageX;
                that.startY = e.targetTouches[0].pageY;
            });
            $el.on('touchend', function(e) {
                if (!that.status) {
                    return 1;
                }
                //e.preventDefault();
                if (that.movingFlag) {
                    return 0;
                }

                // 鼠标偏移量
                var sub = that.opt.dir === 'v' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width;
                // 与最小偏移量的比较，三元表达式的执行顺序由内到外
                var der = (sub > that.opt.der || sub < -that.opt.der) ? (sub > 0 ? -1 : 1) : 0;

                that.moveTo(that.curIndex + der, true, false);
            });
            if (that.opt.drag) {
                $el.on('touchmove', function(e) {
                    if (!that.status) {
                        return 1;
                    }
                    //e.preventDefault();
                    if (that.movingFlag) {
                        that.startX = e.targetTouches[0].pageX;
                        that.startY = e.targetTouches[0].pageY;
                        return 0;
                    }

                    // 计算拖拽页面的偏移量
                    var y = e.changedTouches[0].pageY - that.startY;
                    if( (that.curIndex == 0 && y > 0) || (that.curIndex === that.pagesLength - 1 && y < 0) ) y /= 2;
                    var x = e.changedTouches[0].pageX - that.startX;
                    if( (that.curIndex == 0 && x > 0) || (that.curIndex === that.pagesLength - 1 && x < 0) ) x /= 2;
                    var dist = (that.opt.dir === 'v' ? (-that.curIndex * that.height + y) : (-that.curIndex * that.width + x));
                    $el.removeClass('anim');
                    move($el, that.opt.dir, dist);
                });
            }

            // 翻转屏幕提示
            window.addEventListener('orientationchange', function() {
                if (window.orientation === 180 || window.orientation === 0) {
                    that.opt.orientationchange('portrait');
                }
                if (window.orientation === 90 || window.orientation === -90) {
                    that.opt.orientationchange('landscape');
                }
            }, false);

            window.addEventListener('resize', function() {
                that.update();
            }, false);
        },
        loadAudio: function(audio, url, callback) {
            audio.src = url;
            audio.load();
            audio.addEventListener('canplay', function () {
                bgAudio.loadStatus = 'loaded';
                callback();
            });
            audio.addEventListener('loadstart', function () {
                bgAudio.loadStatus = 'loading';
            });
        },
        playAudio: function(audio, url) {
            var that = this;
            if(audio.loadStatus === 'unload') {
                this.loadAudio(audio, url, function() {
                    that.playAudio(audio, url);
                })
                return 1;
            }
            audio.play();
        },
        stopAudio: function() {
            audio.pause();
        },
        holdTouch: function() {
            $(document).on('touchmove', touchmove);
        },
        unholdTouch: function() {
            $(document).off('touchmove', touchmove);
        },
        start: function() {
            this.status = 1;
            this.holdTouch();
        },
        stop: function() {
            this.status = 0;
            this.unholdTouch();
        },
        moveTo: function(next, anim, ignore) {
            var that = this,
                $el = that.$el,
                cur = that.curIndex,
                next = fix(next, that.pagesLength, that.opt.loop);

            if (anim) {
                $el.addClass('anim');
            } else {
                $el.removeClass('anim');
            }

            if (next !== cur && ignore) {
                var flag = that.opt.beforeChange({
                    cur: cur,
                    next: next
                });

                // beforeChange 显示返回false 可阻止滚屏的发生
                if (flag === false) {
                    return 1;
                }
            }

            that.movingFlag = true;
            that.curIndex = next;
            move($el, that.opt.dir, -next * (that.opt.dir === 'v' ? that.height : that.width));

            if (next !== cur) {
                that.opt.change({
                    prev: cur,
                    cur: next
                });
            }

            window.setTimeout(function() {
                that.movingFlag = false;
                if (next !== cur) {
                    that.opt.afterChange({
                        prev: cur,
                        cur: next
                    });
                    that.$pages.removeClass('cur').eq(next).addClass('cur');
                }
            }, that.opt.duration);

            return 0;
        },
        movePrev: function(anim) {
            this.moveTo(this.curIndex - 1, anim, false);
        },
        moveNext: function(anim) {
            this.moveTo(this.curIndex + 1, anim, false);
        },
        getCurIndex: function () {
            return this.curIndex;
        }
    });

    $.fn.fullpage = function(option) {
        if (!fullpage) {
            fullpage = new Fullpage($(this), option);
        }
        return this;
    };
    $.fn.fullpage.version = '0.5.0';
    //暴露方法
    $.each(['update', 'loadAudio', 'playAudio', 'stopAudio', 'moveTo', 'moveNext', 'movePrev', 'start', 'stop', 'getCurIndex', 'holdTouch', 'unholdTouch'], function(key, val) {
        $.fn.fullpage[val] = function() {
            if (!fullpage) {
                return 0;
            }
            return fullpage[val].apply(fullpage, [].slice.call(arguments, 0));
        };
    });
}(Zepto, window));
