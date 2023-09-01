import { License } from "../models/Licenses.model.js";
import app from "../app.js";

export const createLicense = async (req,res) => {
    try {
        const {licenseName} = req.body;
        const newLicense = await License.create({licenseName});
        return res.status(200).json(newLicense);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const getLicense = async (req,res) => {
    try {
        const {idLicense} = req.params;

        const license = await License.findOne({
            where : {idLicense}
        });
        res.json(license);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message : error.message});
    }
};

export const getLicenses = async (req,res) => {
    try {
        const license = await License.findAll();
        return res.status(200).json(license);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const updateLicense = async (req,res) => {
    try {
        const {idLicense} = req.params;
        const {licenseName} = req.body;
        const license = await License.findByPk(idLicense);
        license.licenseName = licenseName;
        await license.save();
        return res.status(200).json(License);
    } catch (error) {
        
    }
};

export const deleteLicense = async (req,res) => {
    try {
        const {idLicense} = req.params;
        await License.destroy({where : idLicense})
        return res.status(200)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};