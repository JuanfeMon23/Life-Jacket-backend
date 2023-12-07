/**
 * Developer: Juan Diego Millan
 * Email: juandiegomillancano853@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations of the application dashboard which are: 
 * Money Generated from Sales, Purchases, Exchanges, Improvements and the number of vehicles in the system.
 *  Uses Express.js and Sequelize to interact with the database.
 */

import { sequelize } from "../database/database.js";
import { Sale } from '../models/Sales.model.js';
import { Purchase } from '../models/Purchases.model.js';
import { Vehicle } from '../models/Vehicles.model.js';
import { Improvements } from '../models/Improvements.model.js'
import { Exchange } from "../models/Exchanges.model.js";
import { Op } from 'sequelize';
import app from '../app.js'; 
import { Sequelize } from 'sequelize';

//Get monthly sales data by the amount of money.
//Retrieves and formats data on total sales amounts for each month and year.
export const getSalesDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly sales data including month, year, and total amount.
    const monthlySales = await Sale.findAll({
      where: {
        saleStatus : "true"
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('saleDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('saleDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('saleFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });
    // Format the retrieved data into a more readable format.
    const formattedDataSales = monthlySales.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    res.json(formattedDataSales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de ventas por cantidad de dinero' });
  }
};

//Get monthly purchases data by the amount of money.
//Retrieves and formats data on total purchases amounts for each month and year.
export const getPurchasesDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly purchases data including month, year, and total amount.
    const monthlyPurchases = await Purchase.findAll({
      where: {
        purchaseStatus : "true"
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('purchaseDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('purchaseDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('purchaseFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });
    // Format the retrieved data into a more readable format.
    const formattedDataPurchases = monthlyPurchases.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    res.json(formattedDataPurchases);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de compras por cantidad de dinero' });
  }
};

//Get monthly improvements data by the amount of money.
//Retrieves and formats data on total improvements amounts for each month and year.
export const getImprovementsDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly improvements data including month, year, and total amount.
    const monthlyImprovements = await Improvements.findAll({
      where: {
        improvementStatus : "true"
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('improvementDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('improvementDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('improvementPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });
     // Format the retrieved data into a more readable format.
    const formattedDataImprovements = monthlyImprovements.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    res.json(formattedDataImprovements);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de compras por cantidad de dinero' });
  }
};


//Get the total count of active vehicles.
//Retrieves the total count of vehicles with the status set to true.
export const getTotalVehicles = async (req, res) => {
  try {

    // Retrieve the total count of active vehicles
    const totalVehicles = await Vehicle.count({
      where: {
        vehicleStatus: "true"
      }
    });

    res.json({ totalVehicles });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el total de vehículos' });
  }
};

//Get monthly exchanges data by the amount of money.
//Retrieves and formats data on total exchanges amounts for each month and year.
export const getExchangesDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly sales data for exchangeCashPriceStatus equal to "true".
    const trueExchanges = await Exchange.findAll({
      where: {
        exchangeStatus: "true",
        exchangeCashPriceStatus: "true"
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('exchangeDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('exchangeDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('exchangeCashPrice')), 'totalAmount'],
        'exchangeCashPriceStatus'
      ],
      group: ['month', 'year'],
    });

    // Format the retrieved data for "true" exchangeCashPriceStatus.
    const formattedTrueExchanges = trueExchanges.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount'),
        exchangeCashPriceStatus: result.getDataValue('exchangeCashPriceStatus')
      };
    });

    // Retrieve monthly sales data for exchangeCashPriceStatus equal to "false".
    const falseExchanges = await Exchange.findAll({
      where: {
        exchangeStatus: "true",
        exchangeCashPriceStatus: "false"
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('exchangeDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('exchangeDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('exchangeCashPrice')), 'totalAmount'],
        'exchangeCashPriceStatus'
      ],
      group: ['month', 'year'],
    });

    // Format the retrieved data for "false" exchangeCashPriceStatus.
    const formattedFalseExchanges = falseExchanges.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount'),
        exchangeCashPriceStatus: result.getDataValue('exchangeCashPriceStatus')
      };
    });

    res.json({
      trueExchanges: formattedTrueExchanges,
      falseExchanges: formattedFalseExchanges
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de intercambios por cantidad de dinero' });
  }
};



//Cards

//Get monthly sales data by the amount of money.
//Retrieves and formats data on total sales amounts for each month.

// Defines a global variable to hold the state of the current month.
let currentMonth = new Date().getMonth() + 1; // The month in JavaScript is 0-indexed.

export const getSalesDataByAmountCard = async () => {
  try {
   // Calculates the start date of the current month.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; 

    if (month !== currentMonth) {
      currentMonth = month;
    }
    
    // Defines the date range for the current month.
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Retrieves the sales of the current month without taking into account the time.
    const monthlySales = await Sale.findAll({
      where: {
        saleStatus: "true",
        saleDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.fn('DATE', sequelize.col('saleDate'))), 'month'],
        [sequelize.fn('YEAR', sequelize.fn('DATE', sequelize.col('saleDate'))), 'year'],
        [sequelize.fn('SUM', sequelize.col('saleFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });

    // Formats the retrieved data into a readable format.
    const formattedDataSales = monthlySales.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    // You can return the data or perform other necessary actions.
    return formattedDataSales;
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};


//Get monthly sales data by the amount of money.
//Retrieves and formats data on total sales amounts for each month.
export const getPurchasesDataByAmountCard = async () => {
  try {
    // Calculates the start date of the current month.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; 

    if (month !== currentMonth) {
      currentMonth = month;
    }

    // Defines the date range for the current month.
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Retrieves the purchases of the current month without taking into account the time.
    const monthlyPurchases = await Purchase.findAll({
      where: {
        purchaseStatus: "true",
        purchaseDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('purchaseDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('purchaseDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('purchaseFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });

    // Formats the retrieved data into a readable format.
    const formattedDataPurchases = monthlyPurchases.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    // You can return the data or perform other necessary actions.
    return formattedDataPurchases;
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};


//Get monthly improvements data by the amount of money.
//Retrieves and formats data on total improvements amounts for each month.
export const getImprovementsDataByAmountCard = async () => {
  try {
    // Calculates the start date of the current month.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; 

    if (month !== currentMonth) {
      currentMonth = month;
    }

    // Defines the date range for the current month.
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0);

    // Retrieves the improvements of the current month without taking into account the time.
    const monthlyImprovements = await Improvements.findAll({
      where: {
        improvementStatus : "true",
        improvementDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('improvementDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('improvementDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('improvementPrice')), 'totalAmount']
      ],

      group: ['month', 'year'],
    });

    // Formats the retrieved data into a readable format.
    const formattedDataImprovements = monthlyImprovements.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalAmount: result.getDataValue('totalAmount')
      };
    });

    // You can return the data or perform other necessary actions.
    return formattedDataImprovements;
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};


//Get monthly exchanges data by the amount of money.
//Retrieves and formats data on total exchanges amounts for each month.
export const getExchangesDataByAmountCard = async () => {
  try {
    // Calculates the start date of the current month.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; 

    if (month !== currentMonth) {
      currentMonth = month;
    }

    // Defines the date range for the current month.
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0);

    // Retrieves the exchanges of the current month without taking into account the time.
    const monthlyExchanges = await Exchange.findAll({
      where: {
        exchangeStatus : "true",
        exchangeDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('exchangeDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('exchangeDate')), 'year'],
        [sequelize.fn('COUNT', sequelize.col('idExchange')), 'totalExchanges']
      ],
      group: ['month', 'year'],
    });

    // Formats the retrieved data into a readable format.
    const formattedDataExchanges = monthlyExchanges.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalExchanges: result.getDataValue('totalExchanges')
      };
    });

    // You can return the data or perform other necessary actions.
    return formattedDataExchanges;
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};


export const getSaleAmountCard = async (req, res) => {
  try {
    const salesData = await getSalesDataByAmountCard();
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: 'Error when obtaining sales data by amount of money' });
  }
};

export const getPurchaseAmountCard = async (req, res) => {
  try {
    const purchasesData = await getPurchasesDataByAmountCard();
    res.json(purchasesData);
  } catch (error) {
    res.status(500).json({ error: 'Error when obtaining purchases data by amount of money' });
  }
};

export const getImprovementAmountCard = async (req, res) => {
  try {
    const ImprovementsData = await getImprovementsDataByAmountCard();
    res.json(ImprovementsData);
  } catch (error) {
    res.status(500).json({ error: 'Error when obtaining improvements data by amount of money' });
  }
};


export const getExchangeAmountCard = async (req, res) => {
  try {
    const ExchangesData = await getExchangesDataByAmountCard();
    res.json(ExchangesData);
  } catch (error) {
    res.status(500).json({ error: 'Error when obtaining exchanges data by amount of money' });
  }
};