/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getExchanges, getExchange, getExchangesFiltered, postExchange, updateExchange, postExchangeDetail, deleteExchangeDetail, cancelExchange, statusExchange, reportExchange } from '../controllers/Exchanges.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
import { hasLicenses } from '../middlewares/Licenses.js';

export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange', requiredToken , hasLicenses(['Intercambios']) ,  getExchanges);

ExchangeRoutes.get('/Exchange-Filtered', requiredToken , hasLicenses(['Intercambios']) ,  getExchangesFiltered);

ExchangeRoutes.post('/Exchange', requiredToken , hasLicenses(['Intercambios']) , postExchange);

ExchangeRoutes.put('/Exchange/:idExchange', requiredToken , hasLicenses(['Intercambios']) , updateExchange);

ExchangeRoutes.post('/Exchange/:idExchange', requiredToken , hasLicenses(['Intercambios']) , postExchangeDetail);
 
ExchangeRoutes.delete('/Exchange/Cancel/:idExchange', requiredToken , hasLicenses(['Intercambios']) , cancelExchange);

ExchangeRoutes.delete('/Exchange/Detail/:idExchangeDetail', requiredToken , hasLicenses(['Intercambios']) , deleteExchangeDetail);

ExchangeRoutes.patch('/Exchange/:idExchange', requiredToken , hasLicenses(['Intercambios']) , statusExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', requiredToken , hasLicenses(['Intercambios']) , reportExchange); 