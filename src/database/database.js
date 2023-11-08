import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config();
const DATABASE = process.env.DATABASE;

export const sequelize = new Sequelize(
    DATABASE ,
    'root' ,
    '',
{
    host : 'localhost',
    dialect : 'mysql'
})

