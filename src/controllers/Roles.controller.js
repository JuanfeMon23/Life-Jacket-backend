/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application roles which are: 
 * create, view, disable and delete. Uses Express.js and Sequelize to interact with the database
 */

import { Roles } from "../models/Roles.model.js";
import { License } from "../models/Licenses.model.js";
import { LicensesRols } from "../models/LicensesRoles.model.js";
import app from "../app.js";

//Function add a new rol in the database
export const createRol = async (req,res)  => {
    try {
        const {rolName} = req.body;

        //Function to create a new rol

        const foundName = await Roles.findOne({where : {rolName}});
        if(foundName) return res.status(400).json({message : 'Nombre ya registrado.'})

        const newRol = await Roles.create({
            rolName
        });
        return res.status(200).json(newRol);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to get the list of roles
export const getRoles = async (req, res) => {
    try {
        //Query the database to get the list of roles
        const Rol = await Roles.findAll({include: { model : License}});
        return res.status(200).json(Rol);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message});

    }
    
};

//Function to get a rol by their ID
export const getRol = async (req,res) => {
    try {
        const {idRol} = req.params;
        
        //Query the database to obtain a rol by its ID
        const rol = await Roles.findOne({
            where : {
                idRol
            }
        });
         res.status(200).json(rol);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message});
    }
};

//Feature to update an existing rol's information
export const updateRol = async (req,res) => {
    try {
        const {idRol} = req.params;
        const {rolName} = req.body;

        const foundName = await Roles.findOne({where : {rolName}});
        if(foundName) return res.status(400).json({message : 'Nombre ya registrado.'})

        // Search for the rol by their ID
        const rol = await Roles.findByPk(idRol);

        rol.rolName = rolName;

        await rol.save();
        return res.status(200).json(rol);
    } catch (error) {
        
    }
};

//Function to delete a rol if they  have no associated users
export const deleteRol = async (req,res) => {
    const { idRol } = req.params;
    try {
        const rol = await Roles.findByPk(idRol)

        //Count the number of users associated with the user
        const userCount = await rol.countUsers();

        //Check if the rol has associated users and prevent deletion
        if (userCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un rol con usuarios asociados"});
        }

        if (rol.rolName === "Administrador" || "administrador" ){
            return res.status(400).json({ message :"No se puede eliminar el rol de administrador"});
        }

        await rol.destroy();

        return res.sendStatus(200).json({ message: 'Rol eliminado con éxito' });
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const addLicenses = async (req, res) => {
    const {idRol, idLicense} = req.params;
    try {
        const licenseRole = await LicensesRols.create({
            idLicenseDetail : idLicense,
            idRolDetail : idRol
        });

        return res.status(200).json(licenseRole);
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: error.message})
    }
};