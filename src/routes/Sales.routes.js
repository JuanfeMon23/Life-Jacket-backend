/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of sales and its different functions
 */

import {Router} from 'express';
import {getSales, getSale, postSale, statusSale, searchSale , reportSale, contractSale } from '../controllers/Sales.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from '../middlewares/Licenses.js';


export const SaleRoutes = Router();

SaleRoutes.get('/Sales', requiredToken, hasLicenses(['Ventas']) , getSales);

SaleRoutes.post('/Sales', requiredToken, hasLicenses(['Ventas']) , postSale);

SaleRoutes.patch('/Sales/:idSale', requiredToken, hasLicenses(['Ventas']) , statusSale);

SaleRoutes.get('/Sales/SearchE/:search', requiredToken, hasLicenses(['Ventas']) , searchSale);

SaleRoutes.get('/Sales/Report/:startDateSale/:finalDateSale', requiredToken, hasLicenses(['Ventas']) , reportSale); 

SaleRoutes.get('/Sales/Contract/:idSale', requiredToken, requiredToken , hasLicenses(['Ventas']) , contractSale); 