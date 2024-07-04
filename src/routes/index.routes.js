import { Router } from "express";
import routerProduts from "./products.routes.js";
import routerCarts from "./carts.routes.js";
import routerAuth from "./auth.routes.js";
import routerMail from "./mail.routes.js";
import routerMocks from "./mocks.routes.js";
import routerLogger from "./logger.routes.js";

const routerIndex = Router();

routerIndex.use('/api/products', routerProduts);
routerIndex.use('/api/carts', routerCarts);
routerIndex.use('/api/auth', routerAuth);
routerIndex.use('/api/mails', routerMail);
routerIndex.use('/api/mocks', routerMocks)
routerIndex.use('/api/loggers', routerLogger)

export default routerIndex