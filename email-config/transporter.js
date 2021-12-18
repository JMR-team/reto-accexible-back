const { createTransport } = require("nodemailer");

// smtp transporter configuration
const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

module.exports = transporter;