import {Purchase} from '../models/Purchases.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import path from 'path';
import pdf from 'html-pdf';
import { fileURLToPath } from 'url';
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
        const {purchaseDate, purchaseFinalPrice, purchaseLimitations, purchaseDepartment, purchaseMunicipality, purchasePecuniaryPenalty, idClientPurchase, idVehiclePurchase} = req.body;
        
        const vehicle = await Vehicle.findByPk(idVehiclePurchase);

        const newPurchase = await Purchase.create({
            purchaseDate,
            // purchaseIncrementPrice,
            purchaseFinalPrice,
            purchaseLimitations,
            purchaseDepartment,
            purchaseMunicipality,
            purchasePecuniaryPenalty,
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
    //los parametros que se necesitan pa que se ejecute
    const startDatePurchase = new Date(req.params.startDatePurchase);
    const finalDatePurchase = new Date(req.params.finalDatePurchase);
    
    //para que guarde bien el reporte
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        const purchase = await Purchase.findAll({
            where: {
                purchaseDate: {
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

        //para mostrarlo en forme de tabla
        let purchasesRows = '';
        purchase.forEach(p => {
          purchasesRows += `<tr>
            <td>${p.idPurchase}</td>
            <td>${p.purchaseDate}</td>
            <td>${p.purchaseFinalPrice}</td>
            <td>${p.purchaseDepartment}</td>
            <td>${p.purchaseMunicipality}</td>
            <td>${p.client.clientName}</td>
            <td>${p.client.clientLastName}</td>
            <td>${p.vehicle.licensePlate}</td>
          </tr>`;
        });
        
        //codigo html
        const html = `
          <html>
            <head>
              <style>
                /* css */
              </style>
            </head>
            <body>
              <h1>Informe de compras</h1>
              <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Precio de compra</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nonbre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa de vehículo</th>
                </tr>
                ${purchasesRows}
              </table>
            </body>
          </html>
        `;
        
        const options = { format: 'Letter' };
        
        //genera el pdf y lo guarda en el archivo
        pdf.create(html, options).toFile(path.join(__dirname, 'reportePurchase.pdf'), function(err, pdfRes) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
          }
          //se envia el pdf al cliente
          const routeArchive = path.join(__dirname, 'reportePurchase.pdf');
          res.download(routeArchive);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};















/* export const reportPurchase = async (req, res) => {
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

        const formattedPurchases = purchase.map((purchase) => ({
            idPurchase: purchase.idPurchase,
            purchaseDate: purchase.purchaseDate,
            purchaseFinalPrice: purchase.purchaseFinalPrice,
            purchaseDepartment: purchase.purchaseDepartment,
            purchaseMunicipality: purchase.purchaseMunicipality,
            clientDocument: purchase.client.clientDocument,
            clientName: purchase.client.clientName,
            clientLastName: purchase.client.clientLastName,
            licensePlate: purchase.vehicle.licensePlate,
            vehicleType: purchase.vehicle.vehicleType,
            brand: purchase.vehicle.brand,
            model: purchase.vehicle.model
        }));

        res.json(formattedPurchases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
};  */