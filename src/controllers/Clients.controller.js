import {Client} from '../models/Clients.model.js';
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

export const postClient = async (req, res) => {
    try {
        const {clientDocument, clientName, clientLastName, clientExpeditionPlace, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber, clientStatus} = req.body;

        const newClient = await Client.create({
            clientDocument,
            clientName,
            clientLastName,
            clientExpeditionPlace,
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
        const {clientDocument, clientName, clientLastName, clientExpeditionPlace, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber, clientStatus} = req.body;

        const client = await Client.findByPk(idClient)

        client.clientDocument = clientDocument
        client.clientName = clientName
        client.clientLastName = clientLastName
        client.clientExpeditionPlace = clientExpeditionPlace
        client.clientAddress = clientAddress
        client.clientPhoneNumber = clientPhoneNumber
        client.clientOtherContact = clientOtherContact
        client.clientOtherPhoneNumber = clientOtherPhoneNumber
        client.clientStatus = clientStatus

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


export const searchClient  = async (req, res) => {
    const {search} = req.params;
    try {
        const client = await Client.findAll({
            where : {
                [Op.or]: [
                    {clientDocument : { [Op.like] : `%${search}%`}},
                    {clientName : { [Op.like] : `%${search}%`}},
                    {clientLastName : { [Op.like] : `%${search}%`}}
                ],
            }
        });
        res.json(client);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};
