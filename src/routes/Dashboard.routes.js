/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 *  Description: This script contains routes of Dashboard and its different functions
 */

import {Router} from 'express';
import {getSalesDataByAmount, getPurchasesDataByAmount, getExchangesDataByAmountCard, getImprovementsDataByAmount,getTotalVehicles, getSalesDataByAmountCard, getPurchasesDataByAmountCard, getImprovementsDataByAmountCard, getExchangesDataByAmount} from '../controllers/Dashboard.controller.js';

export const DashboardRoutes = Router();

DashboardRoutes.get('/Dashboard/Sales/withMonth', getSalesDataByAmount);

DashboardRoutes.get('/Dashboard/Purchases/withMonth', getPurchasesDataByAmount);

DashboardRoutes.get('/Dashboard/Improvements/withMonth', getImprovementsDataByAmount);

DashboardRoutes.get('/Dashboard/Vehicles/totalVehicles', getTotalVehicles);

DashboardRoutes.get('/Dashboard/Exchanges/withMonth', getExchangesDataByAmount);

DashboardRoutes.get('/Dashboard/Sales/withMonth/Card', async (req, res) => {
    try {
      const salesData = await getSalesDataByAmountCard();
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ error: 'Error when obtaining sales data by amount of money' });
    }
});

DashboardRoutes.get('/Dashboard/Purchases/withMonth/Card', async (req, res) => {
    try {
      const purchasesData = await getPurchasesDataByAmountCard();
      res.json(purchasesData);
    } catch (error) {
      res.status(500).json({ error: 'Error when obtaining purchases data by amount of money' });
    }
});

DashboardRoutes.get('/Dashboard/Improvements/withMonth/Card', async (req, res) => {
    try {
      const ImprovementsData = await getImprovementsDataByAmountCard();
      res.json(ImprovementsData);
    } catch (error) {
      res.status(500).json({ error: 'Error when obtaining improvements data by amount of money' });
    }
});

DashboardRoutes.get('/Dashboard/Exchanges/withMonth/Card', async (req, res) => {
  try {
    const ExchangesData = await getExchangesDataByAmountCard();
    res.json(ExchangesData);
  } catch (error) {
    res.status(500).json({ error: 'Error when obtaining exchanges data by amount of money' });
  }
});