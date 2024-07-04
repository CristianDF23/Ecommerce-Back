import { Router } from 'express'
import { insertTicket, tokenRestorePassword } from '../controllers/mail.controllers.js';

const routerMail = Router();

routerMail.post('/newTicket', insertTicket)
routerMail.post('/generateToken', tokenRestorePassword)

export default routerMail;