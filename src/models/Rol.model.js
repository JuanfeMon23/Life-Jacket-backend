import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';

export const Rol = sequelize.define('Rol', {
    idRol : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rolName : {
        type:  DataTypes.STRING,
        validate : {
            notEmpty :  true
        }
    }
})

