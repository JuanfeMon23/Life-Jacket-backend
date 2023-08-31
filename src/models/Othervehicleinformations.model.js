import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const othervehicleinformation = sequelize.define('othervehicleinformation', {

    idOtherVehicleInformation : {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    business : {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate : {
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }, 

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener número')
                }
            }
        }
    },

    series : {
        type: DataTypes.STRING(17),
        allowNull: true,
        validate : {
            isAlphanumeric: true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            },

            len: {
                args: [7, 17],
                msg: 'Este campo debe tener entre 7 y 17 caracteres',
            },
        }
    },

    color : {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate : {
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }, 

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener números')
                }
            }
        }
    },

    motor : {
        type: DataTypes.STRING(12),
        allowNull: true,
        validate : {
            isAlphanumeric: true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            },

            len: {
                args: [7, 12],
                msg: 'Este campo debe tener entre 7 y 12 caracteres',
            }
        }
    },

    register : {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate : {
            isAlphanumeric: true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },

    chassis : {
        type: DataTypes.STRING(18),
        allowNull: true,
        validate : {
            isAlphanumeric: true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }, 

            len: {
                args: [7, 18],
                msg: 'Este campo debe tener entre 7 y 18 caracteres',
            }
        }
    },

    capacity : {
        type: DataTypes.INTEGER(2),
        allowNull: true,
        validate : {
            isNumeric: true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            },

            len: {
                args: [1, 2],
                msg: 'Este campo debe tener entre 1 y 2 números',
            }
        }
    },

    service : {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate : {
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }, 

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener números')
                }
            }
        }
    },

    identificationCard : {
        type: DataTypes.STRING(12),
        allowNull: true,
        validate: {
            isNumeric: {
                msg: 'Este campo debe contener solo números',
            },

            len: {
                args: [6, 12],
                msg: 'Este campo debe tener entre 6 y 12 números',
            },

            customValidation(value) {
                if (value.startsWith('0')) {
                  throw new Error('Este campo no puede empezar en 0');
                }
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

})