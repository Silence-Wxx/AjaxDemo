var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//用户注册页面测试
router.get('/reg',function(req,res) {

     res.render('reg')
})

//服务器响应请求
router.post('/doreg',function(req,res) {

  var username=req.body.username;

  var users=['wxx123','wslhkdwxx','wxx2018'];

  if(users.indexOf(username)==-1) {

      res.end('用户名不存在')

  } else {

     res.end('用户名已经存在')
  }
})


router.get('/form',function(req,res) {

     res.render('form')
})
router.get('/form-ajax',function(req,res) {

  res.render('form-ajax')
})


router.post('/checkUsername',function(req,res) {

   var username=req.body.username;

   var users=['zhangsan','lisi','zhaosi'];

   if(users.indexOf(username)==-1){
        res.json({'success':0});
   } else {
         res.json({'success':1});
   }

})

router.get('/pubu',function(req,res) {
  res.render('pubu')
})

router.get('/getData',function(req,res) {
    var data=[{id:1,url:"/images/1.jpg"},
              {id:2,url:"/images/2.jpg"},
              {id:3,url:"/images/3.jpg"},
              {id:4,url:"/images/4.jpg"},
              {id:5,url:"/images/5.jpg"},
              {id:6,url:"/images/6.jpg"},
              {id:7,url:"/images/7.jpg"},
              {id:8,url:"/images/8.jpg"},
              {id:9,url:"/images/9.jpg"},
              {id:10,url:"/images/10.jpg"}];
    res.json(data);

})
module.exports = router;
