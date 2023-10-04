import { sequelize } from "../database/database.js";
import { Sale } from '../models/Sales.model.js';
import { Purchase } from '../models/Purchases.model.js';
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
      const formattedData = monthlySales.map((result) => {
        return {
          month: result.getDataValue('month'),
          year: result.getDataValue('year'),
          totalSales: result.getDataValue('totalSales')
        };
      });
  
      res.json(formattedData);
    } catch (error) {
      console.error('Error al obtener datos de ventas', error);
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
      const formattedData = monthlyPurchases.map((result) => {
        return {
          month: result.getDataValue('month'),
          year: result.getDataValue('year'),
          totalPurchases: result.getDataValue('totalPurchases')
        };
      });
  
      res.json(formattedData);
    } catch (error) {
      console.error('Error al obtener datos de compras', error);
      res.status(500).json({ error: 'Error al obtener datos de compras' });
    }
  };





