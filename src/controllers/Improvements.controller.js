import { Improvements } from '../models/Improvements.model.js'
import app from '../app.js'


// Get
export const getImprovements = async (req, res) => {
    try {
        const improvement = await Improvements.findAll();
        res.json(improvement);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

// Create
export const postImprovements = async (req, res) => {
    try {
        const {improvementDescription, improvementDate, improvementPrice, improvementStatus} = req.body
        const newImprovement = await Improvements.create({
            improvementDescription,
            improvementDate,
            improvementPrice,
            improvementStatus
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
        const {improvementDescription, improvementDate, improvementPrice} = req.body
        
        const improvement = await Improvements.findByPk(idImprovements)
        improvement.improvementDescription = improvementDescription
        improvement.improvementDate =  improvementDate
        improvement.improvementPrice = improvementPrice
        await improvement.save()
        res.json(improvement)

    } catch (error){
        return res.status(500).json({message : error.message})
    }
};