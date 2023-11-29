/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application licenses which are: 
 * create, view and delete. Uses Express.js and Sequelize to interact with the database
 */

import { License } from "../models/Licenses.model.js";
import app from "../app.js";

//Function add a new license in the database
export const createLicense = async (req,res) => {
    try {
        const {licenseName} = req.body;

        //Function to create a new license
        const newLicense = await License.create(
            {licenseName
        });

        return res.status(200).json(newLicense);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to get a license by their ID
export const getLicense = async (req,res) => {
    try {
        const {idLicense} = req.params;

        //Query the database to obtain a license by its ID
        const license = await License.findOne({
            where : {idLicense}
        });
        res.json(license);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message : error.message});
    }
};

//Function to get the list of licenses
export const getLicenses = async (req,res) => {
    try {
        //Query the database to get the list of licenses
        const license = await License.findAll();
        return res.status(200).json(license);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a license if they have no associated to roles
export const deleteLicense = async (req,res) => {
    try {
        const {idLicense} = req.params;
        const license = await License.findByPk(idLicense);
        
        await license.destroy();
        return res.status(200)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};