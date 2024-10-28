import { Sequelize } from 'sequelize-typescript';

export const DataBaseProvider = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432, //
                username: 'postgres',
                password: 'root',
                database: 'nest',
            });
            sequelize.addModels([]);
            await sequelize.sync();
            return sequelize;
        },
    },
];