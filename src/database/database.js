import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    'pruebabuyer',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
)