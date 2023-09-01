import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    'proyectop' ,
    'root' ,
    '' ,
{
    host : 'localhost',
    dialect : 'mysql'
})