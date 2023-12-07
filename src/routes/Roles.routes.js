/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of roles and its different functions
 */

import { Router } from "express";
import { createRol, getRol, getRoles , updateRol, statusRol, deleteRol, addLicenses } from "../controllers/Roles.controller.js";
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from "../middlewares/Licenses.js";
export const RolRoutes =  Router();

RolRoutes.get('/Roles', requiredToken,  hasLicenses(['Roles']) , getRoles );

RolRoutes.post('/Roles', requiredToken, hasLicenses(['Roles']) , createRol);

RolRoutes.put('/Roles/:idRol' , requiredToken, hasLicenses(['Roles']) , updateRol);

RolRoutes.patch('/Roles/:idRol' , requiredToken, hasLicenses(['Roles']) , statusRol);

RolRoutes.delete('/Roles/:idRol', requiredToken, hasLicenses(['Roles']) , deleteRol);

RolRoutes.post('/Roles/:idRol/Licenses/:idLicense', requiredToken , hasLicenses(['Roles']) , addLicenses);
