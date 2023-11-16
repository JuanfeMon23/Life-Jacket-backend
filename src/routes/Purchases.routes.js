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
import { hasLicenses } from '../middlewares/Licenses.js';

export const PurchaseRoutes = Router();

PurchaseRoutes.get('/Purchases', requiredToken , hasLicenses(['Compras']) , getPurchases);

PurchaseRoutes.get('/Purchases/:idPurchase', requiredToken , hasLicenses(['Compras']) , getPurchase);

PurchaseRoutes.post('/Purchases', requiredToken , hasLicenses(['Compras']) , postPurchase);

PurchaseRoutes.patch('/Purchases/:idPurchase', requiredToken , hasLicenses(['Compras']) , statusPurchase);

PurchaseRoutes.get('/Purchases/SearchE/:search', requiredToken , hasLicenses(['Compras']) , searchPurchase);

PurchaseRoutes.get('/Purchases/Report/:startDatePurchase/:finalDatePurchase', requiredToken , hasLicenses(['Compras']) , reportPurchase); 