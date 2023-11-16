/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of licenses and its different functions
 */

import { Router } from "express";

import { createLicense, getLicense, getLicenses, deleteLicense } from "../controllers/Licenses.controller.js";
import { requiredToken } from "../middlewares/validatingToken.js";
import { hasLicenses } from "../middlewares/Licenses.js";

export const LicenseRoutes = Router();

LicenseRoutes.get('/Licenses', requiredToken, hasLicenses(['Roles']),  getLicenses);
LicenseRoutes.get('/Licenses/:idLicense', requiredToken, hasLicenses(['Roles']) , getLicense);
LicenseRoutes.post('/Licenses', requiredToken, hasLicenses(['Roles']), createLicense);
LicenseRoutes.delete('/Licenses/:idLicense', requiredToken, hasLicenses(['Roles']), deleteLicense);