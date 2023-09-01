import { othervehicleinformation } from "../models/Othervehicleinformations.model.js";
import app from '../app.js'


//GET
export const getOthers = async (req, res) => {
    try {
        const other = await othervehicleinformation.findAll();
        res.json(other)
    } catch (error) {
        return res.Status(500).json({message : error.message})
    }
};

//CREATE
export const postOthers = async (req, res) => {
    try {
        const {business, series, color, motor, register, chassis, capacity, service, identificationCard, idVehicleOtherVehicleInformation} = req.body
        const newOther = await othervehicleinformation.create({
            business,
            series,
            color,
            motor,
            register,
            chassis,
            capacity,
            service,
            identificationCard,
            idVehicleOtherVehicleInformation
        });
        return res.status(200).json(newOther);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};


//UPDATE 
export const updateOther = async (req, res) => {
    const {idOtherVehicleInformation} = req.params;
    try {
        const {business, series, color, motor, register, chassis, capacity, service,
            identificationCard, idVehicleOtherVehicleInformation} = req.body
        
        const other = await othervehicleinformation.findByPk(idOtherVehicleInformation)
        other.business = business;
        other.series = series;
        other.color =  color;
        other.motor = motor;
        other.register = register;
        other.chassis = chassis;
        other.capacity = capacity;
        other.service = service;
        other.identificationCard = identificationCard;
        other.idVehicleOtherVehicleInformation = idVehicleOtherVehicleInformation;
        await other.save()
        res.json(other)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};

//GET ID
export const getVehicleId = async (req, res) => {
    try {
        const {idOtherVehicleInformation} = req.params;
        const other = await othervehicleinformation.findOne({
            where : { idOtherVehicleInformation }
        })
        res.json(other);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};
