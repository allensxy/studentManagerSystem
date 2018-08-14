// 导包
const express = require('express');
// 导入模板引擎包
const template = require('art-template');

// 导入数据库处理模块
const helper = require('../tools/helper');

// 路径模块
const path = require('path');

// 实例化路由对象
let router = express.Router();

// 判断是否登录的中间件
router.use(function(req, res, next) {
    // console.log(req.url);
    // 拿到url路径判断，除了退出登录，都需要判断是否登陆
    if (req.url != '/loginout') {
        if (!req.session.userName) {
            helper.tips(res, '请先登录！', '/manager/login');
        } else {
            next();
        }
    } else {
        next();
    }
    // next();
})

// 注册路由
// 首页
router.get('/index', (req, res) => {
    let obj = {};
    console.log(req.query.search);
    //如果有值传过来就拼接对象，没有就传空对象查全部
    if (req.query.search) {
        // 如果get提交的方式不是后面/:id这样的拼接参数的方法，则直接用query传字符串来获取提交过来的值
        obj = {
            userName: { $regex: req.query.search }
        }
    }
    helper.find('student', obj, (result) => {
        // console.log(result);
        // 渲染模板
        let html = template(path.join(__dirname, '../template/index.html'), {
            userName: req.session.userName,
            result,
            keyworld: req.query.search
        });
        res.send(html);
    })
})

// 退出登陆
router.get('/loginout', (req, res) => {
    // 清除session
    req.session.userName = undefined;
    // 回到登录页面
    res.redirect('/manager/login');
})

// 新增页面
router.get('/insert', (req, res) => {
    // 渲染模板
    let html = template(path.join(__dirname, '../template/add.html'), {
        userName: req.session.userName
    });
    res.send(html);
})

// 新增页面 post 提交数据
router.post('/insert', (req, res) => {
    // 用body中间件拿到提交过来的表单数据
    // console.log(stuData);
    // 渲染模板
    helper.insertOne('student', req.body, (result) => {
        // res.send(result);
        console.log(result);
        if (result.n == 1) {
            helper.tips(res, '添加成功！', '/student/index');
        } else {
            helper.tips(res, '添加失败', '/student/insert');
        }
    });
})

// 删除
router.get('/delete/:id', (req, res) => {
    // 用body中间件拿到提交过来的表单数据
    // console.log(stuData);
    console.log(req.params);
    // get 通过/:id的方式带参数提交，通过 req.params 获取传过来的参数
    let id = req.params.id;
    // 渲染模板
    helper.deleteOne('student', { _id: helper.objectId(id) }, (result) => {
        // res.send(result);
        console.log(result);
        if (result.n == 1) {
            helper.tips(res, '删除成功！', '/student/index');
        } else {
            helper.tips(res, '删除失败！', '/student/index');
        }
    });
})

// 编辑
router.get('/edit/:id', (req, res) => {
    // 获取id
    let id = req.params.id;
    // 渲染模板
    helper.find('student', { _id: helper.objectId(id) }, (result) => {
        // res.send(result);
        let html = template(path.join(__dirname, '../template/edit.html'), {
            userInfo: result[0],
            userName: req.session.userName
        });
        res.send(html);
    });
});
// 编辑 post 提交数据
router.post('/edit', (req, res) => {
    // 用body中间件拿到提交过来的表单数据
    // console.log(req.body);
    let id = req.body.id;
    // 处理id身上的双引号
    id = id.replace('"', '');
    id = id.replace('"', '');
    delete req.params.id;
    // 渲染模板
    helper.updateOne('student', { _id: helper.objectId(id) }, { $set: req.body }, (result) => {
        // res.send(result);
        if (result.n == 1) {
            helper.tips(res, '修改成功！', '/student/index');
        } else {
            helper.tips(res, '修改失败！', '/student/index');
        }
    });
})


module.exports = router;