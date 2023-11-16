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
import { hasLicenses } from "../middlewares/Licenses.js";


export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', requiredToken, hasLicenses(['Vehiculos']) ,  getVehicles);

//GetOne and OtherInformation
VehiclesRoutes.get('/Vehicles/:idVehicle', requiredToken, hasLicenses(['Vehiculos']) ,  getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', requiredToken, hasLicenses(['Vehiculos']) , postVehicle);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', requiredToken, hasLicenses(['Vehiculos']) , updateVehicleAndOther); 

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', requiredToken, hasLicenses(['Vehiculos']) , statusVehicle);
//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', requiredToken, hasLicenses(['Vehiculos']) , getSearchVehicle)

//Delete
VehiclesRoutes.delete('/Vehicles/:idVehicle', requiredToken, hasLicenses(['Vehiculos']) , deleteVehicle)