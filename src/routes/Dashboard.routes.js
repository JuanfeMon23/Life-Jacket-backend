/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Dashboard and its different functions
 */

import {Router} from 'express';

import {checkMonthChangeMiddlewareSales, checkMonthChangeMiddlewarePurchases, checkMonthChangeMiddlewareImprovements, checkMonthChangeMiddlewareExchanges} from "../middlewares/monthChangeMiddleware.js"

import {getSalesDataByAmount, getPurchasesDataByAmount, getExchangesDataByAmount, getImprovementsDataByAmount,getTotalVehicles,
  getSaleAmountCard, getPurchaseAmountCard, getImprovementAmountCard, getExchangeAmountCard} from '../controllers/Dashboard.controller.js';

import { requiredToken } from '../middlewares/validatingToken.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/Sales/withMonth', requiredToken , getSalesDataByAmount);

DashboardRoutes.get('/Dashboard/Purchases/withMonth', requiredToken , getPurchasesDataByAmount);

DashboardRoutes.get('/Dashboard/Improvements/withMonth', requiredToken , getImprovementsDataByAmount);

DashboardRoutes.get('/Dashboard/Vehicles/totalVehicles', requiredToken , getTotalVehicles);

DashboardRoutes.get('/Dashboard/Exchanges/withMonth',requiredToken , getExchangesDataByAmount);

DashboardRoutes.get('/Dashboard/Sales/withMonth/Card', requiredToken , checkMonthChangeMiddlewareSales, getSaleAmountCard);

DashboardRoutes.get('/Dashboard/Purchases/withMonth/Card', requiredToken , checkMonthChangeMiddlewarePurchases, getPurchaseAmountCard);

DashboardRoutes.get('/Dashboard/Improvements/withMonth/Card', requiredToken , checkMonthChangeMiddlewareImprovements, getImprovementAmountCard);

DashboardRoutes.get('/Dashboard/Exchanges/withMonth/Card', requiredToken , checkMonthChangeMiddlewareExchanges, getExchangeAmountCard);