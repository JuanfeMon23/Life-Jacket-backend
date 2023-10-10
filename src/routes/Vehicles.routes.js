import { Router } from "express";
import { getVehicles, getVehicle, postVehicles, updateVehicle, statusVehicle, getSearchVehicle, deleteVehicle} from '../controllers/Vehicles.controller.js'

export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', getVehicles);

//GetOne and OtherInformation
VehiclesRoutes.get('/Vehicles/:idVehicle', getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', postVehicles);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', updateVehicle);

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', statusVehicle);

//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', getSearchVehicle)

//Delete
VehiclesRoutes.delete('/Vehicles/:idVehicle', deleteVehicle)