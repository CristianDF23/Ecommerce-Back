import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

mongoose.connect('mongodb+srv://cristianFernandez:231096Cdf@ecommerce.w64mz8y.mongodb.net/Test')

let idUser

describe('Testing E-commerce APP (Usuarios)', () => {
    beforeEach(async function () {
        this.timeout(5000);
        this.cookie = null;
        this.mockUser = {
            first_name: "Test01",
            last_name: "Test01",
            email: "test@test.com",
            password: "212301Co",
            age: 22,
            phone: 123456,
        };
        this.mockUser2 = {
            first_name: "Test02",
            last_name: "Test02",
            email: "testUsuario@test.com",
            password: "1234",
            age: 22,
            phone: 123456,
        };
    });
    
    describe("Testing de registro de usuario:", () => {

        it("Se espera registrar correctamente un usuario", async function () {
            try {
                const { statusCode, _body } = await requester.post('/api/auth/register').send(this.mockUser);
                const res = await requester.post('/api/auth/register').send(this.mockUser2);
                idUser = res._body[0]._id

                expect(statusCode).is.equal(201);
                expect(_body.length).to.be.at.least(1);;
                const firstUser = _body[0];
                expect(firstUser).to.be.an('object');
                expect(firstUser).to.have.property('_id');
                expect(firstUser).to.have.property('email').equal(this.mockUser.email);
                expect(firstUser).to.have.property('first_name').equal(this.mockUser.first_name);
                expect(firstUser).to.have.property('last_name').equal(this.mockUser.last_name);
                expect(firstUser).to.have.property('cart').to.be.a('string');
            } catch (error) {
                console.error('Error en el test de registro de usuario:', error);
                throw error;
            }
        });

        it("Se espera un error al registrar un usuario con un correo que ya está en uso", async function () {
            try {
                await requester.post('/api/auth/register').send(this.mockUser1);
                const { statusCode, header } = await requester.post('/api/auth/register').send(this.mockUser);
                expect(statusCode).is.equal(401);
                expect(header['www-authenticate']).is.equal('El usuario ya existe');
            } catch (error) {
                console.error('Error en el test de registro de usuario con correo existente:', error);
                throw error;
            }
        });

    });
    describe('Testing de login de usuario', () => {
        it("Se espera hacer login correctamente con un usuario y contraseña válidos", async function () {
            try {
                const credentials = {
                    email: this.mockUser.email,
                    password: this.mockUser.password,
                };
                const { statusCode, _body, header } = await requester.post('/api/auth/login').send(credentials);
                const cookieResult = header['set-cookie'][0]
                const cookieData = cookieResult.split('=')
                this.cookie = {
                    name: cookieData[0],
                    value: cookieData[1]
                }
                expect(this.cookie.name).is.ok.and.eql('cookieUserDev')
                expect(this.cookie.value).is.ok
                expect(statusCode).to.equal(200);
                expect(_body).to.be.a('object')
            } catch (error) {
                console.error('Error en el test de login de usuario correcto:', error);
                throw error;
            }
        });

        it("Se espera un error al intentar hacer login con un usuario y/o contraseña incorrectos", async function () {
            try {
                const credentials = {
                    email: 'noexisteelusuario@example.com',
                    password: '123423423',
                };

                const { statusCode, body } = await requester.post('/api/auth/login').send(credentials);
                expect(statusCode).to.equal(401);
                expect(body).to.have.property('Error').equal('Usuario y/o Contraseña incorrecta');
            } catch (error) {
                console.error('Error en el test de login de usuario y/o password incorrecto:', error);
                throw error;
            }
        });

        it("Se espera un error al intentar hacer login con un usuario que no existe", async function () {
            try {
                const credentials = {
                    email: 'noexisteelusuario@example.com',
                    password: this.mockUser.password
                };

                const { statusCode, body } = await requester.post('/api/auth/login').send(credentials);
                expect(statusCode).to.equal(401);
                expect(body).to.have.property('Error').equal('Usuario y/o Contraseña incorrecta');
            } catch (error) {
                console.error('Error en el test de login de usuario inexistente:', error);
                throw error;
            }
        });
    });

    describe('Testing actualizar usuario', () => {
        it("Se espera cambiar el rol de un usuario a Premium", async function () {
            try {
                const changeRole = {
                    rol: 'Premium'
                }

                const res = await requester.put(`/api/auth/premium/${idUser}`).send(changeRole);
                expect(res.statusCode).to.equal(200)
                expect(res._body).to.have.property('_id').to.equal(idUser)
                expect(res._body).to.have.property('rol').to.equal('Premium')
            } catch (error) {
                console.error('Error en el test de actualizacion de usuario:', error);
                throw error;
            }
        });
    })

    describe('Testing logout de usuario', () => {
        it("Se espera eliminar la cookie de sesión al hacer logout", async function () {
            try {
                const logoutResponse = await requester.get('/api/auth/logout').send({email: this.mockUser.email});
                expect(logoutResponse.status).to.equal(200);
                expect(logoutResponse.text).to.equal('Sesion cerrada correctamente');
            } catch (error) {
                console.error('Error en el test de logout de usuario:', error);
                throw error;
            }
        });
    })

    after(async function () {
        try {
            await mongoose.connection.collection('users').deleteMany({});
        } catch (error) {
            console.error('Error limpiando la colección de usuarios después del test:', error);
            throw error;
        }
    });
});

