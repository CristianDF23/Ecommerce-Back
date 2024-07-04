import { Router } from 'express'
import { authorization } from '../middleware/authorization.js';
import { addProducts, createCart, deleteAllProducts, deleteCart, deleteProductOfCart, getCartProducts, purchase, updateQuantity } from '../controllers/carts.controllers.js'
import passport from 'passport';

const routerCarts = Router();

routerCarts.post('/', createCart);
routerCarts.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), authorization(['Usuario', 'Premium']), addProducts);
routerCarts.get('/:cid', getCartProducts);
routerCarts.delete('/deleteCart/:cid', deleteCart);
routerCarts.delete('/:cid/product/:pid', deleteProductOfCart);
routerCarts.delete('/:cid', deleteAllProducts);
routerCarts.put('/:cid/product/:pid', updateQuantity);
routerCarts.get('/:cid/purchase', purchase)

export default routerCarts;