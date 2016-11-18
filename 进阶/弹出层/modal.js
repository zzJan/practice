(function ($, window){
    if (typeof $ === 'undefined') {
        throw new Error('modal requires jQuery');
    }
    var modal = null;
    var d = {
        type: 'confirm',
        title: 'test',
        content: 'sentence',
        pos: {
            x: 100,
            y: 100
        },
        ok: function() {},
        cancel: function() {},
        close: function() {}
    }
    function init(option) {
        var opt = $.extend(true, {}, d, option),
            that = this;

        that.opt = opt;
        that.$el.addClass('ui-modal');

        that.render();
        that.initEvent();
    }
    function Modal($el, option) {
        this.$el = $el;
        init.call(this, option);
    }
    $.extend(Modal.prototype, {
        render: function() {
            if(this.opt.title) {
                this.$el.append('<div class="ui-modal-title"><h1>' + this.opt.title + '</h1><div class="ui-close"><div class="ui-close-btn"></div></div></div>')
            }
            this.$el.append('<div class="ui-modal-content">' + this.opt.content + '</div>');
            if(this.opt.type === 'confirm') {
                this.$el.append('<div class="ui-modal-footer"><div class="ui-ok">确定</div><div class="ui-cancel">取消</div></div>')
            }
            $('body').append('<div class="ui-modal-mask" class="ui-modal-mask"></div>');
            this.$el.show();
            this.setPos();
        },
        setPos: function(top, left) {
            var that = this,
                top = top || that.opt.pos.y,
                left = left || that.opt.pos.x;
            this.$el.css({
                'top': top + 'px',
                'left': left + 'px'
            })
        },
        initEvent: function() {
            var that = this;
            this.drag(this.$el)
            $('ui-cancel').on('click', this.opt.cancel);
            $('ui-ok').on('click', this.opt.ok);
            $('ui-close').on('click', function(e) {
                $('body').remove('<div class="ui-modal-mask" class="ui-modal-mask"></div>');
                that.opt.close;
            });
            if(this.opt.type === 'message') {
                this.delay()
            }
        },
        delay: function(time) {
            var that = this;
            setTimeout(function() {
                that.$el.hide()
            }, time || 1500)
        },
        drag: function($el) {
            var that = this,
                startX = 0,
                startY = 0,
                lastX = 0,
                lastY = 0,
                width = $(window).width(),
                height = $(window).height();
            $el.on('mousedown', function(e) {
                startX = e.clientX - $(this).offset().left;
                startY = e.clientY - $(this).offset().top;
                $el.on('mousemove', function(e) {
                    lastX = Math.max(0, Math.min(width - $(this).width(), e.clientX - startX));
                    lastY = Math.max(0, Math.min(height - $(this).height(), e.clientY - startY));
                    $el.css({
                        'top': lastY + 'px',
                        'left': lastX + 'px'
                    })
                })
            })
            $el.on('mouseup', function(e) {
                $(this).off('mousemove');
            })
        }
    });

    $.fn.modal = function(option) {
        if(!modal) {
            modal = new Modal($(this), option)
        }
        return this;
    }
    $.fn.modal.version = '0.0.1';
    //暴露方法
    $.each(['setPos'], function(key, val) {
        $.fn.modal[val] = function() {
            if (!modal) {
                return 0;
            }
            return modal[val].apply(modal, [].slice.call(arguments, 0));
        };
    });
})(jQuery, window)
