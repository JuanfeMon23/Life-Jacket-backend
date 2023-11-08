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
        allowNull : false,
        unique : false
    },
    idVehicleExchange: {
        type: DataTypes.INTEGER(11),
        allowNull : false,
        unique : false
    },
    vehicleStatusExchange: {
        type: DataTypes.STRING(10),
        allowNull : false,
        defaultValue: "true"
    }
}, 
{
    timestamps : false
}
);

Exchange.belongsToMany(Vehicle, { 
  through: 'ExchangesDetails', 
  foreignKey: 'idExchangeVehicle', 
  as: 'vehiclesExchange',
  allowNull: false,
  unique: false,
  index: true
});

Vehicle.belongsToMany(Exchange, { 
  through: 'ExchangesDetails', 
  foreignKey: 'idVehicleExchange',
  allowNull: false,
  unique: false, 
  index: true 
});

