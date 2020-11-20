const nodemailer = require('nodemailer');
const password = 'S1980082913';
const email = 'emerson.mellv@gmail.com';

module.exports = async function (attributes) {
  return new Promise((resolve, reject) => {
    const { name, message, to } = attributes;
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
    const mailOptions = {
      to: to,
      subject: name + ' | new message !',
      html: message,
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log('Email error:', error);
        reject({
          error,
        });
      } else {
        resolve({
          error: false,
          response,
        });
      }
    });
  });
};
