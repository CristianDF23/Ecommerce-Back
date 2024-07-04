import { Router } from "express";
import passport from "passport";
import { deleteUsers, deleteUser, loginUser, logoutUser, updateUser, getUsers, updatePassword, updateDocuments, updateUserRol } from "../controllers/auth.controller.js";
import { authorization } from "../middleware/authorization.js";
import { documents } from '../utils/multer.js'

const routerAuth = Router();

routerAuth.post('/register', passport.authenticate('register', { failureMessage: 'El usuario ya existe' }), (req, res) => {
    return res.status(201).json(req.user);
})

routerAuth.post('/login', loginUser);

routerAuth.get('/profile', passport.authenticate('jwt', { session: false }), authorization('Usuario'), (req, res) => {
    return res.json({ email: req.user.email, rol: req.user.rol })
})

routerAuth.get('/github', passport.authenticate('github', {}), (req, res) => { });

routerAuth.get('/callbackGithub', passport.authenticate('github', {}), (req, res) => {
    req.session.user = req.user;
    return res.status(201).send({ Msg: `Usuario registrado correctamente` });
});

routerAuth.put('/premium/:uid', passport.authenticate('jwt', { session: false }), authorization('Admin'), updateUserRol);

routerAuth.post('/logout', logoutUser)


routerAuth.post('/:uid/documents', passport.authenticate('jwt', { session: false }), authorization(['Usuario', 'Premium']), documents.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 4 },
    { name: 'documents', maxCount: 3 }]), updateDocuments)

routerAuth.put('/:uid', updateUser)

routerAuth.delete('/', passport.authenticate('jwt', { session: false }), authorization('Admin'), deleteUsers)

routerAuth.delete('/:uid', deleteUser)

routerAuth.get('/', getUsers)

routerAuth.post('/restorePassword', updatePassword)

export default routerAuth;