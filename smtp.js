import nodemailer from 'nodemailer'

export function smtp(smtpPassword, dbData){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'ecashdice@gmail.com', // generated ethereal user
            pass: smtpPassword
        },
    });
    
      // send mail with defined transport object
    return transporter.sendMail({
            from: '"eCash Dice 👻" <ecashdice@gmail.com>', // sender address
            to: "carlosviniciogarcia1997@gmail.com", // list of receivers
            subject: "db", // Subject line
            text: `${JSON.stringify(dbData)}`, // plain text body
    });
}