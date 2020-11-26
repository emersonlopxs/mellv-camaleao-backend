const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = function (id) {
        const token = jwt.sign({ id }, 'addsasds', {
            expiresIn: '90d' // expires in 10min
        })
        return token
    }