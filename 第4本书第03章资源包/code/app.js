var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var debug = require('debug')('myStudy:server');


var routes = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');                   //注释掉这一行
app.engine('.html', require('ejs').__express);     //新增这一行
app.set('view engine', 'html'); 				   //新增这一行

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-----------------------------------------------------------------------------------------//
app.use('/', routes);
app.use('/users', users);
app.use('/goods', goods);

//3-1-1打开页面
app.get('/3-1-1-first', function(req, res){
    res.render('3-1-1-first'); //返回页面
});
//3-1-1返回数据
app.get('/3-1-1-first-data', function(req, res){
    res.send('让学习称为一种习惯！'); //返回页面
});


//3-2-3-async渲染页面的路由，打开异步请求页面
app.get('/3-2-3-async', function(req, res){
    res.render('3-2-3-async'); //返回页面
});
//3-2-3-sync渲染页面的路由，打开异步请求页面
app.get('/3-2-3-sync', function(req, res){
    res.render('3-2-3-sync'); //返回页面
});
//3-2-3AJAX请求数据的路由
app.get('/3-2-3-data', function(req, res){
    setTimeout(function(){   //定时器模拟延迟响应
        res.send('晓镜但愁云鬓改，夜吟应觉月光寒。'); //响应数据
    },2000);
});

//3-2-1响应ajax请求数据
app.get('/3-3-1-get-data',function(){
    res.send('响应ajax的get请求');
});
//3-2-1响应ajax请求数据
app.get('/3-3-1-post-data',function(){
    res.send('响应ajax的postt请求');
});

//3-3-2加载页面
app.get('/3-3-2-readyState', function(req, res){
    res.render('3-3-2-readyState');
});
//3-3-2返回数据
app.get('/3-3-2-readyState-data', function(req, res){
    res.send('让学习成为一种习惯！');
});

//3-4-1加载页面
app.get('/3-4-1-post', function (req, res) {
    res.render('3-4-1-post');
});
//3-4-1检查答案的路由
app.post('/3-4-1-checkAnswer', function (req, res) {
    if (req.body.answer1 != '人生自古谁无死' && req.body.answer2 != '留取丹心照汗青') {
        res.send('错误！');
    } else {
        res.send('正确！');
    }
});
//3-4-2加载页面
app.get('/3-4-2-get', function (req, res) {
    res.render('3-4-2-get');
});
//3-4-2查看答案的路由
app.get('/3-4-2-getAnswer', function (req, res) {
    res.json({answer1: '人生自古谁无死', answer2: '留取丹心照汗青'});
});

//3-5-2-get加载页面
app.get('/3-5-2-get', function(req, res){
    res.render('3-5-2-get');
});
//3-5-2响应ajax请求的数据
app.get('/3-5-2-get-data', function(req, res){
    res.send('自封装的AJAX，使用GET请求成功！');
});

//3-5-2-post加载页面
app.get('/3-5-2-post', function(req, res){
    res.render('3-5-2-post');
});
//3-5-2-post响应ajax请求的数据
app.post('/3-5-2-post-data', function(req, res){
    var getName = req.body.name;  			//客户端提交的名字
    var getCity = req.body.city; 			//客户端提交的城市
    res.json({name: getName, city: getCity});  //返回给客户端信息
});

//3-6-2-json-3返回天气数据
app.get('/3-6-2-json-3-data', function (req, res) {
    var city = req.query.city;  //获取请求参数的查询城市
    var date = req.query.date;  //获取请求参数的查询日期
    //返回指定城市，指定日期的天气信息
    //jsonp函数已经帮我们做好了处理，会自动获取参数中callback的值作为函数名
    res.jsonp({city: city, date: date, weater: '小雨转中雨'});
});

//3-6-2-json-4返回天气数据
app.get('/3-6-2-json-4-data', function (req, res) {
    var city = req.query.city;  //获取请求参数的查询城市
    var date = req.query.date;  //获取请求参数的查询日期
    //返回指定城市，指定日期的天气信息
    //jsonp函数已经帮我们做好了处理，会自动获取参数中callback的值作为函数名
    res.jsonp({city: city, date: date, weater: '小雨转中雨'});
});



//加载模板页面路由
app.get('/myPage', function (req, res) {  //设置路由名称
    res.render('myPage');              //加载模板页面
});
app.get('/myHtml', function (req, res) {  //设置路由名称
    res.render('myHtml');              //加载模板页面
});

