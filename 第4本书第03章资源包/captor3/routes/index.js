var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get1',function(req,res) {

  var username = req.query.username;

  res.end('username的值是：' + username);
})

router.post('/post',function(req,res) {
    var username=req.body.username;
       res.end('username的值是：'+ username);
})

router.get('/data',function(req,res) {
       res.render('data');
})

router.get('/getdata',function(req,res) {
  res.end('hello world');
})

router.get('/getJson',function(req,res) {
       var data={"username":"王小米",age:23,sex:"男"};

       res.json(data);
})
router.get('/ajax',function(req,res) {
  res.render('ajax');
})

router.get('/ajax-get',function(req,res) {
  res.end('学习Ajax的封装，测试get请求');
})

router.post('/ajax-post',function(req,res) {
  res.end('学习Ajax的封装，测试post请求');
})

  //测试同步与异步

router.get('/async',function(req,res) {
      res.render('async')
})

router.get('/sync',function(req,res) {
      res.end('study')
})

//引入ajax代码

router.get('/ajax2',function(req,res) {

       res.render('ajax2')
})

//JSONP的跨域处理方法-实现原理
router.get('/jsonp',function(req,res) {
     
      res.render('jsonp')
})

//JSONP的跨域-百度
router.get('/jsonp-baidu',function(req,res) {
      res.render('jsonp-baidu')
})

//JSONP的跨域-百度实战
router.get('/jsonp-baidu-1',function(req,res) {
  res.render('jsonp-baidu-1')
})
module.exports = router;
