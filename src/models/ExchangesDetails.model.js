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
        allowNull : false
    },
    vehicleStatusExchange: {
        type: DataTypes.STRING(11),
        allowNull : false
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