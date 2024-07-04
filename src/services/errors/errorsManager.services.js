export default class ProductErrorManager {
    static createError({ name = 'ProductError', cause, message, code = 10 }) {
        const error = new Error(message, {cause});
        error.name = name;
        error.code = code;
        error.cause = cause ? new Error(cause) : null
        throw error;
    }
}