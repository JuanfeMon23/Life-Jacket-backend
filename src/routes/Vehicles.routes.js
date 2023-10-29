/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Vehicles and its different functions
 */

import { Router } from "express";
import { getVehicles, getVehicle, postVehicle, postOtherInformation, updateVehicleAndOther, statusVehicle, getSearchVehicle, deleteVehicle} from '../controllers/Vehicles.controller.js'

export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', getVehicles);

//GetOne and OtherInformation
VehiclesRoutes.get('/Vehicles/:idVehicle', getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', postVehicle);

//Create other information
VehiclesRoutes.post('/Vehicles/:idVehicle', postOtherInformation);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', updateVehicleAndOther);

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', statusVehicle);

//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', getSearchVehicle)

//Delete
VehiclesRoutes.delete('/Vehicles/:idVehicle', deleteVehicle)