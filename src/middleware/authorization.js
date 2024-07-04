export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'unauthorized' });
        if (!roles.includes(req.user.rol)) return res.status(403).send({ error: 'no permissions' });
        next();
    }
}
