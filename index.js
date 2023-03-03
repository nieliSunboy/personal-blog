const express = require('express');
const cors = require('cors');
const debug = require('debug')('my-application'); // debug模块
const baseCofig = require('./node_config');
const bodyParser = require('body-parser')
const { expressjwt: jwt } = require('express-jwt')
const router = require("./router/index");

const app = new express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(cors());

// token 验证信息
app.use(jwt({
    secret: 'token', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
  }).unless({
    path: ['/api/login', '/api/testDB'] // 除了这两个接口，其他都需要认证
  })
);

app.use((err, req, res, next) => {
    //判断是否由 Token 解析失败导致的
    if (err.name == 'UnauthorizedError') {
        return res.send({
            status: 401,
            message: '无效的Token'
        })
    }
    res.send({
        status: 500,
        message: '未知的错误'
    })
})

app.use('/api', router)

app.listen(baseCofig.prot, () => {
    debug('Express server listening on port '+8082);
})