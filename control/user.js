const clientDB = require('../utils/mysql');
const jwt = require('../utils/token')
/**
 * 登录接口 
*/ 

const login = (req, res) => {
    const { userName, password } = req.body;

    if (!userName) {
        res.send({ code: 50, msg: '用户名不能为空', data: null });
        return
    }

    if(!password) {
        res.send({ code: 50, msg: '密码不能为空', data: null });
        return 
    }

    const sql = `SELECT * FROM sys_user WHERE user_name='${userName}'`;

    clientDB.query(sql, (result) => {
        const info = result.find(v => v.user_name === userName);
        console.log('info', info)

        if (!info) {
            res.send({ code: 50, msg: '用户不存在', data: null });
            return 
        }

        if(info.password !== password) {
            res.send({ code: 50, msg: '密码不正确', data: null });
            return 
        }
        // 办法token
        const token = jwt.encrypt({ user: {
            userName: info.user_name,
            userId: info.user_id
        }}, 'token', '1h');

        res.send({ code: 0, msg: '登录成功', data: token });

    })
}

/**
 * register 注册用户
 */

const register = (req, res) => {
    const { userName, password } = req.body;

    if (!userName) {
        res.send({ code: 50, msg: '用户名不能为空', data: null });
        return
    }

    if(!password) {
        res.send({ code: 50, msg: '密码不能为空', data: null });
        return 
    }

    const sql = `INSERT INTO sys_user(user_name, password, status) VALUE('${userName}','${password}', 1)`

    clientDB.query(sql, (result) => {
        const info = result.find(v => v.user_name === userName);
        if (!info) {
            res.send({ code: 50, msg: '注册失败', data: null });
            return 
        }

        res.end({code: 50, msg: '注册完成', data: null})
    })
}


module.exports = {
    login,
    register
}