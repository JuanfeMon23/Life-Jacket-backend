import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";


export const Improvements = sequelize.define('improvements', {

    idImprovements : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    improvementDescription : {
        type : DataTypes.STRING(40),
        allowNull : false,
        validate : {
            notNull : {
                msg : 'Este campo es obligatorio'
            }
        }
    },

    improvementDate : {
        type : DataTypes.DATE,
        allowNull : false
    },

    improvementPrice : {
        type : DataTypes.INTEGER(9),
        allowNull : false,
        validate : {
            notNull : {
                msg : 'Este campo es obligatorio'
            }, 

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }, 

            len: {
                args: [5, 9],
                msg: 'Este campo debe tener entre 5 y 9 números ',
            }, 

            isNumeric : {
                msg : 'Este campo debe contener solo números'
            },

            customValidation(value) {
                const integerValue = parseInt(value, 10); // Convierte el valor en un entero
                if (isNaN(integerValue) || integerValue.toString() !== value.toString() || integerValue.toString().startsWith('0')) {
                    throw new Error('Este campo debe ser un número entero que no comience en 0');
                }
            }
            
        }
    },

    improvementStatus : {
        type : DataTypes.BOOLEAN(1),
        defaultValue: true
    },
},
    {
        timestamps : false 
})