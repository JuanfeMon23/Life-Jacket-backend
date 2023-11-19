/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getExchanges, getExchange, postExchange, updateExchange, postExchangeDetail, deleteExchangeDetail, cancelExchange, statusExchange, reportExchange } from '../controllers/Exchanges.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from '../middlewares/Licenses.js';

export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange', requiredToken , hasLicenses(['Cambios']) ,  getExchanges);

ExchangeRoutes.post('/Exchange', requiredToken , hasLicenses(['Cambios']) , postExchange);

ExchangeRoutes.put('/Exchange/:idExchange', requiredToken , hasLicenses(['Cambios']) , updateExchange);

ExchangeRoutes.post('/Exchange/:idExchange', requiredToken , hasLicenses(['Cambios']) , postExchangeDetail);
 
ExchangeRoutes.delete('/Exchange/Cancel/:idExchange', requiredToken , hasLicenses(['Cambios']) , cancelExchange);

ExchangeRoutes.delete('/Exchange/Detail/:idExchangeDetail', requiredToken , hasLicenses(['Cambios']) , deleteExchangeDetail);

ExchangeRoutes.patch('/Exchange/:idExchange', requiredToken , hasLicenses(['Cambios']) , statusExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', requiredToken , hasLicenses(['Cambios']) , reportExchange); 