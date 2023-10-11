import { Vehicle } from "../models/Vehicles.model.js";
import { Op } from 'sequelize';
import app from '../app.js'
import { Improvements } from "../models/Improvements.model.js";
// import { Sales } from "../controllers/"

// Get vehicles 
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            include : [
                {
                    model : Improvements
                }
            ]
        });
        res.json(vehicles);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};


// Get vehicle idVehicle
export const getVehicle = async (req, res) => {
    try {
        const {idVehicle} = req.params;
        const vehicle = await Vehicle.findOne({
            where : { idVehicle }
        })
        const object = {
            vehicle: vehicle
        }
        res.json(object);
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
};


// Create
export const postVehicles = async (req, res) => {
    try {
      const { licensePlate, vehicleType, brand, model, type, line, mileage, cylinderCapacity, fuel,
        traction, soat, technomechanics, timingBelt, vehicleStatus } = req.body;
  
      const newVehicle = await Vehicle.create({
        licensePlate,
        vehicleType,
        brand,
        model,
        type,
        line,
        mileage,
        cylinderCapacity,
        fuel,
        traction,
        soat,
        technomechanics,
        timingBelt,
        vehicleStatus
      });
  
      return res.status(200).json(newVehicle);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};


// Update 
export const updateVehicle = async (req, res) => {
    const {idVehicle} = req.params;
    try {
        const {vehicleType, brand, model, type, line, mileage, cylinderCapacity, fuel, traction, soat, technomechanics, timingBelt} = req.body
        
        const vehicle = await Vehicle.findByPk(idVehicle)

        if (vehicle.vehicleStatus === false) {
            return res.status(400).json({ message: 'No puedes editar este vehículo esta deshabilitado.' });
        }

        vehicle.vehicleType = vehicleType
        vehicle.brand =  brand
        vehicle.model = model
        vehicle.type = type
        vehicle.line = line
        vehicle.mileage = mileage
        vehicle.cylinderCapacity = cylinderCapacity
        vehicle.fuel = fuel
        vehicle.traction = traction
        vehicle.soat = soat
        vehicle.technomechanics = technomechanics
        vehicle.timingBelt = timingBelt
        await vehicle.save()
        res.json(vehicle)

    } catch (error){
        return res.status(500).json({message : error.message})
    }
};


// Disable 
export const statusVehicle = async (req, res) => {
    const { idVehicle } = req.params;
    try {
        const vehicle = await Vehicle.findByPk(idVehicle)

        // Disable the vehicle
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


//Search 
export const getSearchVehicle = async (req, res) => {
    const {search} = req.params;
    try {
        const vehicles = await Vehicle.findAll({
            where :{
                [Op.or]: [
                    {licensePlate : { [Op.like] : `%${search}`}}
                ],
            }
        });
        res.json(vehicles)
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Delete
export const deleteVehicle = async (req, res) => {
    const { idVehicle } = req.params;
    try {
        const vehicle = await Vehicle.findByPk(idVehicle)

        const saleCount = await vehicle.countSales();
        const purchaseCount = await vehicle.countPurchases();

        if (saleCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un vehiculo con una venta asociada"});
        }

        if (purchaseCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un vehiculo con una compra asociada"});
        }
        
        await vehicle.destroy();
        
        res.json(vehicle);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};