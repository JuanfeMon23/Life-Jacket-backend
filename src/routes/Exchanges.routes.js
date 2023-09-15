import {Router} from 'express';
import {getExchanges, getExchange, postExchange, statusExchange, searchExchange, reportExchange } from '../controllers/Exchanges.controller.js';

export const ExchangeRoutes = Router();

ExchangeRoutes.get('/Exchange', getExchanges);

ExchangeRoutes.get('/Exchange/:idExchange', getExchange);

ExchangeRoutes.post('/Exchange', postExchange);

ExchangeRoutes.patch('/Exchange/:idExchange', statusExchange);

ExchangeRoutes.get('/Exchange/SearchE/:search', searchExchange);

ExchangeRoutes.get('/Exchange/Report/:startDateExchange/:finalDateExchange', reportExchange); 
