var utils=(function(){
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
	
	function each(_default,options){
		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}
		return _default;
	}

	function ajax(options){
		// 数据初始化
		var _default={
			url:null,
			type:'get',
			sync:true,
			succ:null,
			err:null
		};
		each(_default,options);
		var xhr=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
		xhr.open(_default.type,_default.url,_default.sync);
		xhr.onreadystatechange=function(){
			if(xhr.readyState===4 && xhr.status===200){
				_default.succ(xhr.responseText);
			}else{
                _default.err && _default.err(xhr.status);
			}
		};
		xhr.send();
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

    function getChilds(ele,tagname){
        var childs=ele.children,
            result=[];
        if(childs.length===0) return;
        for(var i=0;i<childs.length;i++){
            if(childs[i].nodeType===1){
                if(tagname){
                    if(childs[i].tagName.toLowerCase()===tagname.toLowerCase()){
                        result.push(childs[i]);
                    }
                    continue;
                }
                result.push(childs[i]);
            }
        }
        return result;
    }

	var animate=(function(){
		// 这里的运动轨迹只提供了一种，可以扩展多种运动轨迹
		/*
			t：使用的时间time
			b：起始位置begin
			c：总长度change=目标位置-起始位置
			d：总时间duration
		*/
		function linear(t,b,c,d){
			return t/d*c+b;
		}

		function animate(options){
			// 初始化参数(在ES6中可以使用解构赋值，考虑到兼容性，这里不使用解构赋值)
			var _default={
				ele:null,
				target:{},
				duration:1000,
				callBack:null,
				effect:linear
			}

			for(var key in options){
				if(options.hasOwnProperty(key)){
					_default[key]=options[key];
				}
			}

			var ele=_default.ele,
				target=_default.target,
				duration=_default.duration,
				callBack=_default.callBack,
				effect=_default.effect;


			var t=0,
				d=duration||1000,
				b={},
				c={};

			for(var key in target){
				if(target.hasOwnProperty(key)){
					b[key]=css(ele,key);
					c[key]=target[key]-b[key];
				}
			}
			//在设置新动画之前，先把之前正在运行的动画清除掉，防止当前元素相同的动画共存
			clearInterval(ele.animateTimer);
			ele.animateTimer=setInterval(function(){
				var cur={};
				t+=17;
				if(t>=d){
					css(ele,target);
					clearInterval(ele.animateTimer);
					callBack && callBack();
					return;
				}

				for(var key in target){
					if(target.hasOwnProperty(key)){
						cur[key]=effect(t,b[key],c[key],d);
					}
				}
				css(ele,cur);
			},17);
		}

		return animate;
	})();

    var $event=(function(){
        /*
            on:基于DOM2实现事件绑定（兼容所有浏览器）
            @parameter
                ele:当前要操作的元素
                type：要绑定的事件类型
                fn：需要绑定的事件方法
            @return
                不需要返回值

            解决IE6-8下DOM2级事件绑定的重复问题、执行顺序问题、this指向问题
        */
        function on(ele,type,fn){
            if(document.addEventListener){
                ele.addEventListener(type,fn,false);
                return;
            }
            // console.log('IE开始执行');
            // IE6-8下自定义事件池
            if(typeof ele[type+"Pond"]==="undefined"){
                ele[type+"Pond"]=[];
                ele.attachEvent("on"+type,function(e){
                    run.call(ele,e);
                });
            }

            // 忽略重复事件方法
            var ary=ele[type+"Pond"];
            for(var i=0;i<ary.length;i++){
                if(ary[i]===fn){
                    return;
                }
            }
            ary.push(fn);
        }

        /*
            off:移除事件绑定
            @parameter
                ele:当前要操作的元素
                type：要移除的事件类型
                fn：需要移除的事件方法
            @return
                不需要返回值
        */
        function off(ele,type,fn){
            if(document.addEventListener){
                ele.removeEventListener(type,fn,false);
                return;
            }

            var ary=ele[type+"Pond"];
            if(!ary) return;// 未绑定事件时，直接使用off方法，没有事件池，此时ary为undefined，此时return出去，避免后面使用undefined.length报错
            for(var i=0;i<ary.length;i++){
                if(ary[i]===fn){
                    ary[i]=null;
                    break;
                }
            }
        }

        /*
            run：桥接方法，按顺序执行自定义事件池中的事件
                @parameter
                    e:事件对象
                @return
                    无返回值
        */
        function run(e){
            ieMouseEvent(e); // 事件对象兼容处理
            var ary=this[e.type+"Pond"];
            if(!ary) return;
            for(var i=0;i<ary.length;i++){
                var item=ary[i];
                // 解决off接触绑定造成的数组塌陷问题
                if(item===null){
                    ary.splice(i,1);
                    i--;
                    continue;
                }
                // this指定为当前ele
                item.call(this,e);
            }
        }

        return {
            on:on,
            off:off
        }
    })();

    function winbox(attr,value){
        if(arguments.length>1){
            document.documentElement[attr]=value;
            document.body[attr]=value;
            return;
        }
        return document.documentElement[attr]||document.body[attr];
    }
	return {
		each:each,
		ajax:ajax,
		getEleByClass:getEleByClass,
		css:css,
        getChilds:getChilds,
		animate:animate,
        on:$event.on,
        off:$event.off,
        winbox:winbox
	}
})();