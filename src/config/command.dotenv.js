import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('--persist <mode>', 'Modo de persistencia', "fileSystem")
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

const environment = program.opts().mode;

if (environment == "prod") {
    dotenv.config({
        path: "./src/.env.prod"
    })
}else if(environment == 'dev'){
    dotenv.config({
        path: "./src/.env.dev"
    })
}else{
    dotenv.config({
        path: "./src/.env.test"
    })
}


export default {
    mode: program.opts().mode,
    port: process.env.PORT,
    mongoUrl: process.env.DB_URL,
    persistence: program.opts().persist,
};