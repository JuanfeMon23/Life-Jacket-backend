import { DataTypes } from "sequelize";
import  { sequelize } from "../database/database.js";
import { Sale } from "./Sales.model.js";
import { Vehicle } from "./Vehicles.model.js";

export const SaleDetail = sequelize.define('saledetails', {
    idSaleDetail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

Sale.belongsToMany(Vehicle, {through : 'SaleDetails'});
Vehicle.belongsToMany(Sale, {through : 'SaleDetails'}); 