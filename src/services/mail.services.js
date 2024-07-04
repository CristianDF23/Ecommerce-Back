import { appLogger } from '../config/loggers.js';
import ticketModels from '../models/ticket.models.js';
import { mailDeletedAccount } from '../utils/mailDeleteAccount.js'
import { mailPassword } from '../utils/mailPassword.js'
import { mailTicket } from '../utils/mailTicket.js'
import { transporter } from '../config/nodemailer.js';
import { mailDeletedProduct } from '../utils/mailDeleteProduct.js';

//Crear Ticket
export const createTicket = async (ticket) => {
    try {
        const newTicket = await ticketModels.insertMany(ticket);
        return newTicket
    } catch (error) {
        console.log(error);
    };
};

export const sendTicket = async (ticket, products, emailUser) => {
    try {
        const email = await transporter.sendMail({
            from: 'CSport <cristian.eam85@gmail.com>',
            to: emailUser,
            subject: 'Gracias por su compra!',
            html: mailTicket(ticket, products),
        });
        appLogger.info('Correo enviado:', email.response);
    } catch (error) {
        appLogger.error('Error al enviar el correo:', error);
    }
};

export const sendRestorePassword = async (userEmail, token) => {
    try {
        const emailResponse = await transporter.sendMail({
            from: 'CSport <cristian.eam85@gmail.com>',
            to: userEmail,
            subject: 'Restablecer contraseña',
            html: mailPassword(token)
        });
        console.log('Correo enviado:', emailResponse.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};


export const deletedAccount = async (userEmail) => {
    try {
        const emailResponse = await transporter.sendMail({
            from: 'CSport <cristian.eam85@gmail.com>',
            to: userEmail,
            subject: 'Equipo de cuentas de CSport',
            html: mailDeletedAccount()
        });
        console.log('Correo enviado:', emailResponse.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

export const deletedProduct = async (userEmail, prod) => {
    try {
        const emailResponse = await transporter.sendMail({
            from: 'CSport <cristian.eam85@gmail.com>',
            to: userEmail,
            subject: 'Equipo de cuentas de CSport',
            html: mailDeletedProduct(prod)
        });
        console.log('Correo enviado:', emailResponse.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};