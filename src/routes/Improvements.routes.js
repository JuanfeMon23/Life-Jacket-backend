import { Router } from "express";
import { getImprovements, postImprovements, updateImprovements, statusImprovement, getSearchImprovements } from "../controllers/Improvements.controller.js";

export const ImprovementsRoutes = Router();

ImprovementsRoutes.get('/Improvements', getImprovements);
ImprovementsRoutes.post('/Improvements', postImprovements);
ImprovementsRoutes.put('/Improvements/:idImprovements', updateImprovements);
ImprovementsRoutes.patch('/Improvements/:idImprovements', statusImprovement);
ImprovementsRoutes.get('/Improvements/Search/:search', getSearchImprovements);