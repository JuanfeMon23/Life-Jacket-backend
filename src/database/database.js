import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    'lifejacket' ,
    'root' ,
    '',
{
    host : 'localhost',
    dialect : 'mysql'
})

