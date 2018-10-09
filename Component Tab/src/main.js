var tabBoxList=dom.getEleByClass('tabBox');

new switchTab(tabBoxList[0],{
	width:500,
	height:150,
	tabBoxStyle:{
		overflow:"visible",
		margin:20
	},
	tagBoxStyle:{
		backgroundColor:"#6DDEEE"
	},
	tagStyle:{
		color:"white",
		backgroundColor:"#6DDEEE",
		height:38,
		top:0
	},
	conBoxStyle:{
		backgroundColor:"#555F61",
		color:"white"
	},
	tagActiveStyle:{
		backgroundColor:"#555F61",
		color:"#6DDEEE",
		height:48,
		position:"relative",
		top:-10
	}
});
new switchTab(tabBoxList[1],{
	eventType:"mouseover",
	width:500,
	height:200,
	initIndex:2,
	tagBoxStyle:{
		backgroundColor:"deepskyblue"
	},
	tagStyle:{color:"white"},
	tagActiveStyle:{
		color:"deepskyblue"
	},
	tabBoxStyle:{
		borderColor:"deepskyblue"
	},
	fun:function(tagItem,conItem){
		conItem.innerHTML="\n我选择了："+tagItem.innerHTML;
		// tagItem.style.color="deepskyblue";
	},
	isJustify:true
});
new switchTab(tabBoxList[2],{
	initIndex:3,
	eventType:"mouseover",
	width:400,
	isJustify:true,
	tagBoxStyle:{backgroundColor:"#343A40"},
	tagStyle:{color:"white"},
	tagActiveStyle:{color:"#343A40"}
});
new switchTab(tabBoxList[3],{
	style:"warning",
	eventType:"mouseover"
});

var container=document.getElementsByClassName("container")[0],
	tabBoxs=dom.getEleByClass("tabBox",container);

for (var i = 0; i < tabBoxs.length; i++) {
	new switchTab(tabBoxs[i],{
		eventType:"mouseover",
		isJustify:true,
		tabBoxStyle:{
			width:100,
			float:"left",
			borderColor:"#DC3545"
		},
		tagBoxStyle:{
			backgroundColor:"#DC3545"
		},
		tagStyle:{color:"white"},
		tagActiveStyle:{color:"#DC3545"}
	});
}