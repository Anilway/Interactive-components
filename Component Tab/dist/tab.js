var switchTab=(function(){

	// 工具函数
	var dom=(function(){
		function toArray(classArray){
			var ary=[];
			try{
				ary=Array.prototype.slice.call(classArray);
			}catch(e){
				for(var i=0;i<classArray.length;i++){
					ary[i]=ele[i];
				}
			}
			return ary;
		}
		
		function getCss(ele,attr){
			var value;
			if(window.getComputedStyle){
				value=window.getComputedStyle(ele,null)[attr];
			}else{
				// IE6-8下处理透明度
				if(attr==='opacity'){
					value=ele.filter;
					var reg=/^alpha\(opacity=(.+)\)$/;
					value=reg.test(value)?reg.exec(value)[1]/100:1;
				}else{
					value=ele.currentStyle[attr];
				}
			}

			// 去除单位（只去除非复合样式属性数字值的单位）
			reg=/^-?(\d+)(\.\d+)?(px|pt|rem|em)?$/i;
			reg.test(value)?value=parseFloat(value):null;
			return value;
		}

		function setCss(ele,attr,value){
			if(attr==="opacity"){
				ele.style.opacity=value;
				ele.style.filter="alpha(opacity="+(value*100)+")";
				return;
			}
			var reg=/^(animationIterationCount|derImageWidth|fillOpacity|flexGrow|flexShrink|floodOpacity|fontWeight|order|orphans|shapeImageThreshold|stopOpacity|strokeMiterlimit|strokeOpacity|tabSize|webkitAnimationIterationCount|webkitBoxFlex|webkitBoxOrdinalGroup|webkitFlexGrow|webkitFlexShrink|webkitOpacity|webkitOrder|widows|zoom|zIndex)$/i;
			// value是纯数字，而且attr不是以上那些不需要单位的属性，就给value添加单位（这里还需要优化，有些单位是%或s）
			!isNaN(value) && !reg.test(value)?value+="px":null;
			ele.style[attr]=value;
		}

		function setGroupCss(ele,options){
			// 判断option是否为对象
			if(Object.prototype.toString.call(options)!=="[object Object]") return;
			for(var attr in options){
				if(options.hasOwnProperty(attr)){
					setCss(ele,attr,options[attr]);
				}
			}
		}

		function css(){
			var len=arguments.length;
			if(len>=3){
				setCss.apply(this,arguments);
				return;
			}
			if(len===2 && Object.prototype.toString.call(arguments[1])==="[object Object]"){
				setGroupCss.apply(this,arguments);
				return;
			}

			return getCss.apply(this,arguments);
		}

		function getEleByClass(strClass,context){
			context=context || document;
			// 如果非IE6-8，使用原生方法，返回数组格式
			if("getElementsByClassName" in document){
				return toArray(context.getElementsByClassName(strClass));
			}
			// IE6-8使用
			strClass=strClass.replace(/(^\s+)|(\s+$)/g,"").split(/ +/);
			var eleList=context.getElementsByTagName("*"),
				result=[];
			for(var i=0;i<eleList.length;i++){
				var itemClass=eleList[i].className;
				var flag=true;
				for(var j=0;j<strClass.length;j++){
					var reg=new RegExp("(^|\\s+)"+strClass[j]+"(\\s+|&)");
					if(!reg.test(itemClass)){
						flag=false;
						break;
					}
				}
				flag?result.push(eleList[i]):null;
			}
			return result;
		}

		return {
			css:css,
			getEleByClass:getEleByClass,
		}
	})();

	var colorStyle={
		default:{color:"black",bgColor:"#E6E6E6"},
		primary:{color:"white",bgColor:"#007BFF"},
		secondary:{color:"white",bgColor:"#6C757D"},
		success:{color:"white",bgColor:"#28A745"},
		danger:{color:"white",bgColor:"#DC3545"},
		warning:{color:"black",bgColor:"#FFC107"},
		info:{color:"white",bgColor:"#17A2B8"},
		light:{color:"black",bgColor:"#F2F2F2"},
		dark:{color:"white",bgColor:"#343A40"}
	};
	function SwitchTag(tabBox,options){
		this.tabBox=tabBox;
		_default={
			// 样式设置
			height:100,
			isJustify:false,
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

		this.eventType=_default.eventType;
		this.initIndex=_default.initIndex;
		this.fun=_default.fun;
		this.isJustify=_default.isJustify;
		
		this.style=_default.style;
		
		this.width=_default.width;
		this.height=_default.height;
		this.tabBoxStyle=_default.tabBoxStyle;
		this.tagBoxStyle=_default.tagBoxStyle;
		this.conBoxStyle=_default.conBoxStyle;
		this.tagStyle=_default.tagStyle;
		this.tagActiveStyle=_default.tagActiveStyle;
		this.conStyle=_default.conStyle;
		this.tags=_default.tags;

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
		if(style){
			var colorCss=colorStyle[style];
			this.colorCss=colorCss;	
			!tabBoxStyle.borderColor?tabBoxStyle.borderColor=colorCss.bgColor:null;
			!tagBoxStyle.backgroundColor?tagBoxStyle.backgroundColor=colorCss.bgColor:null;
			!tagStyle.color?tagStyle.color=colorCss.color:null;
		}

		

		// 自定义样式初始化渲染
		dom.css(tabBox,{height:height,width:width});
		dom.css(tabBox,tabBoxStyle);
		if(this.isJustify){ // 选项卡标签宽度平均分布
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
				dom.css(tag,tagBoxStyle);
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

		if(style){
			var colorCss=this.colorCss;
			colorCss.bgColor==="#F2F2F2"?colorCss.bgColor="black":null;
			!tagActiveStyle.color?tagActiveStyle.color=colorCss.bgColor:null;
		}

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

	// 暴露选项卡类
	return SwitchTag;
})();