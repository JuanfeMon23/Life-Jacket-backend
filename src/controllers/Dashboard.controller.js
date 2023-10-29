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
import { Op } from 'sequelize';
import app from '../app.js';


//Get monthly sales data by the amount of money.
//Retrieves and formats data on total sales amounts for each month and year.
export const getSalesDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly sales data including month, year, and total amount.
    const monthlySales = await Sale.findAll({
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
    console.error('Error al obtener datos de ventas por cantidad de dinero:', error);
    res.status(500).json({ error: 'Error al obtener datos de ventas por cantidad de dinero' });
  }
};

//Get monthly purchases data by the amount of money.
//Retrieves and formats data on total purchases amounts for each month and year.
export const getPurchasesDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly purchases data including month, year, and total amount.
    const monthlyPurchases = await Purchase.findAll({
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
    console.error('Error al obtener datos de compras por cantidad de dinero:', error);
    res.status(500).json({ error: 'Error al obtener datos de compras por cantidad de dinero' });
  }
};

//Get monthly improvements data by the amount of money.
//Retrieves and formats data on total improvements amounts for each month and year.
export const getImprovementsDataByAmount = async (req, res) => {
  try {
    // Retrieve monthly improvements data including month, year, and total amount.
    const monthlyImprovements = await Improvements.findAll({
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
    console.error('Error al obtener datos de compras por cantidad de dinero:', error);
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
        vehicleStatus: true,
      },
    });

    res.json({ totalVehicles });
  } catch (error) {
    console.error('Error al obtener el total de vehículos :', error);
    res.status(500).json({ error: 'Error al obtener el total de vehículos' });
  }
};




/* export const getExchangesData = async (req, res) => {
  try {
    const monthlyExchanges = await Purchase.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('exchangeDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('exchangeDate')), 'year'],
        [sequelize.fn('COUNT', '*'), 'totalExchanges']
      ],
      group: ['month', 'year'],
    });
    const formattedData = monthlyExchanges.map((result) => {
      return {
        month: result.getDataValue('month'),
        year: result.getDataValue('year'),
        totalExchanges: result.getDataValue('totalExchanges')
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error al obtener datos de compras', error);
    res.status(500).json({ error: 'Error al obtener datos de compras' });
  }
}; */




