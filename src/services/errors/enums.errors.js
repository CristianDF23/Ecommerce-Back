export const ProductErrors = {
    MISSING_DATA: 100, //Se produjo un error porque faltan datos al crear un producto.
    INVALID_DATA: 200, //Se produjo un error debido a datos inválidos al modificar un producto.
    PRODUCT_NOT_FOUND: 300, //El producto solicitado no se encontró en la base de datos.
    DUPLICATE_PRODUCT: 400, //Se intentó crear un producto con un identificador que ya existe en la base de datos.
    STOCK_ERROR: 500, //Stock insuficiente del producto seleccionado
};

export const UserErrors = {
    MISSING_USERNAME: 1000, // Falta el nombre de usuario al crear un usuario.
    MISSING_EMAIL: 2000, // Falta el correo electrónico al crear un usuario.
    INVALID_EMAIL: 3000, // El formato del correo electrónico es inválido.
    DUPLICATE_EMAIL: 4000, // Ya existe un usuario con el mismo correo electrónico.
    PASSWORD_INCORRECT: 5000, // La contraseña es incorrecta.
    USER_NOT_FOUND: 6000, // El usuario solicitado no se encontró en la base de datos.
};

export const CartErrors = {
    CART_NOT_FOUND: 10000, // El carrito solicitado no se encontró en la base de datos.
    EMPTY_CART: 20000, // El carrito está vacío.
};
