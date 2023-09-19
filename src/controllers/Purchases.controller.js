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
        const {purchaseDate, purchaseIncrementPrice, purchaseFinalPrice, purchaseLimitations, purchaseDepartment, purchaseMunicipality, purchasePecuniaryPenalty, idClientPurchase, idVehiclePurchase} = req.body;
        
        const vehicle = await Vehicle.findByPk(idVehiclePurchase);

        const newPurchase = await Purchase.create({
            purchaseDate,
            purchaseIncrementPrice,
            purchaseFinalPrice,
            purchaseLimitations,
            purchaseDepartment,
            purchaseMunicipality,
            purchasePecuniaryPenalty,
            idClientPurchase,
            idVehiclePurchase
        });

        await vehicle.update({ vehicleStatus : false });

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

export const searchPurchase = async (req, res) => {
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
                    { purchaseDate: { [Op.like]: `%${search}%` } },
                    { purchaseFinalPrice: { [Op.like]: `%${search}%` } },
                    { purchaseDepartment: { [Op.like]: `%${search}%` } },
                    { purchaseMunicipality: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.licensePlate$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.vehicleType$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.brand$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.model$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.type$': { [Op.like]: `%${search}%` } },
                    {'$Vehicle.line$': { [Op.like]: `%${search}%` } }
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