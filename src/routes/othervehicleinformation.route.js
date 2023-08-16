import { Router } from "express";
import { getOthers, postOthers, updateOther} from '../controllers/othervehicleinformation.controller.js'

export const OtherRoutes = Router();


OtherRoutes.get('/Others', getOthers);

OtherRoutes.post('/Others', postOthers);

OtherRoutes.put('/Others/:idOtherVehicleInformation', updateOther);

// I have doubts about whether I have to make routes