import { Roles } from "../models/Roles.model.js";
import app from "../app.js";

export const createRol = async (req,res)  => {
    try {
        const {rolName} = req.body;
        const newRol = await Roles.create({
            rolName
        });
        return res.status(200).json(newRol);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const getRoles = async (req, res) => {
    try {
        const Rol = await Roles.findAll();
        return res.status(200).json(Rol);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message});

    }
    
};

export const getRol = async (req,res) => {
    try {
        const {idRol} = req.params;
        
        const rol = await Roles.findOne({
            where : {idRol}
        });
         res.status(200).json(rol);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message});
    }
};

export const updateRol = async (req,res) => {
    try {
        const {idRol} = req.params;
        const {rolName} = req.body;

        const rol = await Roles.findByPk(idRol);
        rol.rolName = rolName;
        await rol.save();
        return res.status(200).json(rol);
    } catch (error) {
        
    }
};

export const deleteRol = async (req,res) => {
    try {
        const {idRol} = req.params;
        await Roles.destroy({
            where : {idRol}
        });
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};