(function () {
    function BannerPlugin(options) {
        return new BannerPlugin.fn.init(options);
    }

    BannerPlugin.fn = BannerPlugin.prototype = {
        constructor: BannerPlugin,

        // 操作参数初始化
        initOptions: function (options) {
            var _default = {
                bannerBox: null,
                initIndex: 0,
                isAuto: true,
                isMouseAuto: false,
                autoInterval: 2000,
                speed: 200,
                width: 550,
                height: 300,
                bannerType: 'default',
                bannerData: [
                    {img:'http://placeholder.qiniudn.com/550x300/5FB878/fff'},
                    {img:'http://placeholder.qiniudn.com/550x300/009688/fff'},
                    {img:'http://placeholder.qiniudn.com/550x300/ff9500/fff'},
                    {img:'http://placeholder.qiniudn.com/550x300/007AFF/fff'}
                    ],
                isFocusShow: true,
                arrowDisplay: 'always',
                focusStyle: 'default',
                lazyImgTime:200,
                haveDesc:false,
                focusPosition:'inner',
                focusEvent:'click',
                isFull:false,
                haveLink:true,
                focusControl:true,
                arrowEvent:'click'
            };

            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    _default[key] = options[key];
                }
            }

            for (var key in _default) {
                if (_default.hasOwnProperty(key)) {
                    this[key] = _default[key];
                }
            }
        },

        // 结构初始化
        initLayout: function () {
            var bannerBox = this.bannerBox;
            bannerBox.className += " bannerBox";
            bannerBox.innerHTML = '<div class="bannerWrap"><ul class="wrapper clearfix"></ul></div>';

            var bannerWrap = this.bannerWrap = bannerBox.getElementsByClassName('bannerWrap')[0],
                wrapper = this.wrapper = bannerWrap.getElementsByClassName('wrapper')[0];


            // 是否加载箭头
            if (this.arrowDisplay !== 'none') {
                bannerWrap.innerHTML += `<a href="javascript:;" class="arrow arrowLeft"></a>
            <a href="javascript:;" class="arrow arrowRight"></a>`;

                this.arrowLeft = bannerBox.getElementsByClassName("arrowLeft")[0];
                this.arrowRight = bannerBox.getElementsByClassName('arrowRight')[0];
            }

            // 是否加载焦点
            if (this.isFocusShow) {
                bannerBox.innerHTML += `<ul class="focusBox clearfix"></ul>`;
                this.focusBox = bannerBox.getElementsByClassName('focusBox')[0];
            }

        },

        // 数据绑定
        bindData: function () {
            var bannerData = this.bannerData,
                bannerWrap = this.bannerWrap = utils.getChilds(this.bannerBox)[0],
                descWidth = (this.width-10)+'px';
            wrapper = utils.getChilds(bannerWrap)[0];
            focusBox = this.focusBox;

            // 如果不设置链接，链接地址为javascript:;
            if(!this.haveLink){
                for (var i = 0; i < bannerData.length; i++) {
                    bannerData[i].link="javascript:;";
                }
            }else{ //如果设置链接，但是没有链接地址或者链接地址为空,链接地址转换为javascript:;
                for (var i = 0; i < bannerData.length; i++) {
                    var item=bannerData[i];
                    if(!item.link || item.link==="" || item.link==="#"){
                        item.link="javascript:;";
                    }
                }
            }


            var strSlide = ``,
                strFocus = ``;

            if(this.haveDesc){
                for (var i = 0; i < bannerData.length; i++) {
                    var item = bannerData[i];
                    if(item.desc && item.desc!==""){
                        strSlide += `<li class="slide">
                        <a href="${item.link}" class="slideLink">
                            <img src="" data-img="${item.img}" alt="" class="slideImg">
                            <div class="desc" style="width:${descWidth};">${item.desc}</div>
                        </a>
                        </li>`;
                    }else{
                        strSlide += `<li class="slide">
                            <a href="${item.link}" class="slideLink">
                                <img src="" data-img="${item.img}" alt="" class="slideImg">
                            </a>
                        </li>`;
                    }
                    strFocus += '<li></li>';
                }
            }else{
                for (var i = 0; i < bannerData.length; i++) {
                    var item = bannerData[i];
                    strSlide += `<li class="slide">
                    <a href="${item.link}" class="slideLink">
                        <img src="" data-img="${item.img}" alt="" class="slideImg">
                    </a>
                </li>`;
                    strFocus += '<li></li>';
                }
            }

            wrapper.innerHTML = strSlide;
            this.isFocusShow ? focusBox.innerHTML = strFocus : null;

            // 上下、左右切换，需要追加第一张图片在wapper中图片末尾
            var bannerBox = this.bannerBox,
                bannerWrap = this.bannerWrap = utils.getChilds(bannerBox)[0],
                wrapper = this.wrapper = utils.getChilds(bannerWrap)[0],
                slideList = this.slideList = utils.getChilds(wrapper);
            this.bannerType!=='fade'?wrapper.appendChild(utils.getChilds(wrapper)[0].cloneNode(true)):null;

        },

        // 轮播图类型初始化
        initType: function initLayout() {
            var bannerType = this.bannerType,
                width = this.width,
                height = this.height;

            var bannerBox = this.bannerBox,
                bannerWrap = this.bannerWrap = utils.getChilds(bannerBox)[0],
                wrapper = this.wrapper = utils.getChilds(bannerWrap)[0],
                slideList = this.slideList = utils.getChilds(wrapper),
                slideLink = this.slideLink = wrapper.getElementsByClassName('slideLink'),
                slideImgs = this.slideImgs = wrapper.getElementsByClassName('slideImg'),
                arrowLeft = this.arrowLeft = bannerWrap.getElementsByClassName('arrowLeft')[0],
                arrowRight = this.arrowRight = bannerWrap.getElementsByClassName('arrowRight')[0],
                focusBox = this.focusBox,
                focusList = this.focusList =this.isFocusShow?utils.getChilds(focusBox):null;
            var arrowDisplay = this.arrowDisplay;
            // 初始化容器大小
            if(this.isFull){
                var fullWidth=utils.winbox('clientWidth'),
                    fullHeight=utils.winbox('clientHeight');
                utils.css(bannerBox, {width: fullWidth, height: fullHeight,margin:0});
            }else{
                utils.css(bannerBox, {width: width, height: height});
            }

            // 获取容器实际大小（包含边框）
            var bannerWidth = this.bannerWidth = bannerBox.offsetWidth,
                bannerHeight = this.bannerHeight = bannerBox.offsetHeight;
            utils.css(bannerWrap, {width: bannerWidth, height: bannerHeight});
            utils.css(wrapper, 'width', bannerWidth);
            for (var i = 0; i < slideList.length; i++) {
                utils.css(slideList[i], {width: bannerWidth, height: bannerHeight});
                utils.css(slideLink[i], {width: bannerWidth, height: bannerHeight});
                utils.css(slideImgs[i], {width: bannerWidth, height: bannerHeight});
            }


            // 初始化轮播图类型结构

            // 左右切换
            if (bannerType === 'default') {
                // (图片左浮动，另设wrapper的宽度)
                for (var j = 0; j < slideList.length; j++) {
                    utils.css(slideList[j], {float: 'left', display: 'block', opacity: 1});
                }
                utils.css(wrapper, 'width', bannerWidth * (slideList.length));
                // arrow的位置（默认就好，不用设置）
            }

            // 上下切换
            if (bannerType === 'updown') {
                // wrapper高度设置，图片显示设置
                for (var j = 0; j < slideList.length; j++) {
                    utils.css(slideList[j], {display: 'block', opacity: 1});
                }

                // arrow的位置（设为贴近上下边框居中）
                if (arrowDisplay !== 'none') {
                    utils.css(arrowLeft, {
                        top: -8.5,
                        marginTop: 0,
                        left: '50%',
                        marginLeft: -14,
                        transform: 'rotate(90deg)',
                        msTransform: 'rotate(90deg)', /* IE 9 */
                        MozTransform: 'rotate(90deg)', /* Firefox */
                        webkitTransform: 'rotate(90deg)', /* Safari 和 Chrome */
                        oTransform: 'rotate(90deg)'      /* Opera */
                    });
                    utils.css(arrowRight, {
                        top: '100%',
                        marginTop: -36.5,
                        left: '50%',
                        marginLeft: -14,
                        transform: 'rotate(90deg)',
                        msTransform: 'rotate(90deg)', /* IE 9 */
                        MozTransform: 'rotate(90deg)', /* Firefox */
                        webkitTransform: 'rotate(90deg)', /* Safari 和 Chrome */
                        oTransform: 'rotate(90deg)'       /* Opera */
                    })
                }

                // focusBox的位置
                if (this.isFocusShow) {
                    for (var k = 0; k < focusList.length; k++) {
                        utils.css(focusList[k], {
                            float: 'none',
                            margin: '6px 0'
                        });
                    }

                    var focusBoxH = utils.css(focusBox, 'height');
                    utils.css(focusBox, {
                        padding: '0 5px',
                        position: 'absolute',
                        right: '20',
                        top: '50%',
                        marginTop: -focusBoxH / 2
                    });
                }
            }

            // 渐隐渐现
            if (bannerType === 'fade') {
                utils.css(wrapper, 'width', bannerWidth);
                // 图片绝对定位，z-index=0，opacity=0
                for (var j = 0; j < slideList.length; j++) {
                    utils.css(slideList[j], {position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0});
                }
                // arrow不用设置（默认使用即可）
            }

            // 焦点位置（左右切换和渐隐渐现）
            if(this.isFocusShow && this.bannerType!=='updown'){
                if(this.focusPosition==='outer'){
                    var disY=bannerHeight+focusBox.offsetHeight/2;
                    utils.css(focusBox,{top:disY});
                    utils.css(this.bannerBox,'marginBottom',focusBox.offsetHeight*2);
                }else if(this.focusPosition==='inner'){
                    var disY=bannerHeight-focusBox.offsetHeight*1.5;
                    utils.css(focusBox,'top',disY);
                }

            }
        },

        // 小部件样式配置
        initStyle: function () {
            var arrowLeft = this.arrowLeft,
                arrowRight = this.arrowRight,
                focusBox = this.focusBox,
                focusList = this.focusList,
                focusPosition=this.focusPosition,
                bannerBox=this.bannerBox;

            // arrow显示效果
            // (hidden，悬停显示；always，一直显示，不用设置)
            if (this.arrowDisplay === 'hidden') {
                // 上下轮播图
                if (this.bannerType === 'updown') {
                    utils.css(arrowLeft, {opacity: 0, top: 2.5, zIndex: 9999});
                    utils.css(arrowRight, {opacity: 0, marginTop: -46.5, zIndex: 9999});
                    utils.on(bannerBox, 'mouseenter', function () {
                        utils.animate({
                            ele: arrowLeft,
                            target: {opacity: 0.2, top: -8.5},
                            duration: 200
                        });
                        utils.animate({
                            ele: arrowRight,
                            target: {opacity: 0.2, marginTop: -36.5},
                            duration: 200
                        });
                    });
                    utils.on(bannerBox, 'mouseleave', function () {
                        utils.animate({
                            ele: arrowLeft,
                            target: {opacity: 0, top: 2.5},
                            duration: 200
                        });
                        utils.animate({
                            ele: arrowRight,
                            target: {opacity: 0, marginTop: -46.5},
                            duration: 200
                        });
                    });
                    utils.on(arrowLeft, 'mouseenter', function () {
                        utils.css(this, 'opacity', 0.5);
                    });
                    utils.on(arrowRight, 'mouseenter', function () {
                        utils.css(this, 'opacity', 0.5);
                    });
                    utils.on(arrowLeft, 'mouseleave', function () {
                        utils.css(this, 'opacity', 0.2);
                    });
                    utils.on(arrowRight, 'mouseleave', function () {
                        utils.css(this, 'opacity', 0.2);
                    });
                }

                // 左右轮播图
                if (this.bannerType === 'default' || this.bannerType === 'fade') {
                    utils.css(arrowLeft, {opacity: 0, left: 10, zIndex: 9999});
                    utils.css(arrowRight, {opacity: 0, right: 10, zIndex: 9999});
                    utils.on(bannerBox, 'mouseenter', function () {
                        utils.animate({
                            ele: arrowLeft,
                            target: {opacity: 0.2, left: 0},
                            duration: 200
                        });
                        utils.animate({
                            ele: arrowRight,
                            target: {opacity: 0.2, right: 0},
                            duration: 200
                        });
                    });
                    utils.on(bannerBox, 'mouseleave', function () {
                        utils.animate({
                            ele: arrowLeft,
                            target: {opacity: 0, left: 10},
                            duration: 200
                        });
                        utils.animate({
                            ele: arrowRight,
                            target: {opacity: 0, right: 10},
                            duration: 200
                        });
                    });

                    utils.on(arrowLeft, 'mouseenter', function () {
                        utils.css(this, 'opacity', 0.5);
                    });
                    utils.on(arrowRight, 'mouseenter', function () {
                        utils.css(this, 'opacity', 0.5);
                    });
                    utils.on(arrowLeft, 'mouseleave', function () {
                        utils.css(this, 'opacity', 0.2);
                    });
                    utils.on(arrowRight, 'mouseleave', function () {
                        utils.css(this, 'opacity', 0.2);
                    });
                }

            }

            // focusBox显示样式效果
                // - 样式focusStyle
                // - 默认 default（默认有边框）
                // - 圆点 dash
                // - 圆环 cycle
                // - 方形 square
            var focusStyle = this.focusStyle;

            focusStyleConfig(focusStyle);

            function focusStyleConfig(focusStyle) {
                if (focusStyle === 'default') return;
                utils.css(focusBox, 'backgroundColor', 'transparent');
                if(focusStyle==='dash'){
                    if(focusPosition==='outer'){
                        console.log('dash outer');
                        for (var i = 0; i < focusList.length; i++) {
                            utils.css(focusList[i],'backgroundColor','#444');
                        }

                    }
                    return;
                }

                for (var i = 0; i < focusList.length; i++) {
                    utils.css(focusList[i], {border: '2px solid white', background: 'black'});
                }
                if (focusStyle === 'cycle') return;
                for (var j = 0; j < focusList.length; j++) {
                    utils.css(focusList[j], 'borderRadius', 0);
                }
            }
        },

        // 图片延迟加载
        lazyImg:function(){
            var imgList=this.slideImgs;
            var _this=this;

            var timer=setTimeout(function () {
                Array.prototype.forEach.call(imgList,function(curImg){
                    var tempImg=new Image;
                    tempImg.onload=function(){
                        curImg.src=this.src;
                        curImg.style.display="block";
                        utils.animate({
                            ele:curImg,
                            target:{opacity:1},
                            duration:200
                        });
                        tempImg=null;
                    };
                    tempImg.src=curImg.getAttribute('data-img');
                });
                clearTimeout(timer);
            },_this.lazyImgTime);
        },

        // 默认展示
        initShow: function () {
            var bannerBox = this.bannerBox,
                wrapper = this.wrapper,
                slideList = this.slideList,
                focusList = this.focusList;

            var bannerType = this.bannerType,
                bannerWidth = this.bannerWidth,
                bannerHeight = this.bannerHeight,
                initIndex = this.initIndex;

            // 焦点对齐
            if(this.isFocusShow){
                focusList[initIndex].className = 'select';
            }
            // 左右切换默认展示
            if (bannerType === 'default') {
                utils.css(wrapper, 'left', -initIndex * bannerWidth);
            }

            // 上下切换默认展示
            if (bannerType === 'updown') {
                utils.css(wrapper, 'top', -initIndex * bannerHeight);
            }

            // 渐隐渐现默认展示
            if (bannerType = 'fade') {
                utils.css(slideList[initIndex], {
                    zIndex: 1,
                    opacity: 1
                });
            }
        },

        // 自动切换
        wrapperSwitch: function () {
            if (this.bannerType === 'default') {
                utils.animate({
                    ele: this.wrapper,
                    duration: this.speed,
                    target: {
                        left: -this.initIndex * this.bannerWidth
                    }
                });
            }
            if (this.bannerType === 'updown') {
                utils.animate({
                    ele: this.wrapper,
                    duration: this.speed,
                    target: {
                        top: -this.initIndex * this.bannerHeight
                    }
                });
            }
        },
        autoMove: function () {
            var bannerBox = this.bannerBox,
                wrapper = this.wrapper,
                slideList = this.slideList,
                focusList = this.focusList;

            var bannerType = this.bannerType,
                bannerWidth = this.bannerWidth,
                bannerHeight = this.bannerHeight,
                speed = this.speed;
            // 左右切换
            // 注意，因为initIndex是要双向改变的，所以，直接用this.initIndex,不用initIndex代用，因为这样this.initIndex不会改变。
            /*
            * 比如：
            * var initIndex=this.initIndex;
            * initIndex=0;
            * this.initIndex不会变成0
            *
            * */
            if (bannerType === 'default') {
                this.initIndex++;
                if (this.initIndex === slideList.length) {
                    utils.css(wrapper, 'left', 0);
                    this.initIndex = 1;
                }
                this.wrapperSwitch();
            }

            // 上下切换
            if (bannerType === 'updown') {
                this.initIndex++;
                if (this.initIndex === slideList.length) {
                    utils.css(wrapper, 'top', 0);
                    this.initIndex = 1;
                }
                this.wrapperSwitch();
            }

            // 渐隐渐现
            if (bannerType === 'fade') {
                var prevIndex = this.initIndex;
                this.initIndex++;
                this.initIndex === slideList.length ? this.initIndex = 0 : null;
                var curSlide = slideList[this.initIndex],
                    prevSlide = slideList[prevIndex];

                prevSlide.style.zIndex=0;
                curSlide.style.zIndex=1;
                utils.animate({
                    ele: curSlide,
                    duration: speed,
                    target: {opacity: 1},
                    callBack: function () {
                        utils.css(prevSlide, 'opacity', 0);
                    }
                })
            }

            this.isFocusShow?this.focusSelect():null;
        },

        // 焦点对齐
        focusSelect: function () {
            var focusList = this.focusList,
                initIndex = this.initIndex,
                slideList = this.slideList,
                bannerType = this.bannerType;
            if (bannerType !== 'fade') {
                initIndex === slideList.length - 1 ? initIndex = 0 : null;
            }

            for (var i = 0; i < focusList.length; i++) {
                focusList[i].className = '';
            }
            focusList[initIndex].className = 'select';

        },

        // 鼠标控制
        mouseTrigger: function () {
            var _this = this;
            var bannerBox = _this.bannerBox;
            if (_this.isAuto && !_this.isMouseAuto) {
                utils.on(bannerBox, 'mouseenter', function () {
                    clearInterval(_this.autoTimer);
                });
                utils.on(bannerBox, 'mouseleave', function () {
                    _this.autoTimer = setInterval(function () {
                        _this.autoMove();
                    }, _this.autoInterval);
                });
            }
        },

        // 焦点控制切换
        focusTrigger: function () {
            if(!this.focusControl)return;
            var focusList = this.focusList,
                slideList = this.slideList,
                bannerType = this.bannerType,
                wrapper = this.wrapper,
                prevIndex = this.initIndex,
                focusEvent=this.focusEvent;
            var _this = this;
            for (var i = 0; i < focusList.length; i++) {
                var item = focusList[i];
                item.index = i;
                // 渐隐渐现
                if (bannerType === 'fade') {
                    utils.on(item, focusEvent, function () {
                        prevIndex = _this.initIndex;
                        _this.initIndex = this.index;
                        focusList[prevIndex].className = '';
                        this.className = 'select';

                        var curSlide = slideList[_this.initIndex],
                            prevSlide = slideList[prevIndex];

                        prevSlide.style.zIndex=0;
                        curSlide.style.zIndex=1;
                        utils.animate({
                            ele: curSlide,
                            duration: 300,
                            target: {opacity: 1},
                            callBack: function () {
                                utils.css(prevSlide, 'opacity', 0);
                            }
                        });
                    });
                }
                // 左右切换
                if (bannerType === 'default') {
                    utils.on(item, focusEvent, function () {
                        _this.initIndex = this.index;
                        utils.animate({
                            ele: wrapper,
                            duration: _this.speed,
                            target: {
                                left: -_this.initIndex * _this.bannerWidth
                            }
                        })
                        _this.focusSelect();
                    });
                }

                // 上下切换
                if (bannerType === 'updown') {
                    utils.on(item, focusEvent, function () {
                        _this.initIndex = this.index;
                        utils.animate({
                            ele: wrapper,
                            duration: _this.speed,
                            target: {
                                top: -_this.initIndex * _this.bannerHeight
                            }
                        })
                        _this.focusSelect();
                    });
                }
            }
        },

        // 箭头控制切换
        arrowTrigger: function () {
            var arrowLeft = this.arrowLeft,
                arrowRight = this.arrowRight,
                arrowEvent=this.arrowEvent,
                wrapper = this.wrapper,
                bannerWidth = this.bannerWidth,
                bannerHeight = this.bannerHeight,
                bannerType = this.bannerType,
                speed = this.speed,
                slideList = this.slideList;

            var _this = this;
            utils.on(arrowRight, arrowEvent, function () {
                _this.autoMove();
            });
            utils.on(arrowLeft, arrowEvent, function () {
                // 左右轮播
                if (bannerType === 'default') {
                    _this.initIndex--;
                    if (_this.initIndex === -1) {
                        var disLeft = (_this.slideList.length - 1) * bannerWidth;
                        utils.css(wrapper, 'left', -disLeft);
                        _this.initIndex = _this.slideList.length - 2;
                    }
                    _this.wrapperSwitch();

                }

                //上下轮播
                if (bannerType === 'updown') {
                    _this.initIndex--;
                    if (_this.initIndex === -1) {
                        utils.css(wrapper, 'top', -(_this.slideList.length - 1) * bannerHeight);
                        _this.initIndex = _this.slideList.length - 2;
                    }
                    _this.wrapperSwitch();
                }

                // 渐隐渐现
                if (bannerType === 'fade') {
                    var prevIndex = _this.initIndex;
                    _this.initIndex--;
                    _this.initIndex === -1 ? _this.initIndex = slideList.length - 1 : null;
                    var curSlide = slideList[_this.initIndex],
                        prevSlide = slideList[prevIndex];

                    prevSlide.style.zIndex=0;
                    curSlide.style.zIndex=1;
                    utils.animate({
                        ele: curSlide,
                        // duration: _this.speed,
                        duration: 500,
                        target: {opacity: 1},
                        callBack: function () {
                            utils.css(prevSlide, 'opacity', 0);
                        }
                    });
                }

                _this.isFocusShow?_this.focusSelect():null;
            });
        },

        // destroy 注销
        destroy: function () {
            this.bannerBox.parentNode.removeChild(this.bannerBox);
        }
    };

    var init = BannerPlugin.fn.init = function (options) {
        // options参数初始化
        this.initOptions(options);

        // 结构初始化
        this.initLayout();

        // 数据绑定
        this.bindData();

        // 轮播图类型初始化
        this.initType();

        // 小部件样式配置
        this.initStyle();

        // 延迟加载
        this.lazyImg();

        // 默认展示
        this.initShow();

        // 自动切换
        var _this = this;
        if (this.isAuto) {
            this.autoTimer = setInterval(function () {
                _this.autoMove();
            }, this.autoInterval);
        }

        // 鼠标控制
        this.mouseTrigger();
        // 焦点控制
        this.isFocusShow?this.focusTrigger():null;
        // 箭头控制
        this.prevIndex = this.initIndex;
        this.arrowDisplay!=='none'?this.arrowTrigger():null;
    };
    init.prototype = BannerPlugin.fn;

    // 扩展
    BannerPlugin.extend = function (obj, deep) {
        typeof deep === 'undefined' ? deep = false : null;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (BannerPlugin.prototype.hasOwnProperty(key)) {
                    if (deep) {
                        BannerPlugin.prototype[key] = obj[key];
                    }
                    continue;
                }
                BannerPlugin.prototype[key] = obj[key];
            }
        }
    };

    window.BannerPlugin = BannerPlugin;
})();