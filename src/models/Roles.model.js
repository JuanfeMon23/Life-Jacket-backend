/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of rol and its different fields with validations
 */

import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { User } from './Users.model.js';

export const Roles = sequelize.define('Roles', {
    idRol : {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    rolName : {
        type:  DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio',
            },
            len: {
                args: [1, 20],
                msg: 'Este campo debe tener entre 1 y 20 letras',
            },
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },
        rolStatus : {
            type: DataTypes.STRING(),
            allowNull : false,
            defaultValue : "true"
        }
    
},
{
    timestamps : false
}
);





