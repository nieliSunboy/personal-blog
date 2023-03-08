const clientDB = require('../utils/mysql');
const jwt = require('../utils/token');
const { time } = require('../utils/time')

/**
 * 判断对象是否存在
 */
const verifyUser = (info, res) => {
    if (!info.userName) {
        res.send({ code: 50, msg: '用户名不能为空', data: null });
        return false
    }

    if (!info.password) {
        res.send({ code: 50, msg: '密码不能为空', data: null });
        return false
    }

    return true
}

/**
 * 查询
 */

/**
 * 登录接口 
*/
const login = (req, res) => {
    const { userName, password } = req.body;

    if (!verifyUser(req.body, res)) {
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

        if (info.password !== password) {
            res.send({ code: 50, msg: '密码不正确', data: null });
            return
        }
        // 办法token
        const token = jwt.encrypt({
            user: {
                userName: info.user_name,
                userId: info.user_id
            }
        }, 'token', '1h');

        res.send({ code: 0, msg: '登录成功', data: token });

    })
}

/**
 * register 注册用户
 */

const register = (req, res) => {
    const { userName, password } = req.body;

    if (!verifyUser(req.body, res)) {
        return
    }

    const sql = `insert ignore into sys_user(user_name, password, status, create_time) VALUE('${userName}','${password}', 1, '${time(new Date())}')`
    clientDB.query(sql, (result) => {

        if (result.warningStatus) {
            res.send({ code: 50, msg: '用户名已存在！', data: null });
            return
        }

        res.end({ code: 50, msg: '注册完成', data: null })
    });
}

/**
 * 新增用户
 */
const insertUser = (req, res) => {
    const info = req.body;

    if (!verifyUser(req.body, res)) {
        return
    }
    console.log(info)
    // 保存到数据库
    let sql = `insert ignore into sys_user(user_name, password, nickName, sex, emall, create_time, create_user, status) value('${info.userName}', '${info.password}', '${info.nickName}', ${info.sex}, '${info.emall}', '${time(new Date())}', 1, 1)`

    clientDB.query(sql, (result) => {
        const info = result;
        if (result.warningStatus) {
            res.send({ code: 50, msg: '用户名已存在！', data: null });
            return
        }

        res.end({ code: 50, msg: '添加完成', data: null })
    })

}

/**
 * 查询用户列表
 */
const findUserList = (req, res) => {
    const queryParams = req.body || {};
    console.log(req.body)

    if (!queryParams.pageSize) queryParams.pageSize = 10;
    if (!queryParams.current) queryParams.current = 1;


    let sqlCount = `select COUNT(user_id) as count from sys_user `

    let sqlWhere = `WHERE user_name like '%${queryParams.userName || ''}%'`;

    clientDB.query(sqlCount + sqlWhere, result => {
        const count = result[0].count;

        if (!count) {
            res.send({
                code: 50, msg: '查询完成', data: {
                    data: [],
                    totals: 0
                }
            });
            return
        }

        let sql = `select * from sys_user ${sqlWhere} limit ${queryParams.pageSize * (queryParams.current - 1) || 0},${queryParams.pageSize}`;

        clientDB.query(sql, list => {
            res.send({
                code: 50, msg: '查询完成', data: {
                    data: list,
                    totals: count
                }
            });
            return
        })      
    })

}


module.exports = {
    login,
    register,
    insertUser,
    findUserList
}