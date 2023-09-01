import { Router } from "express";
import { getImprovements, postImprovements, updateImprovements } from "../controllers/Improvements.controller.js";

export const ImprovementsRoute = Router();

//Get
ImprovementsRoute.get('/Improvements', getImprovements)

//Create
ImprovementsRoute.post('/Improvements', postImprovements)

//Update
ImprovementsRoute.put('/Improvements/:idImprovements', updateImprovements)