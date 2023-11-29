import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Departments = sequelize.define('Department',{
    idDepartment : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true
    },
    Department : {
        type : DataTypes.STRING(20),
        allowNull: false
    },
    Municipe : {
        type : DataTypes.STRING(20),
        allowNull: false
    }
})