import cartsModels from '../models/cart.models.js'

//Crear Carrito
export const insertCart = async () => {
    try {
        return await cartsModels.insertMany();
    } catch (error) {
        console.log(error);
    };
};

//Buscar carrito por su id
export const findCartById = async (id) => {
    try {
        return await cartsModels.findOne({_id: id});
    } catch (error) {
        console.log(error);
    };
};

// //Eliminar Carrito
export const delCart = async (cid) => {
    try {
        const cart = await cartsModels.findByIdAndDelete(cid);
        return cart
    } catch (error) {
        console.log(error);
    };
};


//Actualizar Cart
export const upCart = async (cid, cart) =>{
    try {
        return await cartsModels.findByIdAndUpdate(cid, cart, {new: true});
    } catch (error) {
        console.log(error);
    };
};

