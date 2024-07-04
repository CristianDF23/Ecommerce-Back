import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

mongoose.connect('mongodb+srv://cristianFernandez:231096Cdf@ecommerce.w64mz8y.mongodb.net/Test')

let id

describe('Testing E-commerce APP (Products)', () => {

    before(async function () {
        this.cookie
        this.mockUser = {
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
            price: 100
        };
        await requester.post('/api/auth/register').send(this.mockUser);

        const loginResponse = await requester.post('/api/auth/login').send({
            email: "test@test.com",
            password: "212301Co"
        });
        const cookieResult = loginResponse.header['set-cookie'][0]
        const cookieData = cookieResult.split('=')
        this.cookie = {
            name: cookieData[0],
            value: cookieData[1]
        }
    });

    describe('Testing de creación de producto', () => {

        it("Se espera crear un producto correctamente con un usuario Admin", async function () {
            try {
                const res = await requester.post('/api/products')
                    .set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
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
                    .attach('thumbnails', './test/files/CopaPure-4.webp');

                id = res._body[0]._id

                expect(res.statusCode).to.equal(201);
                expect(res._body[0]).to.have.property('_id')
                expect(res._body[0].code).to.equal(this.productData.code);
                expect(res._body[0].stock).to.equal(this.productData.stock);
                expect(res._body[0].brand).to.equal(this.productData.brand);
                expect(res._body[0].title).to.equal(this.productData.title);
                expect(res._body[0].category).to.equal(this.productData.category);
                expect(res._body[0].description).to.equal(this.productData.description);
                expect(res._body[0].price).to.equal(this.productData.price);
            } catch (error) {
                console.error('Error en el test de creación de producto:', error);
                throw error;
            }
        });

        it("Se espera un error si el código de producto ya existe", async function () {
            try {
                const res = await requester.post('/api/products')
                    .set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
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
                    .attach('thumbnails', './test/files/CopaPure-4.webp');

                expect(res.statusCode).to.equal(400);
                expect(res._body).to.have.property('Msg')
                expect(res._body.Msg).to.equal('Error al crear el producto, el codigo ya existe');
            } catch (error) {
                console.error('Error en el test de creación de producto:', error);
                throw error;
            }
        });
    })

    describe('Testing para obtener productos y paginacion', () => {
        it("Se espera un array con datos de paginación y productos", async function () {
            try {
                const res = await requester.get('/api/products')
                expect(res.statusCode).to.equal(200)
                expect(res._body).to.have.property('status').to.equal('success')
                expect(res._body).to.have.property('payload').to.have.lengthOf(1)
                expect(res._body.totalPages).to.equal(res._body.arrayPages.length)
            } catch (error) {
                console.error('Error en el test para obtener los productos:', error);
                throw error;
            }
        });
    })
    describe('Testing para obtener un producto segun su ID', () => {
        it("Se espera el producto que se pasa su ID como parámetro", async function () {
            try {
                const res = await requester.get(`/api/products/${id}`)
                expect(res.statusCode).to.equal(200)
                expect(res._body).to.have.property('_id').to.equal(id)
                expect(res._body).to.have.property('code').to.equal(this.productData.code)
                expect(res._body).to.have.property('owner').to.equal('Admin')
            } catch (error) {
                console.error('Error en el test para obtener el producto:', error);
                throw error;
            }
        });
    })

    describe('Testing para actualizar un producto segun su ID', () => {
        it("Se espera actualizar el producto que se pasa su ID como parámetro", async function () {
            try {
                const updatedProductData = {
                    title: 'Test Product Actualizado',
                    price: 1200                 
                };
                const res = await requester.put(`/api/products/${id}`)
                .set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
                .send(updatedProductData)
                expect(res.statusCode).to.equal(200)
                expect(res._body._id).to.equal(id)
                expect(res._body.title).to.equal('Test Product Actualizado')
            } catch (error) {
                console.error('Error en el test para actualizar el producto:', error);
                throw error;
            }
        });
    })

    describe('Testing para eliminar un producto segun su ID', () => {
        it("Se espera eliminar el producto que se pasa su ID como parámetro", async function () {
            try {
                const res = await requester.delete(`/api/products/${id}`)
                .set('Cookie', [`${this.cookie.name}=${this.cookie.value}`])
                expect(res.statusCode).to.equal(200)
                expect(res._body._id).to.equal(id)
                expect(res._body.code).to.equal(this.productData.code)
            } catch (error) {
                console.error('Error en el test para eliminar el producto:', error);
                throw error;
            }
        });
    })

    after(async function () {
        this.timeout(5000);
        try {
            await mongoose.connection.collection('users').deleteMany({});
        } catch (error) {
            console.error('Error limpiando la colección de usuarios después del test:', error);
            throw error;
        }
    });
})

