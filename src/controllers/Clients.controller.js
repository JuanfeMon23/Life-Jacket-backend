import {Client} from '../models/Clients.model.js';
import {Sale} from '../models/Sales.model.js';
import {Purchase} from '../models/Purchases.model.js';
import { Op } from 'sequelize';
import app from '../app.js';

export const getClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : error.message});
    }
};

export const getClient = async (req,res) => {
    try {
        const {idClient} = req.params;
        
        const client = await Client.findOne({
            where: {
                idClient
            }
        })
        res.json(client)
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postClient = async (req, res) => {
    try {
        const {clientTypeDocument, clientDocument, clientName, clientLastName, clientDepartment, clientMunicipality, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber, clientStatus} = req.body;

        const newClient = await Client.create({
            clientTypeDocument,
            clientDocument,
            clientName,
            clientLastName,
            clientDepartment,
            clientMunicipality,
            clientAddress,
            clientPhoneNumber,
            clientOtherContact,
            clientOtherPhoneNumber,
            clientStatus
        });
        return res.status(200).json(newClient);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const updateClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const {clientName, clientLastName, clientDepartment, clientMunicipality, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber} = req.body;

        const client = await Client.findByPk(idClient)

        if(client.clientStatus === false){
            return res.status(400).json({ message : "No puedes editar un cliente deshabilitado"});
        }

        client.clientName = clientName
        client.clientLastName = clientLastName
        client.clientDepartment = clientDepartment
        client.clientMunicipality = clientMunicipality
        client.clientAddress = clientAddress
        client.clientPhoneNumber = clientPhoneNumber
        client.clientOtherContact = clientOtherContact
        client.clientOtherPhoneNumber = clientOtherPhoneNumber

        await client.save()
        res.json(client);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const statusClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const client = await Client.findByPk(idClient)

        client.clientStatus = !client.clientStatus;

        await client.save();
        res.json(client);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

export const deleteClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const client = await Client.findByPk(idClient)

        const saleCount = await client.countSales();
        const purchaseCount = await client.countPurchases();

        if (saleCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un cliente con ventas asociadas"});
        }

        if (purchaseCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un cliente con compras asociadas"});
        }
        
        await client.destroy();
        
        return res.status(200).json({ message: 'Cliente eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const searchClient  = async (req, res) => {
    const {search} = req.params;
    try {
        const client = await Client.findAll({
            where : {
                [Op.or]: [
                    {clientDocument : { [Op.like] : `%${search}%`}},
                    {clientName : { [Op.like] : `%${search}%`}},
                    {clientLastName : { [Op.like] : `%${search}%`}},
                    {clientDepartment : { [Op.like] : `%${search}%`}},
                    {clientMunicipality : { [Op.like] : `%${search}%`}},
                    {clientPhoneNumber : { [Op.like] : `%${search}%`}}
                ],
            }
        });
        res.json(client);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};
