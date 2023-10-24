import { Router } from "express";
import { getVehicles, getVehicle, postVehiclesAndOthers, updateVehicleAndOther, statusVehicle, getSearchVehicle, deleteVehicle} from '../controllers/Vehicles.controller.js'

export const VehiclesRoutes = Router();

//Get 
VehiclesRoutes.get('/Vehicles', getVehicles);

//GetOne and OtherInformation
VehiclesRoutes.get('/Vehicles/:idVehicle', getVehicle);

//Create
VehiclesRoutes.post('/Vehicles', postVehiclesAndOthers);

//Update
VehiclesRoutes.put('/Vehicles/:idVehicle', updateVehicleAndOther);

//Disable
VehiclesRoutes.patch('/Vehicles/:idVehicle', statusVehicle);

//Get Search
VehiclesRoutes.get('/Vehicles/SearchE/:search', getSearchVehicle)

//Delete
VehiclesRoutes.delete('/Vehicles/:idVehicle', deleteVehicle)