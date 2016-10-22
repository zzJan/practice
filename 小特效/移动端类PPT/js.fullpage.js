(function(window) {
    var d = {
        el: '.wp-inner',    // 每屏的外部包含，默认是 '.wp-inner'
        pageName: '.page',    // 每屏的选择符，默认是 .page
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
        dir: 'vertical',    // 切换方向，默认垂直方向(vertical horizonal)
        der: 0.1,   // 当滑动距离大于一个值时，才会引起滑动现象，滑动距离=der*屏幕高度|宽度，默认值为0.1
        beforeChange: function(data) {},    // 翻页前执行的回调
        change: function(data) {},    // 翻页时执行的回调
        afterChange: function(data) {},    // 翻页后执行的回调
        orientationchange: function(orientation) {}    // 旋转屏幕时执行的回调
    };

    function createNode(nodename, id, classnames, text) {
        var node = document.createElement(nodename);
        if(id) node.id = id;
        if(classnames) {
            classnames.forEach(function(value) {
                node.className += value;
            })
        }
        if(text) node.textContent = text;
        this.appendChild(node);
        return node;
    }

    function Fullpage(option) {
        this.init(option);
    };
    Fullpage.prototype = {
        // 初始化
        init: function(option) {
            var opt = option ? option : {};
            for(var key in d) {
                if(!opt.hasOwnProperty(key)) {
                    opt[key] = d[key]
                }
            }
            // 当前页
            this.curIndex = -1;
            this.opt = opt;
            // 起始点
            this.startX = 0;
            this.startY = 0;
            // 是否正在翻页
            this.movingFlag = false;

            this.el = document.querySelector(this.opt.el);
            this.el.classList.add('fullPage-wp');
            // 根元素
            this.parentEl = this.el.parentNode;

            // 所有页
            this.pageEls = document.querySelectorAll(opt.pageName);
            this.pageEls.forEach(function(pageEl) {
                pageEl.classList.add('fullPage-page', 'fullPage-dir-' + opt.dir)
            })
            // 总页数
            this.pagesLength = this.pageEls.length;
            this.update();
            this.preload();
            this.initEvent();
            this.initDOM();
            this.start();
        },
        // 循环翻页
        fix: function(cur, pagesLength, loop) {
            if(cur < 0) {
                return !!loop ? pagesLength - 1 :0
            }
            if(cur >= pagesLength) {
                return !!loop ? 0 : pagesLength - 1;
            }
            return cur;
        },
        // 启用拖拽页面后，拖拽动画的定义
        move: function(el, dir, dist) {
            var xPx = '0px',
                yPx = '0px';
            if(dir === 'vertical') {
                yPx = dist + 'px';
            } else {
                xPx = dist + 'px'
            }
            el.style.cssText += (';-webkit-transform: translate3d(' + xPx + ', ' + yPx + ', 0px);' +
                                    'transform: translate3d(' + xPx + ', ' + yPx + ', 0px);');
        },
        // 此方法会重新计算和渲染每屏的高度还有滚屏的方向，当你发现如果每屏的高度有问题时，手动调用下此方法就可以了
        update: function() {
            var that = this;
            if(this.opt.dir === 'horizonal') {
                this.width = this.parentEl.offsetWidth;
                this.pageEls.forEach(function(pageEl) {
                    pageEl.style.width = that.width + 'px'
                })
                this.el.style.width = (this.width * this.pagesLength) + 'px';
            }

            this.height = this.parentEl.offsetHeight;

            this.pageEls.forEach(function(pageEl) {
                pageEl.style.height = that.height + 'px';
            })
            this.moveTo(this.curIndex < 0 ? this.opt.start : this.curIndex)
        },
        preload: function() {
            if(this.opt.preload) return 0;
            var imgList = this.opt.preload,
                image = new Image(),
                loaded = 0;
            imgList.forEach(function(img, index) {
                image.onload = function() {
                    if(++loaded > imgList.length) {
                        console.log('加载完成');
                        setTimeout(function() {
                            document.querySelector('.loading').classList.remove('loading');
                        }, 0)
                    }
                }
                image.src = imgList[index].src
            })
        },
        initEvent: function() {
            var that = this;
            this.el.addEventListener('touchstart', function(e) {
                // 是否允许执行touchstart事件
                if(!that.status) {
                    // 需要用户点击某个按钮才能继续，获取最近元素，并触发事件
                    $(event.target).trigger('tap');
                    return 1;
                }
                // e.preventDefault();
                // 是否正在翻页
                if(that.movingFlag) {
                    return 0;
                }
                // 记录初始位置
                that.startX = e.targetTouches[0].pageX;
                that.startY = e.targetTouches[0].pageY;
            });
            this.el.addEventListener('touchend', function(e) {
                // 是否允许执行touchend事件
                if(!that.status) {
                    return 1;
                }
                // e.preventDefault();
                // 是否正在翻页
                if(that.movingFlag) {
                    return 0;
                }

                // 鼠标偏移量
                var sub = that.opt.dir === 'vertical' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width;
                // console.log(sub)
                // 与最小偏移量的比较，三元表达式的执行顺序由内到外
                var der = (sub > that.opt.der || sub < -that.opt.der) ? (sub > 0 ? -1 : 1) : 0;
                // console.log(der);
                // console.log(that.curIndex);
                that.moveTo(that.curIndex + der, true, false);
            })
            if(this.opt.drag) {
                this.el.addEventListener('touchmove', function(e) {
                    // 是否允许执行touchmove事件
                    if(!that.status) {
                        return 1;
                    }
                    // e.preventDefault();
                    // 是否正在翻页
                    if(that.movingFlag) {
                        that.startX = e.targetTouches[0].pageX;
                        that.stratY = e.targetTouches[0].pageY;
                        return 0;
                    }
                    // 计算拖拽页面的偏移量
                    var y = e.changedTouches[0].pageY - that.startY,
                        x = e.changedTouches[0].pageX - that.startX;
                    if( (that.curIndex === 0 && y > 0) || (that.curIndex === that.pagesLength - 1 && y < 0)) {
                        y /= 2;
                    }
                    if( (that.curIndex === 0 && x > 0) || (that.curIndex === that.pagesLength - 1 && x < 0)) {
                        x /= 2;
                    }
                    var dist = (that.opt.dir === 'vertical' ? (-that.curIndex * that.height + y) : (-that.curIndex * that.width + x));
                    that.el.classList.remove('anim');
                    that.move(that.el, that.opt.dir, dist)
                })
            }

            // 翻转屏幕提示
            window.addEventListener('orientationchange', function() {
                if(window.orientation === 0 || window.orientation === 180) {
                    that.opt.orientationchange('portrait');
                } else if(window.orientation === 90 || window.orientation === -90) {
                    that.opt.orientationchange('landscape');
                }
            }, false);

            // 屏幕尺寸修改
            window.addEventListener('resize', function() {
                that.update();
            }, false);
        },
        initDOM: function() {
            var that = this;
            // 加载动画箭头
            if(this.opt.arrow) {
                createNode.call(document.body, 'span', 'arrow');
            }


            // 加载右侧位置栏
            if(this.opt.indicator) {
                createNode.call(document.body, 'ul', null, ['indicator']);
                for(var i=1;i<=this.pagesLength;i++) {
                    createNode.call(document.querySelector('.indicator'), 'li', null, null, i)
                }
                this.opt.change = function(data) {
                    document.querySelectorAll('.indicator li').forEach(function(node) {
                        node.classList.remove('cur');
                    });
                    document.querySelectorAll('.indicator li')[data.cur].classList.add('cur');
                }
            }

            // 加载音乐模块
            if(this.opt.music) {
                // 插入元素节点
                createNode.call(document.body, 'span', 'music');

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
                    document.querySelector('#music').classList.add('play')
                })
                bgAudio.addEventListener('pause', function() {
                    document.querySelector('#music').classList.remove('play')
                })

                // 点击开启和关闭音乐
                document.querySelector('#music').addEventListener('touchend', function() {
                    if(bgAudio.paused) {
                        that.playAudio(bgAudio, that.opt.music.url)
                        return 0;
                    } else {
                        that.stopAudio(bgAudio);
                        return 1;
                    }
                })

                // 尝试修复ios需要触摸才能播放的问题？？
                $(document).one('touchstart', function() {
                    that.playAudio(bgAudio, that.opt.music.url);
                })
            }
        },
        // 读取音频
        loadAudio: function(audio, url, callback) {
            audio.src = url;
            audio.load();
            audio.addEventListener('canplay', function() {
                audio.loadStatus = 'loaded';
                if(callback) callback();
            })
            audio.addEventListener('loadstart', function() {
                audio.loadStatus = 'loading';
            })
        },
        // 播放音频
        playAudio: function(audio, url) {
            var that = this;
            if(audio.loadStatus === 'unload') {
                this.loadAudio(audio, url, function() {
                    that.playAudio(audio, url);
                })
                return 1;
            }
            console.log(audio)
            audio.play();
        },
        // 暂停音频
        stopAudio: function(audio) {
            audio.pause();
        },
        // 重写touchmove事件，禁止滑屏
        touchmove: function(e) {
            e.preventDefault()
        },
        // 监控页面触摸，页面的touchmove事件会被阻止掉，默认开启
        holdTouch: function() {
            document.addEventListener('touchmove', this.touchmove);
        },
        // 释放页面触摸，在浏览器开启滑动翻页时，这样可能会有问题
        unholdTouch: function() {
            document.removeEventListener('touchmove', this.touchmove);
        },
        // 开启切换功能，和stop配合使用。每次调用start时都会调用holdTouch
        start: function() {
            this.status = 1;
            this.holdTouch();
        },
        // 关闭切换功能，和start配合使用。每次调用stop时都会调用unholdTouch，比如到了某页需要点击某个元素后才能到下一页的时候 这个就有用了
        stop: function() {
            console.log('stop')
            this.status = 0;
            this.unholdTouch();
        },
        // 获取当前位于第几屏的方法（第一屏的索引为0）
        getCurIndex: function() {
            return this.curIndex;
        },
        // 切换到指定屏，如果指定的屏数大于屏总数或小于0，都会做修正处理
        moveTo: function(next, anim, ignore) {
            var that = this,
                next = this.fix(next, this.pagesLength, this.opt.loop),
                cur = this.curIndex;
                // console.log('next: '+next)
                // console.log('cur: '+cur)
            if(anim) {
                this.el.classList.add('anim');
            } else {
                this.el.classList.remove('anim');
            }
            if(next !== cur && !ignore) {
                // beforeChange的e包含两个属性next和cur，表示当前屏和将要切换的下一屏
                var flag = this.opt.beforeChange({
                    cur: cur,
                    next: next
                })
                // 若beforeChange显示返回false，则可阻止滚屏的发生
                if(flag === false) {
                    return 1;
                }
            }
            this.movingFlag = true;
            this.curIndex = next;
            // console.log('curIndex: '+this.curIndex)
            this.move(this.el, this.opt.dir, -next * (this.opt.dir === 'vertical' ? this.height : this.width));

            if(next !== cur) {
                // change的e包含两个属性prev和cur，表示前一屏和当前屏（和beforeChange的区别就是此时切换已经发生了，切不可逆转）
                this.opt.change({
                    prev: cur,
                    cur: next
                });
            }

            setTimeout(function() {
                that.movingFlag = false;
                if(next !== cur) {
                    // afterChange的e包含两个属性prev和cur，表示前一屏和当前屏（和beforeChange的区别就是此时切换已经发生了，切不可逆转）
                    that.opt.afterChange({
                        prev: cur,
                        cur: next
                    });
                    that.pageEls.forEach(function(pageEl, i) {
                        if(i === next) {
                            pageEl.classList.add('cur')
                        } else {
                            pageEl.classList.remove('cur')
                        }
                    })
                }
            }, that.opt.duration)
        },
        // 向前一屏，是对moveTo的封装
        movePrev: function(anim) {
            this.moveTo(this.curIndex - 1, anim, false)
        },
        // 向后一屏，是对moveTo的封装
        moveNext: function(anim) {
            this.moveTo(this.curIndex + 1, anim, false)
        }
    }
    window.Fullpage = Fullpage;


}(window))
