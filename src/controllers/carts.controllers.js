import { delCart, findCartById, insertCart, upCart } from '../services/carts.services.js'
import { findProductById } from '../services/products.services.js';
import { upProduct } from '../services/products.services.js';

//Crear carrito nuevo
export const createCart = async (req, res) => {

    try {
        const isNewCart = await insertCart();
        if (!isNewCart) {
            req.logger.warning(`Error al crear el carrito - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `Error al crear el carrito` });
        } else {
            req.logger.info(`Carrito creado con éxito - ID: ${isNewCart[0]._id} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(201).json(isNewCart);
        }
    } catch (error) {
        req.logger.error(`Error al crear carrito en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};


//Agregar producto al carrito
export const addProducts = async (req, res) => {
    const user = req.user
    try {
        const product = await findProductById(req.params.pid);
        const cart = await findCartById(req.params.cid);
        if (!product) {
            req.logger.warning(`No se encontró el producto - ID: ${req.params.pid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el producto` });
        }

        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        }

        if (product.owner == user.email) {
            req.logger.warning(`No se puede agregar el producto al carrito - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se puede agregar el producto al carrito` });
        } else {
            const existingItem = cart.products.findIndex(item => item.product.id == req.params.pid);
            if (existingItem === -1) {
                cart.products.push({ product: req.params.pid, quantity: 1 });
                req.logger.info(`Producto añadido al carrito - Producto ID: ${req.params.pid}, Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            } else {
                cart.products[existingItem].quantity += 1;
                req.logger.info(`Cantidad de producto incrementada - Producto ID: ${req.params.pid}, Carrito ID: ${req.params.cid}, Nueva cantidad: ${cart.products[existingItem].quantity} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            }

            await upCart(req.params.cid, cart);
            req.logger.info(`Carrito actualizado - Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(201).json(cart);
        }
    } catch (error) {
        req.logger.error(`Error al agregar producto en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }

};


//Mostrar productos del carrito
export const getCartProducts = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        } else {
            req.logger.info(`Carrito encontrado - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(200).json(cart);
        }
    } catch (error) {
        req.logger.error(`Error al obtener productos en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};


//Eliminar carrito
export const deleteCart = async (req, res) => {
    try {
        const cart = await delCart(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se pudo eliminar el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se pudo eliminar el carrito` });
        } else {
            req.logger.info(`Carrito eliminado correctamente - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(200).json({ Msg: `Carrito eliminado correctamente` });
        }
    } catch (error) {
        req.logger.error(`Error al eliminar carrito en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};


//Eliminar un producto del carrito
export const deleteProductOfCart = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        }

        const existingItem = cart.products.findIndex(item => item._id == req.params.pid);
        if (existingItem === -1) {
            req.logger.warning(`No se encontró el producto - ID: ${req.params.pid}, Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el producto` });
        }

        cart.products.splice(existingItem, 1);
        await cart.save();

        req.logger.info(`Producto eliminado del carrito - Producto ID: ${req.params.pid}, Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);

        return res.status(200).json(cart);
    } catch (error) {
        req.logger.error(`Error al eliminar producto en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};


//Eliminar todos los productos del carrito
export const deleteAllProducts = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        }

        cart.products = [];
        await cart.save();

        req.logger.info(`Productos eliminados correctamente - Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);

        return res.status(200).json({ Msg: `Productos eliminados correctamente`, cart });
    } catch (error) {
        req.logger.error(`Error al eliminar los productos ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};


//Actualizar la cantidad de un producto
export const updateQuantity = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        }

        const productIndex = cart.products.findIndex(i => i._id == req.params.pid);
        if (productIndex === -1) {
            req.logger.warning(`No se encontró el producto - ID: ${req.params.pid}, Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el producto` });
        }

        cart.products[productIndex].quantity = req.body.quantity;
        await cart.save();

        req.logger.info(`Cantidad de producto actualizada en el carrito - Producto ID: ${req.params.pid}, Carrito ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);

        return res.status(200).json(cart);
    } catch (error) {
        req.logger.error(`Error al actualizar cantidad en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};



//Finalizar Compra
export const purchase = async (req, res) => {
    try {
        const cart = await findCartById(req.params.cid);
        if (!cart) {
            req.logger.warning(`No se encontró el carrito - ID: ${req.params.cid} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).json({ Msg: `No se encontró el carrito` });
        }

        const arrayProducts = cart.products;
        const updateStock = arrayProducts.filter(elem => elem.product.stock >= elem.quantity);
        const updateCart = arrayProducts.filter(elem => elem.product.stock < elem.quantity);
        cart.products = updateCart;
        await upCart(req.params.cid, cart);

        for (const productItem of updateStock) {
            productItem.product.stock -= productItem.quantity;
            if (productItem.product.stock == 0) {
                productItem.product.status = false;
                await upProduct(productItem.product._id, { stock: productItem.product.stock, status: productItem.product.status });
            }
            await upProduct(productItem.product._id, { stock: productItem.product.stock });
        }

        req.logger.info(`Compra completada con éxito - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
        res.status(200).json(cart);
    } catch (error) {
        req.logger.error(`Error al completar la compra en ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()} --> ${error}`);
        return res.status(500).json({ Msg: error });
    }
};

