/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains model of exchange detail and its different fields with validations
 */

import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Exchange } from './Exchanges.model.js';
import { Vehicle } from './Vehicles.model.js';

export const ExchangesDetails = sequelize.define('ExchangesDetails',{
    idExchangeDetail: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    idExchangeVehicle: {
        type: DataTypes.INTEGER(11),
        allowNull : false
    },
    idVehicleExchange: {
        type: DataTypes.INTEGER(11),
        allowNull : false
    },
    vehicleSubtotal: {
        type: DataTypes.INTEGER(11),
        allowNull : false
    },
    exchangeFinalPrice: {
        type: DataTypes.INTEGER(11),
        allowNull : false,
        validate: {
            notNull: {
              msg: 'Este campo es obligatorio',
            },
            isNumeric: {
              msg: 'Este campo debe contener solo números',
            },
            len: {
              msg: 'Este campo debe tener entre 5 y 11 números',
            },
            customValidation(value) {
              const integerValue = parseInt(value, 10); // Convierte el valor en un entero
              if (isNaN(integerValue) || integerValue.toString() !== value.toString() || integerValue.toString().startsWith('0')) {
                  throw new Error('Este campo debe ser un número entero que no comience en 0');
              }
            },
            noSpecialCharacters(value) {
              const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
              if (specialCharacters.test(value)) {
                throw new Error('Este campo no puede contener caracteres especiales');
              }
            }
        }
    },
    vehicleStatusExchange: {
        type: DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : true
    }
}, 
{
    timestamps : false
}
);

Vehicle.belongsToMany(Exchange, { 
    through: 'ExchangesDetails', 
    foreignKey: 'idVehicleExchange',
    allowNull : false
});
Exchange.belongsToMany(Vehicle, { 
    through: 'ExchangesDetails', 
    foreignKey: 'idExchangeVehicle', 
    as: 'vehiclesExchange',
    allowNull : false
});

ExchangesDetails.belongsTo(Exchange, {
  foreignKey: 'idExchangeVehicle'
});

ExchangesDetails.belongsTo(Vehicle, {
  foreignKey: 'idVehicleExchange'
});