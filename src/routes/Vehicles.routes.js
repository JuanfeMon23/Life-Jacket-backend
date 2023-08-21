import { Router } from "express";
import { getVehicles, getVehicle, postVehicles, updateVehicle, statusVehicle, getSearchVehicle, getVehicleOther} from '../controllers/Vehicles.controller.js'

export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', getVehicles);

//GetOne
VehiclesRoutes.get('/Vehicles/:idVehicle', getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', postVehicles);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', updateVehicle);

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', statusVehicle);

//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', getSearchVehicle)

//Get Other Vehicle information
VehiclesRoutes.get('/Vehicles/:idVehicle/other', getVehicleOther)