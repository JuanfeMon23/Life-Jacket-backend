import { Router } from "express";
import { createLicense, getLicense, getLicenses, updateLicense, deleteLicense } from "../controllers/Licenses.controller.js";

export const LicenseRoutes = Router();

LicenseRoutes.get('/Licenses', getLicenses);
LicenseRoutes.get('/Licenses/:idLicense', getLicense);
LicenseRoutes.post('/Licenses', createLicense);
LicenseRoutes.put('/Licenses/:idLicense', updateLicense);
LicenseRoutes.delete('/Licenses/:idLicense', deleteLicense);