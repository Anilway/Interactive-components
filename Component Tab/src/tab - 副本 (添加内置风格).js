var switchTab=(function(){
	var colorStyle={
		default:{color:"black",bgColor:"#E6E6E6"},
		primary:{color:"white",bgColor:"#007BFF"},
		secondary:{color:"white",bgColor:"#6C757D"},
		success:{color:"white",bgColor:"#28A745"},
		danger:{color:"white",bgColor:"#DC3545"},
		warning:{color:"black",bgColor:"#FFC107"},
		info:{color:"white",bgColor:"#17A2B8"},
		light:{color:"black",bgColor:"#F8F9FA"},
		dark:{color:"white",bgColor:"#343A40"}
	}
	function SwitchTag(tabBox,options){
		this.tabBox=tabBox;
		_default={
			// 样式设置
			height:100,
			average:false,
			// style:"default",
			tabBoxStyle:{},
			tagStyle:{},
			tagActiveStyle:{},
			tagBoxStyle:{},
			conBoxStyle:{},
			conStyle:{},
			// 选项卡操作设置
			eventType:'click',
			initIndex:0,
			tags:['选项卡1','选项卡2','选项卡3'],
		};
		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}

		this.height=_default.height;
		this.width=_default.width;
		this.average=_default.average;
		this.style=_default.style;
		this.tabBoxStyle=_default.tabBoxStyle;
		this.tagStyle=_default.tagStyle;
		this.tagActiveStyle=_default.tagActiveStyle;
		this.tagBoxStyle=_default.tagBoxStyle;
		this.conBoxStyle=_default.conBoxStyle;
		this.conStyle=_default.conStyle;
		this.eventType=_default.eventType;
		this.initIndex=_default.initIndex;
		this.tags=_default.tags;
		this.fun=_default.fun;

		this.init();
	}

	SwitchTag.prototype={
		constructor:SwitchTag,
		init:init,
		initStyle:initStyle,
		tagSwitch:tagSwitch,
		clear:clear
	};

	function init(){
		var tabBox=this.tabBox,
			tag=dom.getEleByClass('tabBox-tab',tabBox)[0],
			tagList=dom.getEleByClass('tabBox-tabTag',tag),
			con=dom.getEleByClass('tabBox-con',tabBox)[0],
			conList=dom.getEleByClass('tabBox-conTag',con);

		this.tag=tag;
		this.tagList=tagList;
		this.con=con;
		this.conList=conList;
		this.prevIndex=this.initIndex;

		this.initStyle();
		this.clear();
		this.tagSwitch(this.fun);
	}	

	function initStyle(){
		var tabBox=this.tabBox,
			tag=this.tag,
			tagList=this.tagList,
			con=this.con,
			conList=this.conList,
			style=this.style;

		var	height=this.height,
			width=this.width;
			tagBg=this.tagBg;
			tabBoxStyle=this.tabBoxStyle;
			tagStyle=this.tagStyle;
			tagBoxStyle=this.tagBoxStyle;
			conStyle=this.conStyle;
			conBoxStyle=this.conBoxStyle;

		// 风格初始化
		// if(style){
		// 	var colorCss=colorStyle[style];
		// 	this.colorCss=colorCss;	
		// 	tabBoxStyle.borderColor=colorCss.bgColor;
		// 	tagBoxStyle.backgroundColor=colorCss.bgColor;
		// 	tagBoxStyle.color=colorCss.color;
		// }

		

		// 自定义样式初始化渲染
		dom.css(tabBox,{height:height,width:width});
		dom.css(tabBox,tabBoxStyle);

		// 选项卡标签宽度平均分布
		if(this.average){
			var num=tagList.length,
				widthAll=dom.css(tabBox,'width');
			tagStyle.width=Math.round(widthAll/num)-1.5;
		}
		dom.css(tag,tagBoxStyle);
		dom.css(con,conBoxStyle);
		for (var i = 0; i < tagList.length; i++) {
			dom.css(tagList[i],tagStyle);
			dom.css(conList[i],conStyle);
		}
	}

	function tagSwitch(fun){
		var tagList=this.tagList,
			conList=this.conList,
			prevIndex=this.prevIndex,
			tag=this.tag;

		var tagActiveStyle=this.tagActiveStyle,
			conActiveStyle=this.conActiveStyle,
			tagStyle=this.tagStyle,
			conStyle=this.conStyle,
			tagBoxStyle=this.tagBoxStyle;

		var _this=this;

		for (var i = 0; i < tagList.length; i++) {
			tagList[i].myIndex=i;
			tagList[i]["on"+this.eventType]=function(){
				tagList[prevIndex].className="tabBox-tabTag";
				conList[prevIndex].className="tabBox-conTag";
				dom.css(tagList[prevIndex],tagStyle);
				// dom.css(tag,tagBoxStyle);
				dom.css(conList[prevIndex],conStyle);
				this.className="tabBox-tabTag active";
				dom.css(this,tagActiveStyle);
				conList[this.myIndex].className="tabBox-conTag select";
				dom.css(conList[this.myIndex],conActiveStyle);
				_this.prevIndex=prevIndex=this.myIndex;
				fun && fun(this,conList[this.myIndex]);
			}
		}
	}

	function clear(){
		var tagList=this.tagList,
			conList=this.conList,
			initIndex=this.initIndex;

		var tagActiveStyle=this.tagActiveStyle,
			conActiveStyle=this.conActiveStyle,
			style=this.style;

		// if(style){
		// 	tagActiveStyle.color=this.colorCss.bgColor;
		// }

		var fun=this.fun;

		for (var i = 0; i < tagList.length; i++) {
			tagList[i].className="tabBox-tabTag";
			conList[i].className="tabBox-conTag";
		}

		tagList[initIndex].className="tabBox-tabTag active";
		conList[initIndex].className="tabBox-conTag select";
		dom.css(tagList[initIndex],tagActiveStyle);
		dom.css(conList[initIndex],conActiveStyle);

		fun && fun(tagList[initIndex],conList[initIndex]);
	}

	
	return SwitchTag;
})();