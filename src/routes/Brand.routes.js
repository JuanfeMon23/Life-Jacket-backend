import {Router} from 'express';
import {getBrands, postBrands, createBrands, deleteBrands} from '../controllers/Brands.controller.js';
import {getVehicleTypes, getVehicleBrand, getVehicleLines}   from '../controllers/VehiclesFilters.js';
import { hasLicenses } from '../middlewares/Licenses.js';
import { requiredToken } from '../middlewares/validatingToken.js';

export const BrandRoutes = Router();

BrandRoutes.get('/Brands', requiredToken,hasLicenses(['Vehiculos']), getBrands);

BrandRoutes.post('/Brands', requiredToken,hasLicenses(['Vehiculos']), postBrands);

BrandRoutes.get('/vehicle-types', getVehicleTypes);
BrandRoutes.get('/vehicles-brand', getVehicleBrand);
BrandRoutes.get('/vehicles-lines', getVehicleLines);


BrandRoutes.post('/Brands/Create', requiredToken,hasLicenses(['Vehiculos']),  createBrands);

BrandRoutes.delete('/Brands/Delete/:idBrand',requiredToken, hasLicenses(['Vehiculos']), deleteBrands); 
