/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of purchases and its different functions
 */

import {Router} from 'express';
import {getPurchases, getPurchase, postPurchase, statusPurchase, searchPurchase, reportPurchase } from '../controllers/Purchases.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';

export const PurchaseRoutes = Router();

PurchaseRoutes.get('/Purchases', requiredToken , getPurchases);

PurchaseRoutes.get('/Purchases/:idPurchase', requiredToken , getPurchase);

PurchaseRoutes.post('/Purchases', requiredToken , postPurchase);

PurchaseRoutes.patch('/Purchases/:idPurchase', requiredToken , statusPurchase);

PurchaseRoutes.get('/Purchases/SearchE/:search', requiredToken , searchPurchase);

PurchaseRoutes.get('/Purchases/Report/:startDatePurchase/:finalDatePurchase', requiredToken , reportPurchase); 