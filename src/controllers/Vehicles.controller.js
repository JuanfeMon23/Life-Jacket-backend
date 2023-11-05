/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application vehicles which are: 
 * create, view, edit, disable, delete and search. Uses Express.js and Sequelize to interact with the database
 */

import { Vehicle } from "../models/Vehicles.model.js";
import { Op , Sequelize  } from 'sequelize';
import app from '../app.js'
import { Improvements } from "../models/Improvements.model.js";
import { othervehicleinformation } from "../models/Othervehicleinformations.model.js";
import { Purchase } from "../models/Purchases.model.js";
import { Sale } from "../models/Sales.model.js";
import { Exchange } from "../models/Exchanges.model.js";

//Function to get vehicles the list of vehicles
export const getVehicles = async (req, res) => {
    try {
        
        //Query the database to get the list of vehicles
        const vehicles = await Vehicle.findAll({
            include : [
                {
                    model : Improvements
                },
                {
                    model : othervehicleinformation
                },
                {
                    model : Purchase
                },
                {
                    model : Sale
                },
                {
                    model : Exchange
                }
            ],
        });
        
        res.json(vehicles);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};


//Function to get a vehicle by their ID
export const getVehicle = async (req, res) => {
    try {
        const {idVehicle} = req.params;

        //Query the database to obtain a vehicle by its ID
        const vehicle = await Vehicle.findOne({
            where : { idVehicle },
            include : [
                {
                    model : Improvements
                },
                {
                    model : othervehicleinformation
                },
                {
                    model : Purchase
                },
                {
                    model : Sale
                },
                {
                    model : Exchange
                }
            ]
        })

        res.json(vehicle);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};


// Function to create a new vehicle and related information in the database
export const postVehicle = async (req, res) => {
    try {
        // Extract data from the request body to create a vehicle
        const {
            idVehicle, licensePlate, vehicleType, brand, model, type, line, color, mileage, cylinderCapacity,
            fuel, traction, soat, technomechanics, timingBelt, business, series,
            motor, register, chassis, capacity, service, identificationCard
        } = req.body;

        // Create a new vehicle and store its ID in a variable
        const newVehicle = await Vehicle.create({
            idVehicle,
            licensePlate,
            vehicleType,
            brand,
            model,
            type,
            line,
            color,
            mileage,
            cylinderCapacity,
            fuel,
            traction,
            soat,
            technomechanics,
            timingBelt 
        });

        // Get the generated idVehicle
        const generatedIdVehicle = newVehicle.idVehicle;

        // Create the other related information using the generated idVehicle
        const newOther = await othervehicleinformation.create({
            business,
            series,
            motor,      
            register,
            chassis,
            capacity,
            service,
            identificationCard,
            idVehicleOtherVehicleInformation: generatedIdVehicle
        });

        // Return a response with the new vehicle and other related information
        return res.status(200).json({ newVehicle, newOther });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



// Function to update a vehicle or other related information
export const updateVehicleAndOther = async (req, res) => {
    try {
        // Extract the vehicle or other information ID from the request parameters
        const { idVehicle } = req.params;

        // If a vehicle ID is provided, update the vehicle
        if (idVehicle) {
            const {
                vehicleType, brand, model, type, line, color, mileage, cylinderCapacity, fuel,
                traction, soat, technomechanics, timingBelt
            } = req.body;

            // Find the vehicle by its ID
            const vehicle = await Vehicle.findByPk(idVehicle);

            if (!vehicle) {
                return res.status(404).json({ message: 'Vehículo no encontrado' });
            }

            if (vehicle.vehicleStatus === false) {
                return res.status(400).json({ message: 'No puedes editar este vehículo; está deshabilitado.' });
            }

            vehicle.vehicleType = vehicleType;
            vehicle.brand = brand;
            vehicle.model = model;
            vehicle.type = type;
            vehicle.line = line;
            vehicle.color = color;
            vehicle.mileage = mileage;
            vehicle.cylinderCapacity = cylinderCapacity;
            vehicle.fuel = fuel;
            vehicle.traction = traction;
            vehicle.soat = soat;
            vehicle.technomechanics = technomechanics;
            vehicle.timingBelt = timingBelt;
            
            await vehicle.save();
            return res.json(vehicle);
        }
        
        // If an ID for other related information is provided, update the other information
        if (idVehicle) {
            const {
                business, series, motor, register, chassis, capacity, service, identificationCard
            } = req.body;

            // Find the other related information by its ID
            const other = await othervehicleinformation.findByPk({ where: { idVehicleOtherVehicleInformation: idVehicle } });

            if (!other) {
                return res.status(404).json({ message: 'Related information not found' });
            }

            other.business = business;
            other.series = series;
            other.motor = motor;
            other.register = register;
            other.chassis = chassis;
            other.capacity = capacity;
            other.service = service;
            other.identificationCard = identificationCard;
            await other.save();
            return res.json(other);
        }

        // If neither a vehicle ID nor an ID for other related information is provided, return an error
        return res.status(400).json({ message: 'A vehicle ID or other related information ID must be provided' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



//Function to change the status (enabled/disabled) of a vehicle
export const statusVehicle = async (req, res) => {
    const { idVehicle } = req.params;
    try {
        const vehicle = await Vehicle.findByPk(idVehicle)

        //Change of vehicle status and saving in the database
        vehicle.vehicleStatus = !vehicle.vehicleStatus;        
        await vehicle.save();

        // If the vehicle is disabled, we disable the associated improvements
        if (!vehicle.vehicleStatus) {
            const improvements = await Improvements.findAll({ where: { idVehicleImprovement: idVehicle } });
            for (let Improvements of improvements) {
                Improvements.improvementStatus = false;
                await Improvements.save();
            }
        }
        else { // If the vehicle is enabled, we enable the associated improvements
            const improvements = await Improvements.findAll({ where: { idVehicleImprovement: idVehicle } });
            for (let Improvements of improvements) {
                Improvements.improvementStatus = true;
                await Improvements.save();
            }
        }

        res.json(vehicle);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};



//Function to delete a vehicle if they have no associated sales, purchases or exchanges
export const deleteVehicle = async (req, res) => {
    const { idVehicle } = req.params;
    try {
        const vehicle = await Vehicle.findByPk(idVehicle)

        const vehicleOther = await othervehicleinformation.findByPk({where: {idVehicleOtherVehicleInformation : idVehicle}});

        // Count the number of sales, purchases and exchanges associated with the vehicle
        const saleCount = await vehicle.countSales();
        const purchaseCount = await vehicle.countPurchases();
        const exchangeCount = await vehicle.countExchanges();

        //Check if the vehicle has associated sales, purchases and exchanges and prevent deletion
        if (saleCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un vehiculo con ventas asociadas"});
        }
        if (purchaseCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un vehiculo con compras asociadas"});
        }
        if (exchangeCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un vehiculo con intercambios asociados"});
        }
        
        await vehicle.destroy();
        await vehicleOther.destroy();
        
        res.json(vehicle);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to search for vehicles based on various attributes (LicensePlate, Brand, Color) 
export const getSearchVehicle = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
        const vehicles = await Vehicle.findAll({
            where :{
                [Op.or]: [
                    {licensePlate : { [Op.like] : `%${search}`}},
                    {brand : { [Op.like] : `%${search}`}},
                    {color : { [Op.like] : `%${search}`}}
                ],
            }
        });
        res.json(vehicles)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};