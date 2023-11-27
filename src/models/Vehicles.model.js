/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of vehicles and its different fields with validations
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Purchase } from "./Purchases.model.js";
import { Sale } from "./Sales.model.js";
import { Improvements } from "./Improvements.model.js";
import { othervehicleinformation } from "./Othervehicleinformations.model.js";
import { Op } from 'sequelize';


export const Vehicle = sequelize.define('vehicles', {

    idVehicle : {

        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    },

    licensePlate : {
        type: DataTypes.STRING(7),
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

    color : {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate : {
            notNull: {
                msg: 'Este campo es obligatorio'
            },

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

    mileage : {
        type : DataTypes.STRING(20),
        allowNull: true,
        validate : {
            noSpecialCharacters(value) {
                const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (specialCharacters.test(value)) {
                  throw new Error('Este campo no puede contener caracteres especiales');
                }
            }
        }
    },

    cylinderCapacity : {
        type : DataTypes.STRING(20),
        allowNull: true,
        validate : {
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
        allowNull: true,
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
        type : DataTypes.DATEONLY,
        allowNull: true
    },

    technomechanics : {
        type : DataTypes.DATEONLY,
        allowNull: true
    },

    timingBelt : {
        type : DataTypes.STRING(20),
        allowNull: true
    },
    vehicleStatus : {
        type: DataTypes.STRING(10),
        allowNull : false,
        defaultValue: "true"
    }  
},
    {
        timestamps : false
    }
)

//Purchase
Vehicle.hasOne(Purchase, {
    foreignKey : 'idVehiclePurchase',
    sourceKey : 'idVehicle',
    allowNull : false
})

Purchase.belongsTo(Vehicle, {
    foreignKey : 'idVehiclePurchase',
    targetId : 'idVehicle',
})

//Sale
Vehicle.hasOne(Sale, {
    foreignKey : 'idVehicleSale',
    sourceKey : 'idVehicle',
    allowNull : false
})

Sale.belongsTo(Vehicle, {
    foreignKey : 'idVehicleSale',
    targetId : 'idVehicle'
})

//Improvements
Vehicle.hasMany(Improvements, {
    foreignKey : 'idVehicleImprovement',
    sourceKey : 'idVehicle',
    allowNull : false
})

Improvements.belongsTo(Vehicle, {
    foreignKey : 'idVehicleImprovement',
    targetId : 'idVehicle',
})

//OtherInformationVehicle
Vehicle.hasOne(othervehicleinformation, {
    foreignKey : 'idVehicleOtherVehicleInformation',
    sourceKey : 'idVehicle',
    allowNull : false
})

othervehicleinformation.belongsTo(Vehicle, {
    foreignKey : 'idVehicleOtherVehicleInformation',
    targetId : 'idVehicle'
})
