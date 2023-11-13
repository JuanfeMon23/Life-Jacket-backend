/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getExchanges, getExchange, postExchange, updateExchange, postExchangeDetail, deleteExchangeDetail, cancelExchange, statusExchange, searchExchange, reportExchange } from '../controllers/Exchanges.controller.js';
import { requiredToken } from '../middlewares/validatingToken.js';
export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange', requiredToken , getExchanges);

ExchangeRoutes.get('/Exchange/:idExchange', requiredToken , getExchange);

ExchangeRoutes.post('/Exchange', requiredToken , postExchange);

ExchangeRoutes.put('/Exchange/:idExchange', requiredToken , updateExchange);

ExchangeRoutes.post('/Exchange/:idExchange', requiredToken , postExchangeDetail);

ExchangeRoutes.delete('/Exchange/Cancel/:idExchange', requiredToken , cancelExchange);

ExchangeRoutes.delete('/Exchange/Detail/:idExchangeDetail', requiredToken , deleteExchangeDetail);

ExchangeRoutes.patch('/Exchange/:idExchange', requiredToken , statusExchange);

ExchangeRoutes.get('/Exchange/SearchE/:search', requiredToken , searchExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', requiredToken , reportExchange); 
