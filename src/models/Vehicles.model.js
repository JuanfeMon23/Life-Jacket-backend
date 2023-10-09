import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Purchase } from "./Purchases.model.js";
import { Sale } from "./Sales.model.js";
import { Improvements } from "./Improvements.model.js";


export const Vehicle = sequelize.define('vehicles', {

    idVehicle : {

        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    },

    licensePlate : {
        type: DataTypes.STRING(7),
        unique: true,
        allowNull: false,
        validate : {
            notNull : {
                msg : 'Este campo es obligatorio'
            },

            noSpecialCharacters (value) {
                const specialCharacters = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                    throw new Error('Este campo no puede contener caracteres especiales')
                }
            }
        }
    },

    vehicleType : {
        type : DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            }, 

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener números')
                }
            },

            noSpecialCharacters (value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                    throw new Error('Este campo no puede contener caracteres especiales')
                }
            }
        }
    },

    brand : {
        type : DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            },

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener número')
                }
            },

            noSpecialCharacters (value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                    throw new Error('Este campo no puede contener caracteres especiales')
                }
            }
        }
    },

    model : {
        type : DataTypes.STRING(4),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            },

            isNumeric: {
                msg: 'Este campo debe contener solo números'
            },

            customValidation (value) {
                if (value.startsWith('0')) {
                    throw new Error('Este campo no puede empezar en 0')
                }
            },

            noSpecialCharacters (value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                    throw new Error('Este campo no puede contener caracteres especiales')
                }
            }
        }
    },

    type : {
        type : DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            },

            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener número')
                }
            }
        }
    },

    line : {
        type : DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            }
        }
    },

    mileage : {
        type : DataTypes.STRING(20),
        allowNull: true,
        validate : {
            isNumeric: {
                msg: 'Este campo debe contener solo números'
            }
        }
    },

    cylinderCapacity : {
        type : DataTypes.STRING(20),
        allowNull: true,
        validate : {
            isNumeric: {
                msg: 'Este campo debe contener solo números'
            },

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },

    fuel : {
        type : DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notEmpty : true,
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            },
            noNumbers(value) {
                if (/[0-9]/.test(value)) {
                    throw new Error('Este campo no puede contener números');
                } 
            }
        }
    },

    traction : {
        type : DataTypes.STRING(20),
        allowNull: true,
        validate : {
            notEmpty : true,

            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },

    soat : {
        type : DataTypes.DATE,
        allowNull: false
    },

    technomechanics : {
        type : DataTypes.DATE,
        allowNull: true
    },

    timingBelt : {
        type : DataTypes.STRING(20),
        allowNull: true
    },

    vehicleStatus : {
        type : DataTypes.BOOLEAN(4),
        defaultValue : true
    },
    
},
    {
        timestamps : false
    
})

//Purchase
Vehicle.hasOne(Purchase, {
    foreignKey : 'idVehiclePurchase',
    sourceKey : 'idVehicle'
})

Purchase.belongsTo(Vehicle, {
    foreignKey : 'idVehiclePurchase',
    targetId : 'idVehicle'
})

//Sale
Vehicle.hasOne(Sale, {
    foreignKey : 'idVehicleSale',
    sourceKey : 'idVehicle'
})

Sale.belongsTo(Vehicle, {
    foreignKey : 'idVehicleSale',
    targetId : 'idVehicle'
})

//Improvements
Vehicle.hasMany(Improvements, {
    foreignKey : 'idVehicleImprovement',
    sourceKey : 'idVehicle'
})

Improvements.belongsTo(Vehicle, {
    foreignKey : 'idVehicleImprovement',
    targetId : 'idVehicle'
})

