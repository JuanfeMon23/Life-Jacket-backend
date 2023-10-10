import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';

export const License = sequelize.define('License',{
    idLicense : {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    licenseName : {
        type: DataTypes.STRING(20),
        allowNull : false,
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
    }
},
{
    timestamps : false
}
);

