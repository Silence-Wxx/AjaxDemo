




















































































//�����û�����֤
app.post('/checkReg',function(req, res){
	//ģ�����ݿ��Ѿ����ڵ�����
	var users = [
		{username:'xdlxdh',password:'123123'},
		{username:'xdhxdl',password:'123123'},
		{username:'xdl123',password:'123123'},
		{username:'xdh123',password:'123123'},
	];
	var flag = 0;								//�����жϵı�־
	//�ж��û��ύ���û������Ƿ��Ѿ�����
	for(var i = 0; i < users.length; i++){
		if(req.body.username == users[i].username){ //�Ѵ���
			flag = 1;								//���ڰѱ�־��Ϊ1
		}
	}
	//���ص��ͻ���
	if(flag == 0){
		res.json({flag:0,message:'�û��������ڣ�����ע��'});
	}else{
		res.json({flag:1,message:'�û����ڣ��뻻һ������'});
	}
});







































