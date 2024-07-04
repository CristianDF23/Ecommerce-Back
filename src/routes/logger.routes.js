import {Router} from 'express';
import { loggerTest } from '../controllers/logger.controller.js';

const routerLogger = Router();

routerLogger.get('/loggerTest', loggerTest);

export default routerLogger;