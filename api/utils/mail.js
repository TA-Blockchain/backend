const nodemailer = require('nodemailer')

const sendEmail = async(email, password) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'Carbonchain.pddikti@gmail.com',
            pass: 'carbonchain123'
            }
        });

        const text = `Berikut ini adalah akun untuk website Carbonchain\n email: ${email}\n Password: ${password}`
        const mailOptions = {
        from: 'Carbonchain@gmail.com',
        to: 'ssteven075@gmail.com',
        subject: 'Password Akun Carbonchain',
        text: text
        };
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("gagal");
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    } catch (error) {
        console.log("Error")
    }
}


module.exports = {sendEmail}