import { Sequelize } from 'sequelize-typescript';
import {User} from "../users/users.model";
import * as process from "node:process";

export const DataBaseProvider = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
            });
            sequelize.addModels([User]);
            await sequelize.sync();
            //await sequelize.sync({ force: true });
            return sequelize;
        },
    },
];
