var jwt = require('jsonwebtoken');

const encrypt = (data, type, time) => {
    return jwt.sign(data, type, {expiresIn: time});
}

const decrypt = (token) => {
    try {
        let data = jwt.verify(token, 'token');
        return {
            gadID: data.gadID,
            token: true,
        }
    } catch (err) {
        return {
            gadID: err,
            token: false
        }
    }
}

/**
 * 登录状态验证
 */

const authentication = (token, res) => {
    if (token) {
        let ifToken = decrypt(token);
        if (ifToken.token) {
            return ifToken
        }
    }

    res.send({ code: 0, msg: '登录已过期', data: null })
    return false
}

module.exports = {
    encrypt,
    decrypt,
    authentication
}