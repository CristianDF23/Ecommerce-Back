import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: "cristian.eam85@gmail.com",
        pass: "wwykkpxngbhnmztm",
    },
});
