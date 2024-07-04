import { userNew, extractedToken } from '../services/auth.services.js';
import { insertCart } from '../services/carts.services.js';
import { insertUser, delUser, findUserByEmail, upUser, allUsers, findUserById } from '../services/users.services.js';
import { isValidatePassword, createHash } from '../utils/bcrypt.js'
import { deletedAccount } from '../services/mail.services.js'
import { appLogger } from '../config/loggers.js'
import { fileURLToPath } from 'url';
import fs from 'fs'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import path, { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Registro de usuario
export const registerUser = async (data) => {
    try {
        const newUser = await userNew(data)
        const registerUser = await insertUser(newUser);
        appLogger.info(`Usuario registrado correctamente`)
        return registerUser;
    } catch (error) {
        appLogger.error(`Error al registrar el usuario: ${error}`)
        return error
    }
}

//Login de Usuario
export const loginUser = async (req, res) => {
    try {
        let userEmail = req.body.email
        const isUserFound = await findUserByEmail(userEmail);
        if (!isUserFound) {
            req.logger.error(`Usuario y/o Contraseña incorrecta`);
            return res.status(401).json({ Error: `Usuario y/o Contraseña incorrecta` });
        }

        const validPassword = isValidatePassword(isUserFound.password, req.body.password);
        if (!validPassword) {
            req.logger.error(`Usuario y/o Contraseña incorrecta`);
            return res.status(401).json({ Error: `Usuario y/o Contraseña incorrecta` });
        }
        const { _id, email, first_name, last_name, phone, age, cart, rol, documents } = isUserFound;

        const lastConnection = moment().format('YYYY-MM-DD');
        await upUser(isUserFound._id, { last_connection: lastConnection });

        const token = jwt.sign(
            { email: req.body.email, rol },
            process.env.COOKIE_SECRET,
            { expiresIn: '24h' }
        );
        req.logger.info(`Inicio de sesion exitoso`);
        res.cookie(process.env.COOKIE_USER, token, {
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None',
            secure: true,
            httpOnly: true,
        }).json({ _id, email, first_name, last_name, phone, age, cart, rol, token, documents });
    } catch (error) {
        req.logger.error(`Error al intentar iniciar sesión: ${error}`);
        res.status(500).json({ Error: `Error interno del servidor` });
    }
};

//Login de Usuario con github
export const loginGithub = async (data) => {
    try {
        const newCart = await insertCart();
        let userNew = {
            email: data._json.email,
            first_name: data._json.name,
            rol: 'Usuario',
            cart: newCart[0]._id
        };
        const user = await insertUser(userNew);
        return user;
    } catch (error) {
        return error
    };
};

//Logout de Usuario
export const logoutUser = async (req, res) => {
    try {
        const isUserFound = await findUserByEmail(req.body.email);

        if (!isUserFound) {
            req.logger.warning(`Usuario no encontrado`);
            return res.status(401).json({ Error: `Usuario no encontrado` });
        }

        const lastConnection = moment().format('YYYY-MM-DD');

        await upUser(isUserFound._id, { last_connection: lastConnection });
        req.logger.info(`Sesion finalizada correctamente`);
        return res.status(200).clearCookie(process.env.COOKIE_USER).send('Sesion finalizada correctamente');
    } catch (error) {
        req.logger.error(`Error al cerrar sesión: ${error}`);
        res.status(500).send('Error al eliminar la cookie');
    }
};

//Actualización de Usuario
export const updateUser = async (req, res) => {
    try {
        const isUpdateUser = await upUser(req.params.uid, req.body);
        if (!isUpdateUser) {
            req.logger.warning(`Usuario no encontrado`);
            return res.status(400).json({ Msg: `Usuario no encontrado` });
        }
        req.logger.info(`Usuario actualizado correctamente`);
        return res.status(200).json(isUpdateUser);
    } catch (error) {
        req.logger.error(`Error al actualizar usuario: ${error}`);
        return res.status(500).json({ Msg: error });
    }
};

//Eliminar usuarios
export const deleteUsers = async (req, res) => {
    try {
        const getAllUsers = await allUsers();
        for (const user of getAllUsers) {
            const userLastConnection = moment(user.last_connection);
            const currentDay = moment();
            const daysDisconnected = currentDay.diff(userLastConnection, 'days');

            if (daysDisconnected > 2) {
                await delUser(user._id);
                await deletedAccount(user.email)
            }
        }
        req.logger.info(`Usuarios eliminados correctamente`);
        return res.status(200).json(getAllUsers);

    } catch (error) {
        req.logger.error(`Error al eliminar los usuarios: ${error}`);
        return res.status(500).json({ Msg: error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const isUserDelete = await delUser(req.params.uid)
        if (!isUserDelete) {
            req.logger.warning(`Error al eliminar el usuario id: ${req.params.uid}`);
        }
        req.logger.info(`Usuario eliminado correctamente`);
        return res.status(200).json({ Msg: "usuario eliminado correctamente" });

    } catch (error) {
        req.logger.error(`Error al eliminar el usuario: ${error}`);
        return res.status(500).json({ Msg: error });
    }
};

//Todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const userList = await allUsers()
        req.logger.info(`Usuario obtenidos correctamente`);
        return res.status(200).json({ userList })
    } catch (error) {
        req.logger.error(`Error al obtener usuarios: ${error}`);
        return res.status(500).json({ Msg: error });
    }
}

//Cambiar contraseña
export const updatePassword = async (req, res) => {
    const { email, token, password } = req.body;
    const newToken = extractedToken(token);
    try {
        jwt.verify(newToken, process.env.SECRET_PASSWORD);
        const isUserFound = await findUserByEmail(email);

        if (!isUserFound) {
            req.logger.warning(`Usuario no encontrado - Email: ${email} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await upUser(isUserFound._id, { password: createHash(password) });
        req.logger.info(`Contraseña actualizada con éxito - Email: ${email} - Usuario ID: ${isUserFound._id} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);

        res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (err) {
        req.logger.error(`Error al restablecer contraseña: ${err.message} - Email: ${email} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

//Actualizar Documentos
export const updateDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const files = req.files;
        const isUserFound = await findUserById(userId);
        if (!isUserFound) {
            req.logger.warning(`Usuario no encontrado - ID: ${userId} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const documentArray = [];

        if (files.profile) {
            const file = files.profile[0];
            const newProfileDoc = {
                name: 'profile',
                reference: `${process.env.HOST}${process.env.PORT}/documents/profiles/${file.originalname}`
            };
            const oldProfileDoc = isUserFound.documents.find(doc => doc.reference.includes('/documents/profiles'));
            if (oldProfileDoc) {
                const oldFilePath = join(__dirname, 'public', 'documents', 'profiles', path.basename(oldProfileDoc.reference));

                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                isUserFound.documents = isUserFound.documents.filter(doc => doc.reference !== oldProfileDoc.reference);
            }

            documentArray.push(newProfileDoc);
        }

        if (files.product) {
            files.product.forEach(file => {
                const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
                documentArray.push({
                    name: nameWithoutExt,
                    reference: `${process.env.HOST}${process.env.PORT}/documents/product/${file.originalname}`
                });
            });
        }
        if (files.documents) {
            files.documents.forEach(file => {
                const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
                documentArray.push({
                    name: nameWithoutExt,
                    reference: `${process.env.HOST}${process.env.PORT}/documents/documents/${file.originalname}`
                });
            });
        }

        isUserFound.documents = isUserFound.documents.concat(documentArray);
        await isUserFound.save();
        req.logger.info(`Documentacion actualizada con exito - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
        res.status(200).json({ Msg: 'Documentacion actualizada con exito.', doc: isUserFound.documents });
    } catch (error) {
        req.logger.error(`Error al actualizar los documentos`);
        res.status(500).send('Error al actualizar los documentos: ' + error.message);
    }
};

//Actualizar Rol de Usuario
export const updateUserRol = async (req, res) => {
    try {
        const userId = req.params.uid;

        const isUserFound = await findUserById(userId);

        if (!isUserFound) {
            req.logger.warning(`Usuario no encontrado - ID: ${userId} - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocuments = isUserFound.documents.map(doc => doc.name);
        const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (!hasAllDocuments) {
            req.logger.warning(`Documentacion faltante - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
            return res.status(400).send('Documentacion faltante, agregue todos los documentos');
        }

        await upUser(isUserFound._id, { rol: 'Premium' })
        req.logger.info(`Rol de usuario actualizado correctamente. - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
        res.status(200).json('Rol de usuario actualizado correctamente.');
    } catch (error) {
        req.logger.warning(`Error al actualizar el rol de usuario - at ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`);
        res.status(500).send('Error al actualizar el rol de usuario: ' + error.message);
    }
};