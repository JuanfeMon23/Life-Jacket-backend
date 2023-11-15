/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application vehicles which are: create, view, edit, disable, delete and search. Uses Express.js and Sequelize to interact with the database
 */

import { Improvements } from '../models/Improvements.model.js'
import { Op } from 'sequelize';
import app from '../app.js'
import { Vehicle } from "../models/Vehicles.model.js";

// Function to get improvements the list of improvements
export const getImprovements = async (req, res) => {
    try {

        //Query the database to get the list of improvements
        const improvement = await Improvements.findAll({include : {model : Vehicle}});
        res.json(improvement);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

// Function to create a new improvement in the database
export const postImprovements = async (req, res) => {
    try {
        // Extract data from the request body to create a improvement
        const {improvementDescription, improvementDate, improvementPrice, idVehicleImprovement} = req.body

        const newImprovement = await Improvements.create({
            improvementDescription,
            improvementDate,
            improvementPrice,
            idVehicleImprovement
        });
        return res.status(200).json(newImprovement);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

// Function to update a improvement
export const updateImprovements = async (req, res) => {
    const {idImprovements} = req.params;
    try {
        // Extract the improvement ID from the request parameters
        const {improvementDescription, improvementDate, improvementPrice} = req.body
        
        // Find the vehicle by its ID
        const improvement = await Improvements.findByPk(idImprovements)

        // If the improvement is disable it cannot be edited 
        if(improvement.improvementStatus === "false") {
            return res.status(400).json({ message: 'No puedes editar esta mejora porque se encuentra deshabilitada' });
        }

        improvement.improvementDescription = improvementDescription
        improvement.improvementDate =  improvementDate
        improvement.improvementPrice = improvementPrice
        await improvement.save()
        res.json(improvement)

    } catch (error){
        return res.status(500).json({message : error.message})
    }
};


//Function to search for vehicles based on various attributes (LicensePlate, Date) 
export const getSearchImprovements = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
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

export const deleteImprovements = async (req, res) => {
    const {idImprovements} = req.params;
    try {
        const improvement = await Improvements.findByPk(idImprovements);
        console.log(improvement)
        await improvement.destroy();

        return res.sendStatus(204);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : error.message});
    }
};