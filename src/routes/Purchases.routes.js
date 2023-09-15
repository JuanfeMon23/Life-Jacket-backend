import {Router} from 'express';
import {getPurchases, getPurchase, postPurchase, statusPurchase, searchPurchase, reportPurchase } from '../controllers/Purchases.controller.js';

export const PurchaseRoutes = Router();

PurchaseRoutes.get('/Purchases', getPurchases);

PurchaseRoutes.get('/Purchases/:idPurchase', getPurchase);

PurchaseRoutes.post('/Purchases', postPurchase);

PurchaseRoutes.patch('/Purchases/:idPurchase', statusPurchase);

PurchaseRoutes.get('/Purchases/SearchE/:search', searchPurchase);

PurchaseRoutes.get('/Purchases/Report/:startDatePurchase/:finalDatePurchase', reportPurchase); 