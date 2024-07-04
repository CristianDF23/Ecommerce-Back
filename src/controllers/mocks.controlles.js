import {productsMocks} from '../services/mocks.services.js'

export const generatorProducts = async (req, res) =>{
    let products = [];
    for (let i = 0; i < 100; i++) {
        products.push(productsMocks())
    }
    return res.status(201).send(products);
}