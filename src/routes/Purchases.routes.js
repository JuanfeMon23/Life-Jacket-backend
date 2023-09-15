import {Router} from 'express';
import { getPurchase, getPurchases, postPurchase, reportPurchase, searchPurchases, statusPurchase } from '../controllers/Purchases.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
export const PurchaseRoutes = Router();

PurchaseRoutes.get('/Purchases',getPurchases );
PurchaseRoutes.get('/Purchases/:idPurchase',getPurchase );
PurchaseRoutes.post('/Purchases',postPurchase );
PurchaseRoutes.patch('/Purchases/:idPurchase',statusPurchase );
PurchaseRoutes.get('/Purchases/SearchE/:search',searchPurchases );
PurchaseRoutes.get('/Sales/Report/:startDateSale/:finalDateSale', reportPurchase);