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
import { User } from "../models/Users.model.js";
import app from "../app.js";

//Function add a new rol in the database
export const createRol = async (req,res)  => {
    try {
        const {rolName} = req.body;

        //Function to create a new rol

        const foundName = await Roles.findOne({where : {rolName}});
        if(foundName) return res.status(400).json({message : 'Nombre ya registrado'})

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
        if(foundName) return res.status(400).json({message : 'Nombre ya registrado'})

        // Search for the rol by their ID
        const rol = await Roles.findByPk(idRol);

        rol.rolName = rolName;

        await rol.save();
        return res.status(200).json(rol);
    } catch (error) {
        
    }
};

// Function to change the status (enabled/disabled) of a rol
export const statusRol = async (req, res) => {
    const { idRol } = req.params;
    try {
        const role = await Roles.findByPk(idRol);

        console.log(req)

        const userReq = req.User.Role.rolName;

        if(role.rolName === userReq){
            return res.status(400).json({ message: 'No puedes cambiar el estado de tu rol' });
        }

        if (role.rolName === "Administrador") {
            return res.status(400).json({ message: 'El rol de administrador no se puede deshabilitar' });
        }

        // Change of client status and saving in the database
        if (role.rolStatus === "true") {
            role.rolStatus = "false";
        } else if (role.rolStatus === "false") {
            role.rolStatus = "true";
        }

        await role.save();

        // Update the status of associated users based on the status of the role
        const users = await User.findAll({
            where: {
                idRolUser: idRol
            }
        });

        for (let user of users) {
            user.userStatus = role.rolStatus;
            await user.save();
        }

        res.json(role);

    } catch (error) {
        return res.status(500).json({ message: error.message });
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
        
        if (rol.rolName === "Administrador" || rol.rolName === "administrador" ){
            return res.status(400).json({ message :"No se puede eliminar el rol de administrador"});
        }
        
        if (userCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un rol con usuarios asociados"});
        }
        await rol.destroy();

        return res.status(200).json({ message: 'Rol eliminado con éxito!' });
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