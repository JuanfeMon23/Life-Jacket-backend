import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const pictures = sequelize.define('pictures', {

    idPictures : {

        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },

    linkPicture : {
        type: DataTypes.STRING(30)
    },
}, 
    {
        timestamps : false

})