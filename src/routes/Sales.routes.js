import {Router} from 'express';
import {getSales, getSale, postSale, /* updateSale, */ statusSale, searchSale} from '../controllers/Sales.controller.js';

export const SaleRoutes = Router();

SaleRoutes.get('/Sales', getSales);

SaleRoutes.get('/Sales/:idSale', getSale);

SaleRoutes.post('/Sales', postSale);

/* SaleRoutes.put('/Sales/:idSale', updateSale); */

SaleRoutes.patch('/Sales/:idSale', statusSale);

SaleRoutes.get('/Sales/SearchE/:search', searchSale);