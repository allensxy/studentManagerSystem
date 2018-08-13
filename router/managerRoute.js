// 导包
const express = require('express');
// 导入第三方的 验证码模块
const svgCaptcha = require('svg-captcha');

// 导入数据库处理模块
const helper = require('../tools/helper');

// 路径模块
const path = require('path');

// 实例化路由对象
let router = express.Router();

// 注册路由
// 登陆页面
router.get('/login', (req, res) => {
        // 因为入口文件访问的是router这个文件夹，与template是同一级别，所以路径得往上跳一级
        res.sendFile(path.join(__dirname, '../template/login.html'));
    })
    // 登陆 post 提交页面
router.post('/login', (req, res) => {
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    let vCode = req.body.vCode.toLowerCase();
    console.log(req.session.captcha);
    if (req.session.captcha != vCode) {
        helper.tips(res, '验证码输入错误！', '/manager/login');
    } else {
        // 调用helper模块
        helper.find('admin', { userName, userPass }, (result) => {
            // console.log(result);
            if (result.length != 0) { //如果等于 长度等于0，表示没有，把用户添加进去
                // 去首页
                res.redirect('/student/index');
            } else {
                helper.tips(res, '用户名或者密码错误！', '/manager/login');
            }
        });
    }
})

// 注册页面
router.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, '../template/register.html'));
    })
    // 注册 post 提交页面
router.post('/register', (req, res) => {
    // res.send(req.body);
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // 调用helper模块
    helper.find('admin', { userName }, (result) => {
        if (result.length == 0) { //如果等于 长度等于0，表示没有，把用户添加进去
            helper.insertOne('admin', { userName, userPass }, (result) => {
                // console.log(result.result);
                if (result.result.n == 1) {
                    // 注册成功回到首页
                    helper.tips(res, '恭喜你，注册成功！', '/manager/login');
                }
            });
        } else {
            helper.tips(res, '该账号已被注册！', '/manager/register');
        }
    });
})

// 验证码
router.get('/vCode', (req, res) => {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLowerCase();
    // console.log(req.session.captcha);
    res.type('svg');
    res.status(200).send(captcha.data);
})

module.exports = router;