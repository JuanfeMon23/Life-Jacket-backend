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
import { ExchangesDetails } from "../models/ExchangesDetails.model.js";

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

        // Check if a vehicle with the same licensePlate already exists
        const existingVehicle = await Vehicle.findOne({
            where: {
                licensePlate: licensePlate
            }
        });

        // If a vehicle with the same licensePlate exists
        if (existingVehicle) {
            // Check if the existing vehicle is active (vehicleStatus is "true")
            if (existingVehicle.vehicleStatus === "true") {
                return res.status(400).json({ message: 'El vehículo con esta placa ya está registrado y activo' });
            }
            // If the existing vehicle is inactive, allow the creation of a new vehicle
        };

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
    const { idVehicle } = req.params;
    try {
        // Extract data from the request body to update a vehicle
        const {
            color, mileage, cylinderCapacity,
            fuel, traction, soat, technomechanics, timingBelt, business, series,
            motor, register, chassis, capacity, service, identificationCard
        } = req.body;


        // Find the vehicle by its ID
        const vehicle = await Vehicle.findByPk(idVehicle, {
            include : [
                {
                    model : othervehicleinformation
                }
            ],
        });
        if(vehicle.vehicleStatus === "false"){
            return res.status(400).json({ message : "No puedes editar un vehículo deshabilitado"});
        }

        vehicle.color = color;
        vehicle.mileage = mileage;
        vehicle.cylinderCapacity = cylinderCapacity;
        vehicle.fuel = fuel;
        vehicle.traction = traction;
        vehicle.soat = soat;
        vehicle.technomechanics = technomechanics;
        vehicle.timingBelt = timingBelt;
        vehicle.othervehicleinformation.business = business;

        vehicle.othervehicleinformation.series = series;
        vehicle.othervehicleinformation.motor = motor;
        vehicle.othervehicleinformation.register = register;
        vehicle.othervehicleinformation.chassis = chassis;
        vehicle.othervehicleinformation.capacity = capacity;
        vehicle.othervehicleinformation.service = service;
        vehicle.othervehicleinformation.identificationCard = identificationCard;

        await vehicle.save();    

        return res.status(200).json({ message: 'Vehículo actualizado con éxito!' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



//Function to change the status (enabled/disabled) of a vehicle
export const statusVehicle = async (req, res) => {
    const { idVehicle } = req.params;
    try {
        const vehicle = await Vehicle.findByPk(idVehicle,{
            include : [
                {
                    model : Improvements
                }
            ]
        });

        const sale = await Sale.findOne({ 
            where: { 
              idVehicleSale: idVehicle,
            },
            include: [{
              model: Vehicle,
              where: {
                vehicleStatus: "false"
              }
            }]
          });

        const exchanges = await ExchangesDetails.findAll({ 
            where: { 
                idVehicleExchange: idVehicle, 
                vehicleStatusExchange : "false" 
            }
        });

        // If trying to change from false to true, check if there is already an active vehicle with the same licensePlate
        if (vehicle.vehicleStatus === "false") {
            const activeVehicleWithSameLicensePlate = await Vehicle.findOne({
                where: {
                    licensePlate: vehicle.licensePlate,
                    vehicleStatus: "true"
                }
            });

            if (activeVehicleWithSameLicensePlate) {
                return res.status(400).json({ message: 'Ya hay un vehículo activo con la misma placa' });
            }
        }

        if (sale || exchanges.length > 0 ) {
            return res.status(400).json({ message: "No puedes activar un vehículo que se encuentra con una venta o intercambio asociado activo" });
        }

        //Change of vehicle status and saving in the database       
        if (vehicle.vehicleStatus === "true") {
            vehicle.vehicleStatus = "false";
        } else if (vehicle.vehicleStatus === "false") {
            vehicle.vehicleStatus = "true";
        }

        await vehicle.save();

        // If the vehicle is disabled, we disable the associated improvements
        if (vehicle.vehicleStatus === "false") {
            for (let Improvements of vehicle.improvements) {
                Improvements.improvementStatus = "false";
                await Improvements.save();
            }
        }
        else { // If the vehicle is enabled, we enable the associated improvements
            for (let Improvements of vehicle.improvements) {
                Improvements.improvementStatus = "true";
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

        const vehicleOther = await othervehicleinformation.findOne({where: {idVehicleOtherVehicleInformation : idVehicle}});

        // Check if the vehicle has associated sales
        const sale = await Sale.findOne({ where: { idVehicleSale: idVehicle } });

        // Check if the vehicle has associated purchases
        const purchase = await Purchase.findOne({ where: { idVehiclePurchase: idVehicle } });

        // Check if the vehicle has associated exchanges
        const exchanges = await ExchangesDetails.findAll({ where: { idVehicleExchange: idVehicle } });

        // Check if the vehicle has associated sales, purchases, or exchanges and prevent deletion
        if (sale || purchase || exchanges.length > 0) {
            return res.status(400).json({ message: "No se puede eliminar un vehículo con ventas, compras o intercambios asociados" });
        }
        
        await vehicle.destroy();
        await vehicleOther.destroy();
        
        return res.status(200).json({ message: 'Vehículo eliminado con éxito' });

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