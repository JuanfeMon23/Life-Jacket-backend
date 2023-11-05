/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application clients which are: 
 * create, view, edit, disable, delete and search. Uses Express.js and Sequelize to interact with the database
 */

import {Client} from '../models/Clients.model.js';
import { Op , Sequelize  } from 'sequelize';
import app from '../app.js';
import { Sale } from '../models/Sales.model.js';
import { Purchase } from '../models/Purchases.model.js';
import { Exchange } from '../models/Exchanges.model.js';

//Function to get the list of clients
export const getClients = async (req, res) => {
    try {
        //Query the database to get the list of clients
        const clients = await Client.findAll({
            include: [
                {
                    model : Sale
                },
                {
                    model : Purchase
                },
                {
                    model : Exchange
                }
            ]
        }); 
        
        res.json(clients);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//Function to get a client by their ID
export const getClient = async (req,res) => {
    try {
        const {idClient} = req.params;
        
        //Query the database to obtain a client by its ID
        const client = await Client.findOne({
            where: {
                idClient
            },
            include: [
                {
                    model : Sale
                },
                {
                    model : Purchase
                },
                {
                    model : Exchange
                }
            ]
        })
        res.json(client)
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

//Function add a new client in the database
export const postClient = async (req, res) => {
    try {
        const {clientTypeDocument, clientDocument, clientName, clientLastName, clientDepartment, clientMunicipality, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber, clientStatus} = req.body;
        
        const foundDocument = await Client.findOne({where : {clientDocument}});
        if(foundDocument) return res.status(400).json({message : 'Documento ya registrado.'});



        //Function to create a new client
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

//Feature to update an existing client's information
export const updateClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const {clientName, clientLastName, clientDepartment, clientMunicipality, clientAddress, clientPhoneNumber, clientOtherContact, clientOtherPhoneNumber} = req.body;

        // Search for the client by their ID
        const client = await Client.findByPk(idClient);
        
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

//Function to change the status (enabled/disabled) of a client
export const statusClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const client = await Client.findByPk(idClient)

        //Change of client status and saving in the database
        client.clientStatus = !client.clientStatus;

        await client.save();
        res.json(client);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a client if they have no associated sales, purchases or exchanges
export const deleteClient = async (req, res) => {
    const { idClient } = req.params;
    try {
        const client = await Client.findByPk(idClient)

        // Count the number of sales, purchases and exchanges associated with the client
        const saleCount = await client.countSales();
        const purchaseCount = await client.countPurchases();
        const exchangeCount = await client.countExchanges();

        //Check if the client has associated sales, purchases and exchanges and prevent deletion
        if (saleCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un cliente con ventas asociadas"});
        }
        if (purchaseCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un cliente con compras asociadas"});
        }
        if (exchangeCount > 0){
            return res.status(400).json({ message :"No se puede eliminar un cliente con intercambios asociados"});
        }
        
        await client.destroy();
        
        return res.status(200).json({ message: 'Cliente eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to search for clients based on various attributes (document, name, department, etc.)
export const searchClient  = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
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
