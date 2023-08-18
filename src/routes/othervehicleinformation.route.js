import { Router } from "express";
import { getOthers, postOthers, updateOther, getVehicleId} from '../controllers/othervehicleinformation.controller.js'

export const OtherRoutes = Router();


OtherRoutes.get('/Others', getOthers);

OtherRoutes.post('/Others', postOthers);

OtherRoutes.put('/Others/:idOtherVehicleInformation', updateOther);

OtherRoutes.get('/Others/:idOtherVehicleInformation', getVehicleId);