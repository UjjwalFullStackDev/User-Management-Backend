const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
        });
        console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass length:", process.env.EMAIL_PASS.length);

    
        await transporter.sendMail({
            from: `"MyApp" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    
        console.log("Email send sucessfully")
    } catch (error) {
        console.error("Error sending email:", error);
    throw error;
    }
}

module.exports = sendEmail;