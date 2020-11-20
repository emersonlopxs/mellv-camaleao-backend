const SendEmail = require('../utils/sendMail');

module.exports = {
  async create(req, res) {
    console.log('send contact email!');
    const { name, email, subject, message } = req.body;
    try {
      const { error } = await SendEmail({
        name: name,
        to: email,
        message: `
        <div>
          <p>
            Nova mensagem de ${name} ${email}
          </p>
          <p>
            Sssunto: ${subject}
          </p>
          <p>
            Mensagem: ${message}
          </p>

          <p>Camaleao - Mellv</p>
        </div>
        `,
      });

      if (error) {
        res.status(502).send({
          error: 'Email error',
          message: 'Your email is not valid, but your account was created',
        });
      }

      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.log('error -> ', err);
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'It was not possible to create this evaluations',
        err,
      });
    }
  },
};
