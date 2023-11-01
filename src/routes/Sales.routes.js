/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of sales and its different functions
 */

import {Router} from 'express';
import {getSales, getSale, postSale, statusSale, searchSale , reportSale } from '../controllers/Sales.controller.js';

export const SaleRoutes = Router();

SaleRoutes.get('/Sales', getSales);

SaleRoutes.get('/Sales/:idSale', getSale);

SaleRoutes.post('/Sales', postSale);

SaleRoutes.patch('/Sales/:idSale', statusSale);

SaleRoutes.get('/Sales/SearchE/:search', searchSale);

SaleRoutes.get('/Sales/Report/:startDateSale/:finalDateSale', reportSale); 
