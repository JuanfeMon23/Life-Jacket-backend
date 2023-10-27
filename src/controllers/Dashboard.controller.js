import { sequelize } from "../database/database.js";
import { Sale } from '../models/Sales.model.js';
import { Purchase } from '../models/Purchases.model.js';
import { Vehicle } from '../models/Vehicles.model.js';
import { Improvements } from '../models/Improvements.model.js'
import { Op } from 'sequelize';
import app from '../app.js';



export const getSalesDataByAmount = async (req, res) => {
  try {
    const monthlySales = await Sale.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('saleDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('saleDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('saleFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });

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


export const getPurchasesDataByAmount = async (req, res) => {
  try {
    const monthlyPurchases = await Purchase.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('purchaseDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('purchaseDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('purchaseFinalPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });

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


export const getImprovementsDataByAmount = async (req, res) => {
  try {
    const monthlyImprovements = await Improvements.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('improvementDate')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('improvementDate')), 'year'],
        [sequelize.fn('SUM', sequelize.col('improvementPrice')), 'totalAmount']
      ],
      group: ['month', 'year'],
    });

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



export const getTotalVehicles = async (req, res) => {
  try {
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




