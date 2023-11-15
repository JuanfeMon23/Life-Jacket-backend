/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Improvements and its different functions
 */

import { Router } from "express";
import { getImprovements, postImprovements, updateImprovements, getSearchImprovements, deleteImprovements } from "../controllers/Improvements.controller.js";
import { requiredToken } from '../middlewares/validatingToken.js';
export const ImprovementsRoutes = Router();

ImprovementsRoutes.get('/Improvements', requiredToken , getImprovements);
ImprovementsRoutes.post('/Improvements', requiredToken , postImprovements);
ImprovementsRoutes.put('/Improvements/:idImprovements', requiredToken , updateImprovements);
ImprovementsRoutes.get('/Improvements/Search/:search', requiredToken , getSearchImprovements);
ImprovementsRoutes.delete('/Improvements/:idImprovements', requiredToken , deleteImprovements);
