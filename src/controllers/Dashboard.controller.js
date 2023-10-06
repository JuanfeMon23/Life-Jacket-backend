import { sequelize } from "../database/database.js";
import { Sale } from '../models/Sales.model.js';
import { Purchase } from '../models/Purchases.model.js';
import { Vehicle } from '../models/Vehicles.model.js';
import { Client } from '../models/Clients.model.js';
import { Op } from 'sequelize';
import app from '../app.js';



export const getSalesData = async (req, res) => {
    try {
      const monthlySales = await Sale.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('saleDate')), 'month'],
          [sequelize.fn('YEAR', sequelize.col('saleDate')), 'year'],
          [sequelize.fn('COUNT', '*'), 'totalSales']
        ],
        group: ['month', 'year'],
      });
  
      const formattedDataSales = monthlySales.map((result) => {
        return {
          month: result.getDataValue('month'),
          year: result.getDataValue('year'),
          totalSales: result.getDataValue('totalSales')
        };
      });
  
      res.json(formattedDataSales);
    } catch (error) {
      console.error('Error al obtener datos de ventas:', error);
      res.status(500).json({ error: 'Error al obtener datos de ventas' });
    }
  };


export const getPurchasesData = async (req, res) => {
    try {
      const monthlyPurchases = await Purchase.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('purchaseDate')), 'month'],
          [sequelize.fn('YEAR', sequelize.col('purchaseDate')), 'year'],
          [sequelize.fn('COUNT', '*'), 'totalPurchases']
        ],
        group: ['month', 'year'],
      });
      const formattedDataPurchases = monthlyPurchases.map((result) => {
        return {
          month: result.getDataValue('month'),
          year: result.getDataValue('year'),
          totalPurchases: result.getDataValue('totalPurchases')
        };
      });
  
      res.json(formattedDataPurchases);
    } catch (error) {
      console.error('Error al obtener datos de compras', error);
      res.status(500).json({ error: 'Error al obtener datos de compras' });
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



export const getTotalClients = async (req, res) => {
  try {
    const totalClients = await Client.count({
      where: {
        clientStatus: true,
      },
    });

    res.json({ totalClients });
  } catch (error) {
    console.error('Error al obtener el total de clientes :', error);
    res.status(500).json({ error: 'Error al obtener el total de clientes' });
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




