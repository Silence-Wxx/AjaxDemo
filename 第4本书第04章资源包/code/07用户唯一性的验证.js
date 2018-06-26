




















































































//进行用户名验证
app.post('/checkReg',function(req, res){
	//模拟数据库已经存在的数据
	var users = [
		{username:'xdlxdh',password:'123123'},
		{username:'xdhxdl',password:'123123'},
		{username:'xdl123',password:'123123'},
		{username:'xdh123',password:'123123'},
	];
	var flag = 0;								//用于判断的标志
	//判断用户提交的用户名，是否已经存在
	for(var i = 0; i < users.length; i++){
		if(req.body.username == users[i].username){ //已存在
			flag = 1;								//存在把标志改为1
		}
	}
	//返回到客户端
	if(flag == 0){
		res.json({flag:0,message:'用户名不存在，可以注册'});
	}else{
		res.json({flag:1,message:'用户存在，请换一个试试'});
	}
});







































