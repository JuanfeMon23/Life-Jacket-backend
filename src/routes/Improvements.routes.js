/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Improvements and its different functions
 */

import { Router } from "express";
import { getImprovements, postImprovements, updateImprovements, deleteImprovements } from "../controllers/Improvements.controller.js";
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from "../middlewares/Licenses.js";
export const ImprovementsRoutes = Router();

ImprovementsRoutes.get('/Improvements', requiredToken , hasLicenses(['Mejoras']) , getImprovements);

ImprovementsRoutes.post('/Improvements', requiredToken , hasLicenses(['Mejoras']) , postImprovements);

ImprovementsRoutes.put('/Improvements/:idImprovements', requiredToken , hasLicenses(['Mejoras']) , updateImprovements);

ImprovementsRoutes.delete('/Improvements/:idImprovements', requiredToken , hasLicenses(['Mejoras']) , deleteImprovements);