//模板数据渲染的路由
app.get('/myData', function(req, res){
	var person = {name:'兄弟连IT教育', age:10};//模拟数据
	res.render('myData', person);              //返回模板并且绑定数据
});

//返回信息路由，获取GET请求参数
//app.get('/myTest', function (req, res) {  // req用户请求信息，res服务器响应信息
//    // var getParam = req.query;          //得到的是一个JSON对象
//    // console.log(getParam);             //打印req.query的值
//    // var name = getParam.name;          //取出GET请求URL中name参数的值
//    // var age = getParam.age;            //取出age参数的值
//    // console.log('name的值是：' + name + ' age的值是：' + age); //输出参数的值
//    res.send('让学习称为一种习惯！');
//});

//加载nodegrass模块
var nodegrass = require('nodegrass');
//3-6-2-proxy加载代理服务器页面模板
app.get('/3-6-2-proxy', function (req, res) {
    res.render('3-6-2-proxy');
});
//3-6-2-proxy测试代理服务器
app.get('/3-6-2-proxy-data', function (req, res) {
    //使用http模块请求要访问的地址
    nodegrass.get('http://www.baidu.com', function (data) {
        res.send(data);  //返回结果给Ajax请求
    });
});

//3-6-2-iframe-data返回iframe标签需要的数据
app.get('/3-6-2-iframe-data', function (req, res) {
    var param = req.query.name;                     //接收请求的参数
    var data = {name: param, info: '无兄弟不编程！'}; //返回json格式数据
    var data = JSON.stringify(data);                //将JSON数据转换为JSON字符串
    res.send("<script>window.name ='" + data + "';</script>"); //返回可执行JS代码
});

//3-6-2-cors-1返回数据
app.get('/3-6-2-cors-1-data',function(req, res){
   res.send('这里是来自nodejs的数据！');
});
//3-6-2-cors-2返回数据
app.get('/3-6-2-cors-2-data',function(req, res){
    res.set({
        'Access-Control-Allow-Origin': 'http://127.0.0.1' //允许http://127.0.0.1
    });
    res.send('这里是来自nodejs的数据！');
});
//3-6-2-cors-3返回数据
app.use('/3-6-2-cors-3-data',function(req, res){
    res.set({
        'Access-Control-Allow-Origin': 'http://127.0.0.1', //允许http://127.0.0.1
        'Access-Control-Allow-Methods':'GET,PUT,POST',     //允许PUT方式
        'Access-Control-Allow-Headers':'X-Our-Header'      //允许X-Our-Header头
    });
    res.send('这里是来自nodejs的数据！');
});
//3-6-2-cors-4返回数据
app.get('/3-6-2-cors-4-data',function(req, res){
    console.log(req.cookies);      //打印cookie信息
    res.set({
        'Access-Control-Allow-Origin': 'http://127.0.0.1', //允许http://127.0.0.1
        'Access-Control-Allow-Credentials': true
    });
    res.send('这里是来自nodejs的数据！');
});

//第4章路由
//瀑布流相关路由,打开瀑布流页面
app.get('/pubuliu', function (req, res) {
    res.render('pubuliu');
});
//给瀑布流提供数据
app.get('/getData', function (req, res) {
    //模拟从数据库取得的数据
    var data = [
        {url: 'http://127.0.0.1:3000/images/1.jpg'},
        {url: 'http://127.0.0.1:3000/images/2.jpg'},
        {url: 'http://127.0.0.1:3000/images/3.jpg'},
        {url: 'http://127.0.0.1:3000/images/4.jpg'},
        {url: 'http://127.0.0.1:3000/images/5.jpg'},
    ];
    res.json(data);
});

//表单验证的路由
//加载页面
app.get('/reg', function (req, res) {
    res.render("reg");
});
//进行用户名验证
app.post('/checkReg', function (req, res) {
    //模拟数据库已经存在的数据
    var users = [
        {username: 'xdlxdh', password: '123123'},
        {username: 'xdl123', password: '123123'},
        {username: 'xdh123', password: '123123'},
        {username: 'xdhxdl', password: '123123'},
    ];
    //判断用户提交的用户名是否已经存在
    for (var i = 0; i < users.length; i++) {
        if (req.body.username == users[i].username) {   //已存在，直接返回响应
            res.json({flag: 1, message: '用户名存在，请换一个试试'});
        }
    }
    res.json({flag: 0, message: '用户名不存在，可以注册'}); //用户不存在，可以注册
});

//-----------------------------------------------------------------------------------------//
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;


/**
 * Module dependencies.
 */

//--------------------------------------------------------------------------------
//var app = require('../app');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
