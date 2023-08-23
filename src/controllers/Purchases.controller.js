import { Purchase } from "../models/Purchases.model.js";
import app from "../app.js";

export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        return res.status(200).json(purchases);
    } catch (error) {
        return res.status(500).json({message : error.message});
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
        const {PurchaseDate, purchasePrice, purchasePayMethod, purchaseLimitations, purchaseCity, purchasePecunaryPenalty, purchaseStatus} = req.body;
        const newPurchase = await Purchase.create({
            PurchaseDate,
            purchasePrice,
            purchasePayMethod,
            purchaseLimitations,
            purchaseCity,
            purchasePecunaryPenalty,
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
    try {
        
    } catch (error) {
        
    }
};