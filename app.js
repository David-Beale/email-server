const express = require('express');
const cors = require('cors');
var helper = require('sendgrid').mail;

const PORT = process.env.PORT || 4000;
const app = express();
require('dotenv').config();
const { SENDGRID_API_KEY } = process.env;


app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/api', (req, res) => {
  res.send('API online')
});


app.post('/api/email', (req, res) => {
  var from_email = new helper.Email(req.body.email);
  var to_email = new helper.Email('david_beale@outlook.com');
  var subject = `Website Contact from ${req.body.name}`;
  var content = new helper.Content('text/plain', req.body.message);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  // var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var sg = require('sendgrid')(SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  console.log(request)
  sg.API(request, function (error, response) {
    if (response) {
      res.status(200).json({
        success: true
      });
    } else {
      res.status(401).json({
        success: false
      });
    }
  });
});


app.listen(PORT, console.log(`Server started on port ${PORT}`));