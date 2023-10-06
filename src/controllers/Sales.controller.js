import {Sale} from '../models/Sales.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import path from 'path';
import pdf from 'html-pdf';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';
import app from '../app.js';

export const getSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
                
            ],
        });
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : error.message});
    }
};

export const getSale = async (req,res) => {
    try {
        const {idSale} = req.params;
        
        const sale = await Sale.findOne({
            where: {
                idSale
            },
            include: [
                {
                    model : Client
                },
                {
                    model: Vehicle
                },
            ],
        });
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

export const postSale = async (req, res) => {
    try {
        const {saleDate, saleFinalPrice, saleLimitations, saleDepartment, saleMunicipality, salePecuniaryPenalty, idClientSale, idVehicleSale} = req.body;

        const vehicle = await Vehicle.findByPk(idVehicleSale);
        
        const newSale = await Sale.create({
            saleDate,
            // saleIncrementPrice,
            saleFinalPrice,
            saleLimitations,
            saleDepartment, 
            saleMunicipality,
            salePecuniaryPenalty,
            idClientSale,
            idVehicleSale
        });


        await vehicle.update({ vehicleStatus : false });

    return res.status(200).json(newSale);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const statusSale = async (req, res) => {
    const { idSale } = req.params;
    try {
        const sale = await Sale.findByPk(idSale)
        sale.saleStatus = !sale.saleStatus;

        await sale.save();
        res.json(sale);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


export const searchSale = async (req, res) => {
    const {search} = req.params;
    try {
        const sale = await Sale.findAll({
            include: [
                {
                    model: Client, 
                },
                {
                    model: Vehicle
                }
            ],
            where: {
                [Op.or]: [
                    { saleDate: { [Op.like]: `%${search}%` } },
                    { saleFinalPrice: { [Op.like]: `%${search}%` } },
                    { saleDepartment: { [Op.like]: `%${search}%` } },
                    { saleMunicipality: { [Op.like]: `%${search}%` } },
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




export const reportSale = async (req, res) => {
    //los parametros que se necesitan pa que se ejecute
    const startDateSale = new Date(req.params.startDateSale);
    const finalDateSale = new Date(req.params.finalDateSale);
    
    //para que guarde bien el reporte
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        const sale = await Sale.findAll({
            where: {
                saleDate: {
                    [Op.between]: [startDateSale, finalDateSale]
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
        let salesRows = '';
        sale.forEach(s => {
          salesRows += `<tr>
            <td>${s.idSale}</td>
            <td>${s.saleDate}</td>
            <td>${s.saleFinalPrice}</td>
            <td>${s.saleDepartment}</td>
            <td>${s.saleMunicipality}</td>
            <td>${s.client.clientName}</td>
            <td>${s.client.clientLastName}</td>
            <td>${s.vehicle.licensePlate}</td>
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
              <h1>Informe de ventas</h1>
              <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Precio de venta</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nonbre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa de vehículo</th>
                </tr>
                ${salesRows}
              </table>
            </body>
          </html>
        `;
        
        const options = { format: 'Letter' };
        
        //genera el pdf y lo guarda en el archivo
        pdf.create(html, options).toFile(path.join(__dirname, 'reporteVenta.pdf'), function(err, pdfRes) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
          }
          //se envia el pdf al cliente
          const routeArchive = path.join(__dirname, 'reporteVenta.pdf');
          res.download(routeArchive);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};















/* export const reportSale = async (req, res) => {
    const startDateSale = new Date(req.params.startDateSale);
    const finalDateSale = new Date(req.params.finalDateSale);
    try {
        const sale = await Sale.findAll({
            where: {
                saleDate: {
                    [Op.between]: [startDateSale, finalDateSale]
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

        const formattedSales = sale.map((sale) => ({
            idSale: sale.idSale,
            saleDate: sale.saleDate,
            saleFinalPrice: sale.saleFinalPrice,
            saleDepartment: sale.saleDepartment,
            saleMunicipality: sale.saleMunicipality,
            clientDocument: sale.client.clientDocument,
            clientName: sale.client.clientName,
            clientLastName: sale.client.clientLastName,
            licensePlate: sale.vehicle.licensePlate,
            vehicleType: sale.vehicle.vehicleType,
            brand: sale.vehicle.brand,
            model: sale.vehicle.model
        }));

        res.json(formattedSales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message});
    }
}; */