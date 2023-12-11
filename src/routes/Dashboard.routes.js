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
  getSaleAmountCard, getPurchaseAmountCard, getImprovementAmountCard, getExchangeAmountCard, salesToMobile, purchasesToMobile, improvementsTomobile, exchangesToMobile } from '../controllers/Dashboard.controller.js';

import { requiredToken } from '../middlewares/validatingToken.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/Sales/withMonth' , getSalesDataByAmount);

DashboardRoutes.get('/Dashboard/Purchases/withMonth' , getPurchasesDataByAmount);

DashboardRoutes.get('/Dashboard/Improvements/withMonth' , getImprovementsDataByAmount);

DashboardRoutes.get('/Dashboard/Vehicles/totalVehicles' , getTotalVehicles);

DashboardRoutes.get('/Dashboard/Exchanges/withMonth' , getExchangesDataByAmount);

DashboardRoutes.get('/Dashboard/Sales/withMonth/Card' , checkMonthChangeMiddlewareSales, getSaleAmountCard);

DashboardRoutes.get('/Dashboard/Purchases/withMonth/Card' , checkMonthChangeMiddlewarePurchases, getPurchaseAmountCard);

DashboardRoutes.get('/Dashboard/Improvements/withMonth/Card' , checkMonthChangeMiddlewareImprovements, getImprovementAmountCard);

DashboardRoutes.get('/Dashboard/Exchanges/withMonth/Card' , checkMonthChangeMiddlewareExchanges, getExchangeAmountCard);

DashboardRoutes.get('/Dashboard-mobile/Sales', salesToMobile);

DashboardRoutes.get('/Dashboard-mobile/Purchases', purchasesToMobile );

DashboardRoutes.get('/Dashboard-mobile/Improvements', improvementsTomobile );

DashboardRoutes.get('/Dashboard-mobile/Exchanges', exchangesToMobile );
