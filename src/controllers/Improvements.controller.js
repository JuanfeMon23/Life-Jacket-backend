import { Improvements } from '../models/Improvements.model.js'
import { Op } from 'sequelize';
import app from '../app.js'
import { Vehicle } from "../models/Vehicles.model.js";

// Get
export const getImprovements = async (req, res) => {
    try {
        const improvement = await Improvements.findAll({include : {model : Vehicle}});
        res.json(improvement);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

// Create
export const postImprovements = async (req, res) => {
    try {
        const {improvementDescription, improvementDate, improvementPrice, improvementStatus, idVehicleImprovement} = req.body
        const newImprovement = await Improvements.create({
            improvementDescription,
            improvementDate,
            improvementPrice,
            improvementStatus,
            idVehicleImprovement
        });
        return res.status(200).json(newImprovement);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

// Update 
export const updateImprovements = async (req, res) => {
    const {idImprovements} = req.params;
    try {
        const {improvementDescription, improvementDate, improvementPrice, idVehicleImprovement} = req.body
        
        const improvement = await Improvements.findByPk(idImprovements)
        improvement.improvementDescription = improvementDescription
        improvement.improvementDate =  improvementDate
        improvement.improvementPrice = improvementPrice
        improvement.idVehicleImprovement = idVehicleImprovement
        await improvement.save()
        res.json(improvement)

    } catch (error){
        return res.status(500).json({message : error.message})
    }
};

// Disable 
export const statusImprovement = async (req, res) => {
    const { idImprovements } = req.params;
    try {
        const improvement = await Improvements.findByPk(idImprovements)
        improvement.improvementStatus = !improvement.improvementStatus;        
        await improvement.save();
        res.json(improvement);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


//Search 
export const getSearchImprovements = async (req, res) => {
    const {search} = req.params;
    try {
        const improvements = await Improvements.findAll({
            include: [
                {
                    model: Vehicle
                }
            ],
            where :{
                [Op.or]: [
                    {'$Vehicle.licensePlate$' : { [Op.like] : `%${search}`}},
                    { improvementDate : { [Op.like] : `%${search}`}}
                ],
            }
        });
        res.json(improvements)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};