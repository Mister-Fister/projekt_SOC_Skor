const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({origin: true});

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    domain: "gmail.com",
    user: "bilzaeshop@gmail.com",
    pass: "eqqimjolszxnvkzl",
    authentication: "plain",
  },
});

exports.sendE = functions.region("europe-west1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    const {recipient, subject, message} = req.body;

    const mailOptions = {
      from: "bilzaeshop@gmail.com",
      to: recipient,
      subject: subject,
      text: message,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
});
