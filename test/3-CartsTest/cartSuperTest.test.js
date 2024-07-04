import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

mongoose.connect('mongodb+srv://cristianFernandez:231096Cdf@ecommerce.w64mz8y.mongodb.net/Test')

let cartId
let prodId
let idQuantity

describe('Testing E-commerce APP (Carritos)', () => {

    before(async function () {
        this.cookie
        this.cookieAdmin
        this.mockUser = {
            email: "testCarts@test.com",
            password: "1234",
            first_name: "Test",
            last_name: "User",
            age: 22,
            phone: 123456,
        };
        this.mockUser1 = {
            email: "test@test.com",
            password: "212301Co",
            first_name: "Test",
            last_name: "User",
            age: 22,
            phone: 123456,
        };
        this.productData = {
            code: "PROD001",
            stock: 50,
            brand: "TestBrand",
            title: "Test Product",
            category: "TestCategory",
            description: "This is a test product",
            price: 100,
        };

        await requester.post('/api/auth/register').send(this.mockUser);

        const loginResponse = await requester.post('/api/auth/login').send({
            email: "testCarts@test.com",
            password: "1234"
        });
        cartId = loginResponse._body.cart
        const cookieResult = loginResponse.header['set-cookie'][0]
        const cookieData = cookieResult.split('=')
        this.cookie = {
            name: cookieData[0],
            value: cookieData[1]
        }

        await requester.post('/api/auth/register').send(this.mockUser1);

        const loginAdmin = await requester.post('/api/auth/login').send({
            email: "test@test.com",
            password: "212301Co"
        });
        const cookieResultAdmin = loginAdmin.header['set-cookie'][0]
        const cookieDataAdmin = cookieResultAdmin.split('=')
        this.cookieAdmin = {
            name: cookieDataAdmin[0],
            value: cookieDataAdmin[1]
        }

        const newProd = await requester.post('/api/products/')
            .set('Cookie', [`${this.cookieAdmin.name}=${this.cookieAdmin.value}`])
            .field('code', this.productData.code)
            .field('stock', this.productData.stock)
            .field('brand', this.productData.brand)
            .field('title', this.productData.title)
            .field('category', this.productData.category)
            .field('description', this.productData.description)
            .field('price', this.productData.price)
            .attach('thumbnails', './test/files/CopaPure-1.webp')
            .attach('thumbnails', './test/files/CopaPure-2.webp')
            .attach('thumbnails', './test/files/CopaPure-3.webp')
            .attach('thumbnails', './test/files/CopaPure-4.webp')

        prodId = newProd._body[0]._id
    });


    describe('Testing de creación de carrito', () => {
        it("Se espera crear un carrito correctamente", async function () {
            try {
                const res = await requester.post('/api/carts')
                expect(res.statusCode).to.equal(201)
                expect(res._body).to.be.an('array').to.have.lengthOf(1)
                expect(res._body[0]).to.have.property('_id')
                expect(res._body[0]).to.have.property('products').to.be.an('array').that.is.empty
            } catch (error) {
                console.error('Error en el test de creación de carrito:', error);
                throw error;
            }
        });
    })

    describe('Testing para agregar productos al carrito', () => {
        it("Se espera agregar un producto al carrito correctamente con un usuario", async function () {
            try {
                const res = await requester.post(`/api/carts/${cartId}/product/${prodId}`)
                    .set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
                idQuantity = res._body.products[0]._id
                expect(res.statusCode).to.equal(201)
                expect(res._body).to.have.property('products').to.be.an('array').to.have.lengthOf(1)
                expect(res._body.products[0]).to.have.property('product').to.equal(prodId)
                expect(res._body.products[0]).to.have.property('quantity').to.equal(1)
            } catch (error) {
                console.error('Error en el test de creación de carrito:', error);
                throw error;
            }
        });
    })

    describe('Testing para obtener productos del carrito', () => {
        it("Se espera obtener los productos de carrito por medio de su ID", async function () {
            try {
                const res = await requester.get(`/api/carts/${cartId}`)
                expect(res.statusCode).to.equal(200)
                expect(res._body.products[0].product).to.have.property('title').to.equal(this.productData.title)
                expect(res._body.products[0].product).to.have.property('_id').to.equal(prodId)
            } catch (error) {
                console.error('Error en el test de creación de carrito:', error);
                throw error;
            }
        });
    })

    describe('Testing para actualizar cantidad de un producto existente en el carrito', () => {
        it("Se espera actualizar la cantidad del producto existente en el carrito", async function () {
            try {
                const updatedQuantity = {
                    quantity: 3
                };
                const res = await requester.put(`/api/carts/${cartId}/product/${idQuantity}`)
                    .send(updatedQuantity)
                expect(res.statusCode).to.equal(200)
                expect(res._body.products[0]).to.have.property('product').to.have.property('_id').to.equal(prodId)
                expect(res._body.products[0]).to.have.property('quantity').to.equal(updatedQuantity.quantity)
            } catch (error) {
                console.error('Error en el test de creación de carrito:', error);
                throw error;
            }
        });
    })

    describe('Testing para eliminar un producto existente en el carrito', () => {
        it("Se espera eliminar el producto existente en el carrito", async function () {
            try {
                const res = await requester.delete(`/api/carts/${cartId}/product/${idQuantity}`)
                expect(res.statusCode).to.equal(200)
                expect(res._body).to.have.property('products').to.be.an('array').that.is.empty
            } catch (error) {
                console.error('Error en el test de creación de carrito:', error);
                throw error;
            }
        });
    })

    after(async function () {
        this.timeout(5000);
        try {
            await mongoose.connection.collection('users').deleteMany({});
            await mongoose.connection.collection('carts').deleteMany({});
            await mongoose.connection.collection('products').deleteMany({});
        } catch (error) {
            console.error('Error limpiando la colección de usuarios después del test:', error);
            throw error;
        }
    });
})

