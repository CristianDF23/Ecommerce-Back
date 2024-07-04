import { Router } from 'express';
import { authorization } from '../middleware/authorization.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controllers.js";
import passport from 'passport';
import { imgProducts } from '../utils/multer.js';

const routerProduts = Router();

routerProduts.post('/', passport.authenticate('jwt', { session: false }), authorization(['Admin', 'Premium']), imgProducts.array('thumbnails', 4), createProduct);
routerProduts.get('/', getProducts);
routerProduts.get('/:pid', getProduct)
routerProduts.delete('/:pid', passport.authenticate('jwt', { session: false }), authorization(['Admin', 'Premium']), deleteProduct)
routerProduts.put('/:pid', passport.authenticate('jwt', { session: false }), authorization(['Admin', 'Premium']), updateProduct)


export default routerProduts