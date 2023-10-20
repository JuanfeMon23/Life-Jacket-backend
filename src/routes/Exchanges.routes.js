import {Router} from 'express';
import {getExchanges, getExchange, postExchange, updateExchange, postExchangeDetail, statusVehicleExchange, statusExchange, deleteExchange, searchExchange, reportExchange } from '../controllers/Exchanges.controller.js';

export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange', getExchanges);

ExchangeRoutes.get('/Exchange/:idExchange', getExchange);

ExchangeRoutes.post('/Exchange', postExchange);

ExchangeRoutes.put('/Exchange/:idExchange', updateExchange);

ExchangeRoutes.post('/Exchange/:idExchange', postExchangeDetail);

ExchangeRoutes.patch('/Exchange/Vehicle/:idExchange', statusVehicleExchange);

ExchangeRoutes.patch('/Exchange/:idExchange', statusExchange);

ExchangeRoutes.delete('/Exchange/:idExchange', deleteExchange);

ExchangeRoutes.get('/Exchange/SearchE/:search', searchExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', reportExchange); 
