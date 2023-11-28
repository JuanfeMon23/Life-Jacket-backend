import { Sequelize } from "sequelize";
import dotenv from 'dotenv'

dotenv.config();
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST

export const sequelize = new Sequelize(
    DATABASE ,
    DB_USER || 'root' ,
    DB_PASSWORD ||'',
{
    host : DB_HOST || 'localhost',
    dialect : 'mysql'
})

