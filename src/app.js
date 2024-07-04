import express from 'express';
import MongoStore from "connect-mongo";
import cors from 'cors'
import routerIndex from './routes/index.routes.js';
import passport from 'passport';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import config from './config/command.dotenv.js'

import { initPassport } from './config/passport.js';
import { __dirname } from "./path.js"
import { addLogger, appLogger } from './config/loggers.js';
import MongoSingleton from './config/mongoDB.js';


const app = express();

app.use(cookieParser());

const corsOptions = {
    origin: 'https://clever-hamster-56e1b2.netlify.app',
    credentials: true,
};

app.options('*', cors(corsOptions));

//PUBLIC
app.use(express.static(__dirname + "/public"))

app.use(cors(corsOptions));

//SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(passport.session());
initPassport();
app.use(passport.initialize());

//Swagger Config

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación API E-commerce',
            description: 'Documentacion de E-commerce'
        }
    },
    apis: ['./src/docs/**/*.yaml']
}
const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(addLogger);

app.use(routerIndex);

async function connectMongo() {
    appLogger.info("Iniciando servicio para MongoDB");
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        appLogger.error("Error al iniciar MongoDB:", error);
        process.exit(1);
    }
}

let PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    appLogger.http(`Servidor iniciado en PUERTO: ${PORT}`);
    connectMongo()
});