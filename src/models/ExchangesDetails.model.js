import { DataTypes} from 'sequelize';
import { sequelize } from '../database/database.js';
import { Exchange } from './Exchanges.model.js';
import { Vehicle } from './Vehicles.model.js';

export const ExchangesDetails = sequelize.define('exchangesdetails',{
    idExchangeDetail: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    idExchangeVehicle: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    idVehicleExchange: {
        type: DataTypes.INTEGER,
        allowNull : false
    }
}, 
{
    timestamps : false
}
)

Exchange.belongsToMany(Vehicle, {through : 'ExchangeDetails', foreignKey: 'idExchangeVehicle', as: 'vehiclesExchange'});
Vehicle.belongsToMany(Exchange, {through : 'ExchangeDetails', foreignKey: 'idVehicleExchange' });
