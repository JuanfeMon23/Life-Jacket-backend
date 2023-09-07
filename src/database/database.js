import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    'life-jacket' ,
    'root' ,
    '',
{
    host : 'localhost',
    dialect : 'mysql'
})

