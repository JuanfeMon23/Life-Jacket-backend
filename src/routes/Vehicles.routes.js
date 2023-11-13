/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Vehicles and its different functions
 */

import { Router } from "express";
import { getVehicles, getVehicle, postVehicle, updateVehicleAndOther, statusVehicle, getSearchVehicle, deleteVehicle} from '../controllers/Vehicles.controller.js'
import { requiredToken } from '../middlewares/validatingToken.js';


export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', requiredToken,  getVehicles);

//GetOne and OtherInformation
VehiclesRoutes.get('/Vehicles/:idVehicle', requiredToken, getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', requiredToken, postVehicle);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', requiredToken, updateVehicleAndOther);

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', requiredToken, statusVehicle);
//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', requiredToken, getSearchVehicle)

//Delete
VehiclesRoutes.delete('/Vehicles/:idVehicle', requiredToken, deleteVehicle)