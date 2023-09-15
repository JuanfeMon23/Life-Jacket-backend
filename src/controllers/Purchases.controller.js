import {Purchase} from '../models/Purchases.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import { Op } from 'sequelize';
import app from '../app.js';

export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
                
            ],
        });
        res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : error.message});
    }
};


export const getPurchase = async (req, res) => {
    try {
        const {idPurchase} = req.params;
        const Purchase = await Purchase.findOne({
            where: {
                idPurchase
            }
        });
        res.json(idPurchase);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const postPurchase = async (req, res) => {
    try {
        const {PurchaseDate, purchasePrice, purchasePayMethod, purchaseLimitations, purchaseCity, purchasePecunaryPenalty, purchaseStatus, idClientPurchase, idVehiclePurchase} = req.body;
        const newPurchase = await Purchase.create({
            PurchaseDate,
            purchasePrice,
            purchasePayMethod,
            purchaseLimitations,
            purchaseCity,
            purchasePecunaryPenalty,
            idClientPurchase,
            idVehiclePurchase
        });
        return res.status(200).json(newPurchase);   
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const statusPurchase = async (req, res) => {
    try {
        const {idPurchase} = req.params;
        const purchase = await Purchase.findByPk(idPurchase);
        purchase.purchaseStatus = !purchase.purchaseStatus;

        await purchase.save();
        res.json(purchase);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const searchPurchases = async (req, res) => {
    const {search} = req.params;
    try {
        const Purchase = await Purchase.findAll({
            include: [
                {
                    model: Client 
                },
                {
                    model: Vehicle
                }
            ],
            where: {
                [Op.or]: [
                    { saleDate: { [Op.like]: `%${search}%` } },
                    { salePrice: { [Op.like]: `%${search}%` } },
                    { saleCity: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                ],
            },
        });
        res.json(sale);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const reportPurchase = async (req, res) => {
    const startDatePurchase = new Date(req.params.startDatePurchase);
    const finalDatePurchase = new Date(req.params.finalDatePurchase);
    try {
        const purchase = await Purchase.findAll({
            where: {
                saleDate: {
                    [Op.between]: [startDatePurchase, finalDatePurchase]
                }
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle
                }
            ],
        });
        res.json(purchase);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
}; 