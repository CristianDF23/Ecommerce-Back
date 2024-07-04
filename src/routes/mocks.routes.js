import {Router} from 'express'
import { generatorProducts } from '../controllers/mocks.controlles.js';

const routerMocks = Router();

routerMocks.get('/mockingproducts', generatorProducts)

export default routerMocks