/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains routes of client and its different functions
 */

import {Router} from 'express';
import {getExchanges, getExchange, postExchange, updateExchange, postExchangeDetail, deleteExchangeDetail, cancelExchange, statusExchange, searchExchange, reportExchange, contractExchange } from '../controllers/Exchanges.controller.js';

export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange',  getExchanges);

ExchangeRoutes.get('/Exchange/:idExchange',  getExchange);

ExchangeRoutes.post('/Exchange',  postExchange);

ExchangeRoutes.put('/Exchange/:idExchange',  updateExchange);

ExchangeRoutes.post('/Exchange/:idExchange', postExchangeDetail);

ExchangeRoutes.delete('/Exchange/Cancel/:idExchange',  cancelExchange);

ExchangeRoutes.delete('/Exchange/Detail/:idExchangeDetail', deleteExchangeDetail);

ExchangeRoutes.patch('/Exchange/:idExchange', statusExchange);

ExchangeRoutes.get('/Exchange/SearchE/:search', searchExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', reportExchange); 

ExchangeRoutes.get('/Exchange/Report/:idExchange', contractExchange); 