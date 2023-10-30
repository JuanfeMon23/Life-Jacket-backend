/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of licenses and its different functions
 */

import { Router } from "express";

import { createLicense, getLicense, getLicenses, deleteLicense } from "../controllers/Licenses.controller.js";

export const LicenseRoutes = Router();

LicenseRoutes.get('/Licenses', getLicenses);
LicenseRoutes.get('/Licenses/:idLicense', getLicense);
LicenseRoutes.post('/Licenses', createLicense);
LicenseRoutes.delete('/Licenses/:idLicense', deleteLicense);