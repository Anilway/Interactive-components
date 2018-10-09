var switchTab=(function(){

	var color={
		default:"#F2F2F2",
		primary:"",
		danger:"",
		dark:""
	};

	function SwitchTag(tabBox,options){
		this.tabBox=tabBox;
		_default={
			// 样式设置
			width:100,
			height:100,
			tagBg:color.default,
			tabBoxStyle:{},
			tagBoxStyle:{},
			
			// 选项卡操作设置
			eventType:'click',
			initIndex:0,
			tags:['选项卡1','选项卡2','选项卡3']
		};
		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}

		this.height=_default.height;
		this.width=_default.width;
		this.tagBg=_default.tagBg;
		this.eventType=_default.eventType;
		this.initIndex=_default.initIndex;
		this.tags=_default.tags;

		this.init();
	}

	SwitchTag.prototype={
		constructor:SwitchTag,
		init:init,
		tabStyle:tabStyle,
		tagSwitch:tagSwitch,
		clear:clear
	};

	function init(){
		var tabBox=this.tabBox,
			tag=dom.getEleByClass('tabBox-tab',tabBox)[0],
			tagList=dom.getEleByClass('tabBox-tabTag',tag),
			con=dom.getEleByClass('tabBox-con',tabBox)[0],
			conList=dom.getEleByClass('tabBox-conTag',con),
			prevIndex=0;

		this.tag=tag;
		this.tagList=tagList;
		this.con=con;
		this.conList=conList;
		this.prevIndex=0;

		this.tabStyle();
		this.clear();
		this.tagSwitch();
	}	

	function tabStyle(){
		var tabBox=this.tabBox,
			tag=this.tag,
			tagList=this.tagList,
			con=this.con,
			conList=this.conList,
			height=this.height,
			width=this.width;
			tagBg=this.tagBg;

		// 尝试在JS中设置选项卡样式
		// var tabBox_default_style={
		// 	minWidth:'400px',
		// 	height:'100px',
		// 	margin:'10px',
		// 	border:'1px #E6E6E6 solid',
		// 	borderRadius:'5px',
		// 	boxShadow:'1px 1px 5px #aaa',
		// 	backgroundColor:'#FFFFFF',
		// 	overflow:'hidden'
		// };

		// var tabBox_tab_default_style={
		// 	margin:'-1px',
		// 	backgroundColor:'#F2F2F2',
		// 	height:'40px'
		// };

		// var tabBox_tabTag_default_style={
		// 	width:'100px',
		// 	height:'38px',
		// 	border:'1px solid #F2F2F2',
		// 	float:'left',
		// 	textAlign:'center',
		// 	lineHeight:'40px',
		// 	cursor:'pointer'
		// };

		// var tabBox_con_default_style={

		// };

		// var tabBox_conTag_default_style={

		// };



		// dom.css(tabBox,tabBox_default_style);
		// dom.css(tag,tabBox_tab_default_style);
		// dom.css(tagList,tabBox_tabTag_default_style);
		// dom.css(con,tabBox_con_default_style);
		// dom.css(conList,tabBox_conTag_default_style);



		dom.css(tabBox,{height:height});
		dom.css(tag,"backgroundColor",tagBg);

	}

	function tagSwitch(){
		var tagList=this.tagList,
			conList=this.conList,
			prevIndex=this.prevIndex;

		var _this=this;

		for (var i = 0; i < tagList.length; i++) {
			tagList[i].myIndex=i;
			tagList[i]["on"+this.eventType]=function(){
				tagList[prevIndex].className="tabBox-tabTag";
				conList[prevIndex].className="tabBox-conTag";
				this.className="tabBox-tabTag active";
				conList[this.myIndex].className="tabBox-conTag select";
				_this.prevIndex=prevIndex=this.myIndex;
			}
		}
	}

	function clear(){
		var tagList=this.tagList,
			conList=this.conList,
			initIndex=this.initIndex;

		for (var i = 0; i < tagList.length; i++) {
			tagList[i].className="tabBox-tabTag";
			conList[i].className="tabBox-conTag";
		}

		tagList[initIndex].className="tabBox-tabTag active";
		conList[initIndex].className="tabBox-conTag select";
	}

	
	return SwitchTag;
})();