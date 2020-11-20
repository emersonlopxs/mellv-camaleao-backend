const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = {
  verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    console.log('verify!');
    console.log('token -> ', token);
    if (!token) {
      return res
        .status(401)
        .json({ auth: false, status: 'No token provided.' });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res
          .status(500)
          .json({ auth: false, status: 'Failed to authenticate token.' });
      }

      req.cli_id = decoded.id;
      console.log('decoded -> ', decoded);
    });
    next();
  },
};
