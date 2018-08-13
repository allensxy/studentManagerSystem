// 导包
const express = require('express');
// 导入body-parser 中间件(包)
const bodyParser = require('body-parser');
// 导入body-parser 中间件(包)
const session = require('express-session');

// 引入自己的路由
const managerRoute = require('./router/managerRoute');
// 实例化app
let app = express();

// 引入 .session 中间件
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true }
}));

// 使用 bodyParse中间件 格式化 表单数据
// 自动格式化数据 在 req这个对象上 增加 .body 属性 把数据保存进去
app.use(bodyParser.urlencoded({ extended: false }))

// 静态资源托管
app.use(express.static('static'));

// 调用自己写的路由模块
app.use('/manager', managerRoute);

// 开启监听
app.listen(8080, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('开启服务器！');
})