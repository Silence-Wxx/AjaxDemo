//recvType 有三个值HTML、XML和JSON , 默认为HTML,传值时不区分大小写
//bool 是一个boolean类型的值，true表示异步传输方式，false表示同步传输方式，默认为true
function Ajax(recvType, bool) {
	var aj = new Object(); //定义一个空对象
	aj.targetUrl = '';    //请求的地址 可以是PHP也可以XML文件
	aj.sendString = '';   //请求服务器传递的字符串  ？ & 格式 url 

	if(typeof(bool)=="undefined")  //如果不写这个参数，默认给它为true
		aj.async=true;
	else
		aj.async=bool;    //有这个参数，就用它的值

	aj.recvType=recvType ? recvType.toUpperCase() : 'HTML';//HTML XML JSON  返回的数据类型，默认HTML，并且通过函数忽略大小写
	aj.resultHandle = null;  //服务器返回的数据 
	aj.ff;   //
	
	//创建XML对象的函数
	aj.createXMLHttpRequest = function() { 
		var request = false;  //空xml对象
		if(window.XMLHttpRequest) {   //主流浏览器创建xml对象
			aj.ff=true;
			request = new XMLHttpRequest();
			// 保证浏览器发送的串行化数据长度正确，针对某些特定版本的mozillar浏览器的BUG进行修正 
			// 如果来自服务器的响应没有 XML mime-type 头部，则一些版本的 Mozilla 浏览器不能正常运行。
			// 对于这种情况，httpRequest.overrideMimeType('text/xml'); 语句将覆盖发送给服务器的头部，强制text/xml 作为 mime-type响应头
			if(request.overrideMimeType) {   
				request.overrideMimeType('text/xml');
			}
		} else if(window.ActiveXObject) {   //IE5，IE6创建xml对象
			aj.ff=false;
			//IE5，IE6  各个版本XML数组
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
			//循环数组试着创建xml对象，一旦创建成功，直接返回xml对象
			for(var i=0; i<versions.length; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if(request) {
						return request;
					}
				} catch(e) {
					request=false;   //如果都创建不成功，返回false
				}
			}
		}
		return request;   //返回XMLHttpRequest对象
	}

	//调用函数，把创建好的xml对象给aj的XMLHttpRequest属性
	aj.XMLHttpRequest = aj.createXMLHttpRequest();
	//定一个onreadystatechange函数给aj的processHandle属性
	aj.processHandle = function() {
		if(aj.XMLHttpRequest.readyState == 4) {   //状态为4全部接收完成
			aj.ff=false; //如果是IE7以上则不再执行一次调用
			if(aj.XMLHttpRequest.status == 200) {  //状态为200服务器正常响应
				//根据设置的返回数据类型，保存不同类型的数据
				if(aj.recvType == 'HTML') {
					aj.resultHandle(aj.XMLHttpRequest.responseText);
				}else if(aj.recvType == 'JSON'){ 
					//aj.resultHandle(eval('('+aj.XMLHttpRequest.responseText+')'));
					aj.resultHandle(JSON.parse(aj.XMLHttpRequest.responseText));
				}else if(aj.recvType == 'XML') {
					aj.resultHandle(aj.XMLHttpRequest.responseXML);
				}
			}
		}
	}

	//get请求方式
	//参数1 请求的URL
	//参数2 回调函数，接收一个参数data
	aj.get = function(targetUrl, resultHandle) {
		aj.targetUrl = targetUrl;  //把URL给aj的一个属性
		if(resultHandle!=null){
			aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
			aj.resultHandle = resultHandle;  //把传过来的函数给这个属性
		}
		if(window.XMLHttpRequest) {  //IE7以上
			aj.XMLHttpRequest.open('GET', aj.targetUrl, aj.async);
			aj.XMLHttpRequest.send(null);
			
		} else {
	        	aj.XMLHttpRequest.open("GET", targetUrl, aj.async);
	        	aj.XMLHttpRequest.send();
		}
		if(!aj.async && aj.ff)  //如果是同步，并且aj.ff为true，也就是IE7以下，也就是IE7一下的同步请求这样调用函数
			aj.processHandle();
	}

	//POST请求参数
	//第二个参数为要发送的字段信息JSON 或者 'name=aa&age=33'
	aj.post = function(targetUrl, sendString, resultHandle) {
		aj.targetUrl = targetUrl;

		if(typeof(sendString)=="object"){
			var str="";
			for(var pro in sendString){
				str+=pro+"="+sendString[pro]+"&";  //如果是JSON对象，转换成name=tom&age=15的形式
			}
			
			aj.sendString=str.substr(0, str.length-1);
		}else{
			aj.sendString = sendString;  //字符串的话直接赋值
		}

	
		
		if(resultHandle!=null){
			aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
			aj.resultHandle = resultHandle;
		}
		aj.XMLHttpRequest.open('POST', targetUrl, aj.async);
		aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		aj.XMLHttpRequest.send(aj.sendString); 
		if(!aj.async && aj.ff)
			aj.processHandle();
	}
	return aj;
}



