/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of sales and its different functions
 */

import {Router} from 'express';
import {getSales, getSale, postSale, statusSale, searchSale , reportSale } from '../controllers/Sales.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';


export const SaleRoutes = Router();

SaleRoutes.get('/Sales', requiredToken, getSales);

SaleRoutes.get('/Sales/:idSale', requiredToken, getSale);

SaleRoutes.post('/Sales', requiredToken, postSale);

SaleRoutes.patch('/Sales/:idSale', requiredToken, statusSale);

SaleRoutes.get('/Sales/SearchE/:search', requiredToken, searchSale);

SaleRoutes.get('/Sales/Report/:startDateSale/:finalDateSale', requiredToken, reportSale); 
