import productsModels from '../models/products.models.js'

//Agregar Producto
export const insertProduct = async (product) => {
    try {
        return await productsModels.insertMany(product);
    } catch (error) {
        console.log(error);
    };
};

//Mostar productos
export const allProducts = async (filters, option) => {
    try {
        return await productsModels.paginate(filters, option);
    } catch (error) {
        console.log(error);
    };
};

//Buscar Producto por su id
export const findProductById = async (id) => {
    try {
        return await productsModels.findById(id);
    } catch (error) {
        console.log(error);
    };
};

//Buscar Producto por su codigo
export const findProduct = async (product) => {
    try {
        return await productsModels.findOne({ code: product.code });
    } catch (error) {
        console.log(error);
    };
};

//Eliminar Producto
export const delProduct = async (pid) => {
    try {
        const product = await productsModels.findByIdAndDelete(pid);
        return product;
    } catch (error) {
        console.log(error);
    };
};

//Actualizar Producto
export const upProduct = async (pid, product) =>{
    try {
        return await productsModels.findByIdAndUpdate(pid, product, {new: true});
    } catch (error) {
        console.log(error);
    };
};
