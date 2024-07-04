import { createHash } from "../utils/bcrypt.js"
import { insertCart } from "./carts.services.js"
import { capitalizarPrimeraLetra } from "./dto.services.js"

export const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies[process.env.COOKIE_USER]
    }
    return token
}

export const userNew = async (data) => {
    let rol = 'Usuario';
    
    if (data.email === process.env.ADMIN_USER && data.password === process.env.ADMIN_PASS) {
        rol = 'Admin';
    }
    const newCart = await insertCart();
    const user = {
        email: data.email,
        password: createHash(data.password),
        first_name: capitalizarPrimeraLetra(data.first_name),
        last_name: capitalizarPrimeraLetra(data.last_name),
        phone: data.phone,
        age: data.age,
        rol,
        cart: newCart[0]._id
    }
    return user
};

export const extractedToken = (token) =>{
    const newToken = token.split('token=')[1];
    return newToken
}
