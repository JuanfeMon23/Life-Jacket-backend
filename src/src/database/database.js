import { Sequelize } from "sequelize";

export const sequelize = new Sequelize( 
    'pruebas' ,
    'root' ,
    '',
{
    host : 'localhost',
    dialect : 'mysql'
})

