const crypto = require('crypto')
require('dotenv').config();

module.exports = {
    encrypt: function (text) {
        encryptalgo = crypto.createCipher('aes-128-cbc', process.env.KEY_PASS);
        let encrypted = encryptalgo.update(text, 'utf8', 'hex');
        encrypted += encryptalgo.final('hex');
        return encrypted;
    },
    decrypt: function decrypt(encrypted) {
        decryptalgo = crypto.createDecipher('aes-128-cbc', process.env.KEY_PASS);
        let decrypted = decryptalgo.update(encrypted, 'hex', 'utf8');
        decrypted += decryptalgo.final('utf8');
        return decrypted;
    }
}