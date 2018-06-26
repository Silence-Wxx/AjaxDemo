//封装Ajax对象
function Ajax(dataType, async) {
	var ajax = new Object();  //定义一个新的ajax对象
	
	//处理数据类型,设定数据类型，就用设定的，并转换为大写；没有设定，默认HTML
	ajax.dataType = dataType ? dataType.toUpperCase() : 'HTML';
	
	//处理同步异步
	if (typeof(bool)=="undefined") {  //如果没有设定同步异步的参数，默认异步
		ajax.async = true;
	} else {                          //如果设定了同步异步，就用你设定的
		ajax.async = async;
	}
	
	//创建XMLHttpRequest对象
	ajax.createXMLHttpRequest = function() {
		var xmlRequset = false;     //定义空的xmlRequset对象
		if (window.XMLHttpRequest) {//主流浏览器创建XMLHttpRequest对象
			xmlRequset = new XMLHttpRequest();
		} else if (window.ActiveXObject) {//IE5，IE6创建XMLHttpRequest对象
			xmlRequset = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlRequset;
	}
	
	//调用函数创建XMLHttpRequest,把创建好的XMLHttpRequest对象给ajax的一个属性
	ajax.xmlRequset = ajax.createXMLHttpRequest();
	
	//onreadystatechange事件调用的函数
	ajax.changeFuncition = function() {
		//alert(ajax.xmlRequset.readyState);
		//判断服务器响应状态，只有状态200并且readyState=4的时候，才是响应成功
		if (ajax.xmlRequset.readyState == 4 && ajax.xmlRequset.status == 200) {
			//根据用户设定的数据类型返回响应的格式的数据
			if (ajax.dataType == 'HTML') {   			//HTML数据格式
				ajax.callback(ajax.xmlRequset.responseText);
			} else if (ajax.dataType == 'JSON') {       //JSON数据格式
				//通过全局函数JSON.parse把返回的JSON字符串转化为JSON对象
				ajax.callback(JSON.parse(ajax.xmlRequset.responseText));
			} else if (ajax.dataType == 'XML') {       	//XML数据格式
				ajax.callback(ajax.xmlRequset.responseXML);
			}
		}
	}
	
	/** Ajax中get请求方法
	 * @param string url 请求的url
	 * @param function callback 用来接收服务器返回数据的回调函数
	 */
	ajax.get = function(url, callback) {
		//判断是否有回调函数，有回调函数的话要调用onreadystatechange事件函数
		if (callback != null) {
			//把传递过来的回调函数给ajax的一个属性
			ajax.callback = callback;   //便于onreadystatechange事件函数使用
			//调用onreadystatechange事件函数，把服务器返回的数据给回调函数
			ajax.xmlRequset.onreadystatechange = ajax.changeFuncition;
		}
		ajax.xmlRequset.open('GET', url, ajax.async);  		//然后初始化GET请求
		ajax.xmlRequset.send();								//发送请求
	}
	
	/** Ajax中post请求方法
	 * @param string url 请求的url
	 * @param string/object sendString post请求携带的参数 字符串或者JSON对象
	 * @param function callback 用来接收服务器返回数据的回调函数
	 */
	ajax.post = function(url, sendString, callback) {
		//处理要向服务器提交的参数的为XML支持的格式
		if (typeof(sendString == 'object')) {  //如果是JSON对象,转化成字符串
			var str = '';
			for (var key in sendString) {  	   //循环遍历这个JSON对象
				//把JSON对象转换成name=Tom&age=19的形式
				str += key + '=' + sendString[key] + '&';
			}
			//删除字符串最后一个字符'&'
			sendString = str.substr(0, str.length-1);
		}
		//判断是否有回调函数，有回调函数的话要调用onreadystatechange事件函数
		if (callback != null) {
			//把传递过来的回调函数给ajax的一个属性
			ajax.callback = callback;   //便于onreadystatechange事件函数使用
			//调用onreadystatechange事件函数，把服务器返回的数据给回调函数
			ajax.xmlRequset.onreadystatechange = ajax.changeFuncition;
		}
		ajax.xmlRequset.open('POST', url, ajax.async);  	//然后初始化POST请求
		//设置POST请求头信息
		ajax.xmlRequset.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		ajax.xmlRequset.send(sendString);	                //发送请求
	}
	
	/** JSONP跨域请求
	 * @param string url 请求的url
	 * @param function callback 用来接收服务器返回数据的回调函数
	 */
	ajax.jsonp = function(url, callback) {
		//动态创建script标签，为了使用它的src属性去请求服务器
		var script = document.createElement('script');
		//随机生成函数名，不然会读取本地缓存的js文件
		var time = new Date();
		var funcName = 'jsonp' + time.getTime();
				
		//拼接URL,判断url中是否穿有参数
		if (url.indexOf('?') > 0) {  //如果url中有传递参数，这样拼接URL
			url = url + '&callback=' + funcName;
		} else { //如果url没中有传递参数，这样拼接URL
			url = url + '?callback=' + funcName;
		}
		
		//注册回调函数到全局
		window[funcName] = function(data) {
			callback(data);
			//把数据给回调函数之后销毁我们注册的函数和创建的script标签
			delete window[funcName];               //删除函数
			script.parentNode.removeChild(script); //删除script标签
		}

		//设置script标签的src属性
		script.setAttribute('src', url);
		//把script标签加入head，请求服务器得到数据
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	
	/** window.name跨域请求
	 * @param string url 请求的url
	 * @param function callback 用来接收服务器返回数据的回调函数
	 */
	ajax.iframe = function(url, callback){
		var iframe = document.createElement('iframe'); //创建iframe标签
		iframe.style.display = 'none';                 //设置属性为隐藏
		iframe.src = url; 							   //指定iframe的src
		//把iframe节点写入到body中
		document.getElementsByTagName('body')[0].appendChild(iframe);	   
		var flag = true;        //设置标志，用于判断，保证src只设定一次
		ajax.onload = function(){ //src改变一次，iframe重新加载一次
			if(flag){           //判断标志状态，防止重复设置src
				iframe.src = 'about:blank';           //将域设置成同域
				flag = false;   //一旦设置src好之后,立刻改变标志状态
			} else {    //同域的src加载好之后，就可以获取window.name的值了
				var data = iframe.contentWindow.name; //获取服务设定name值
				//判断用户想要接收的数据类型
				if (ajax.dataType == 'JSON') {
					data = JSON.parse(data);//将JSON格式字符串转换为JSON对象
				}
				callback(data);                       //将数据给回调函数  
				document.body.removeChild(iframe);    //销毁节点
			}			
		};
		//考虑到浏览器兼容问题，这样绑定事件
		if(iframe.attachEvent){
            iframe.attachEvent('onload', ajax.onload);
        } else {
            iframe.onload = ajax.onload;
        }
	}
	
	
	return ajax;              //返回ajax对象
}


/*
//我们在HTML页面一般这样使用我们封装的Ajax：
<script src="./myAjax.js"></script>  //导入我们封装的Ajax
<script>
	//这里使用Ajax的get方式异步请求兄弟连官网
	Ajax('HTML', true).get('http://www.lampbrother.net/', function(data){
		alert(data);  //这个data就是服务器返回来的数据
	});
</script>

//来看看我们封装的get方法:
ajax.get(url, callback);
//第一个参数url没什么问题，我们把使用这个函数的时候传递过来的第二个参数代入进来看看：
//也就是 
callback = function(data){}; 
//那么就可以写成这样的了：
ajax.get(url, function(data){});
//接下我们的封装又做了什么？是的，把这个回调函数给了ajax对象的一个属性：
ajax.callback = callback;
//也就是：
ajax.callback = function(data){}
//这样一来，我们在Ajax()函数内的任何地方都可以使用ajax.callback这个属性了
//当然在onreadystatechange事件函数里面也可以用啦：
ajax.callback(ajax.xmlRequset.responseText);
//可以看到我们把服务器的返回值ajax.xmlRequset.responseText传递给了这个callback
//是不是可以写成这样：
ajax.callback = function(ajax.xmlRequset.responseText){
	//这里处理服务器返回的数据
}
//万物皆有本源，ajax.callbackd的本源在哪？是的就是我们前面使用get()方法的时候
//传递的第二个参数，回调函数，于是一切就很清晰了，是不是可以理解成这样：
//在onreadystatechange事件函数我们调用这个函数，并把服务器的参数传值到这个函数中
//那么我们在前面的使用get()方法的时候，data参数不就等于服务器返回的值了吗！
Ajax().get(url, function(data){
	data = ajax.xmlRequset.responseText;  //这就是回调函数的本质
});

//总结一下：
1. 我们在使用Ajax的时候，get()方法第二个参数是一个回调函数
2. 这个函数在onreadystatechange事件函数中被调用，并把服务器返回的数据传给了这个回调函数
3. 我们就可以在使用get()方法的时候，第二个参数中的回调函数里获得服务器返回的数据
4. 为什么在封装Ajax的时候，不把callback回调函数直接传参给onreadystatechange事件函数,而是
   作为ajax对象的一个属性间接调用？
   这是因为onreadystatechange事件函数不能有参数，我们只好曲线救国了

*/





