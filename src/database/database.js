import { Sequelize } from "sequelize";

export const sequelize = new Sequelize( 
    'life_jacket' ,
    'root' ,
    '',
{
    host : 'localhost',
    dialect : 'mysql'
})

