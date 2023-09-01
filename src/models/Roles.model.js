import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { User } from './Users.model.js';

export const Roles = sequelize.define('Roles', {
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





