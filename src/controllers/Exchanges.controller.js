/**
 * Developer: Yenifer Salazar
 * Email: yensalazarrestrepo@gmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application exchanges which are: 
 * create, view, annular, search and create reports. Uses Express.js and Sequelize to interact with the database
 */

import {Exchange} from '../models/Exchanges.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import {Improvements} from '../models/Improvements.model.js';
import { Purchase } from '../models/Purchases.model.js';
import { User } from '../models/Users.model.js';
import {ExchangesDetails} from '../models/ExchangesDetails.model.js';
import { othervehicleinformation } from '../models/Othervehicleinformations.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';
import { Sale } from '../models/Sales.model.js';

//Function to get the list of exchanges
export const getExchanges = async (req, res) => {
    try {
        //Query the database to get the list of exchanges
        const exchanges = await Exchange.findAll({
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange' //Includes the vehicles that are part of the exchange detail
                }
            ]
        });
        res.json(exchanges);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//Function to get a exchange by their ID
export const getExchange = async (req,res) => {
    try {
        const {idExchange} = req.params;

        //Query the database to obtain a exchange by its ID
        const exchange = await Exchange.findAll({
            where: {
                idExchange
            },
            //include exchanges related models
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange' //Includes the vehicles that are part of the exchange detail
                }
            ]
        });

        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
};

//Function add a default exchange in the database
export const postExchange = async (req, res) => {
     try {
        //Function to create a default exchange 
        const newExchange = await Exchange.create({
            exchangeDate : "01/01/2023",
            exchangeCashPrice : 0,
            exchangeLimitations : "Ninguna",
            exchangeDepartment : "",
            exchangeMunicipality : "",
            exchangePecuniaryPenalty : 0,
            idClientExchange : 1
        });

        return res.status(200).json(newExchange);

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function update default exchange in the database
export const updateExchange = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {exchangeDate, exchangeCashPrice, exchangeCashPriceStatus, exchangeLimitations, exchangeDepartment, exchangeMunicipality, exchangePecuniaryPenalty, idClientExchange} = req.body;

        //Query the database to obtain a purchase by its ID
        const exchange = await Exchange.findByPk(idExchange); 

        exchange.exchangeDate = exchangeDate
        exchange.exchangeCashPrice = exchangeCashPrice
        exchange.exchangeCashPriceStatus = exchangeCashPriceStatus
        exchange.exchangeLimitations = exchangeLimitations
        exchange.exchangeDepartment = exchangeDepartment
        exchange.exchangeMunicipality = exchangeMunicipality
        exchange.exchangePecuniaryPenalty = exchangePecuniaryPenalty
        exchange.idClientExchange = idClientExchange

        await exchange.save()
        return res.status(200).json(exchange);
   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};

//Function add a new exchange detail in the database
export const postExchangeDetail = async (req, res) => {
    const {idExchange} = req.params;
    try {
        const {idVehicleExchange, vehicleStatusExchange} = req.body;

        const vehicle = await Vehicle.findByPk(idVehicleExchange)
        
        const newExchangeDetail = await ExchangesDetails.create({
            idExchangeVehicle: idExchange, 
            idVehicleExchange,
            vehicleStatusExchange
        });

        const vehicleStatusExchangeValue = newExchangeDetail.vehicleStatusExchange

        if(vehicleStatusExchangeValue === "false"){
            await vehicle.update({ vehicleStatus : "false" });
        }else{
            await vehicle.update({ vehicleStatus : "true" })
        }

       return res.status(200).json(newExchangeDetail);

   } catch (error) {
       return res.status(500).json({message : error.message});
   }
};


//Function to cancel the default exchange
export const cancelExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        //Query the database to obtain a exchange by its ID
        const exchange = await Exchange.findByPk(idExchange);

        await exchange.destroy();

        const exchangesD = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            }
        });

        for (const exchangeDetail of exchangesD) {
            await exchangeDetail.destroy();
        }

        return res.status(200).json({ message: 'Intercambio cancelado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to delete a exchange detail
export const deleteExchangeDetail = async (req, res) => {
    const { idExchangeDetail } = req.params;
    try {
        const exchangeD = await ExchangesDetails.findByPk(idExchangeDetail);

        await exchangeD.destroy();

        return res.status(200).json({ message: 'Detalle de intercambio eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


//Function to annular a exchange
export const statusExchange = async (req, res) => {
    const { idExchange } = req.params;
    try {
        const exchange = await Exchange.findByPk(idExchange, {
            include : [{
                model : Client
            }]
        });

        // Check if more than 20 days have passed since the exchange date
        const currentDate = new Date();
        const exchangeDate = new Date(exchange.exchangeDate);

        const timeDifference = currentDate - exchangeDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 20) {
            return res.status(400).json({ message: 'No puedes cambiar el estado del intercambio después de 20 días' });
        }

        const exchangeDetails = await ExchangesDetails.findAll({
            where: {
              idExchangeVehicle: idExchange
            }
          });

        for (const exchangeDetail of exchangeDetails) {
            if (exchangeDetail.vehicleStatusExchange === "false") {
                await exchangeDetail.Vehicle.update({
                    vehicleStatus: "true"
                });
            }
            await exchangeDetail.update({
                vehicleStatusExchange : "anulado"
            });
        }

        //Update the exchange status
        await exchange.update({
            exchangeStatus : "false"
        });

        return res.status(200).json({ message: 'Intercambio anulado con éxito' });

    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function to search for exchanges based on various attributes (date, department, municipality, vehicles and client's information, etc.)
export const searchExchange = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
        const exchange = await Exchange.findAll({
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange'
                }
            ],
            where: {
                [Op.or]: [
                    {exchangeDate: { [Op.like]: `%${search}%` } },
                    {exchangeDepartment: { [Op.like]: `%${search}%` } },
                    {exchangeMunicipality: { [Op.like]: `%${search}%` } },
                    {'$Client.clientDocument$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientName$': { [Op.like]: `%${search}%` } },
                    {'$Client.clientLastName$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.licensePlate$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.vehicleType$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.brand$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.model$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.type$': { [Op.like]: `%${search}%` } },
                    {'$vehiclesExchange.line$': { [Op.like]: `%${search}%` } }
                ],
            },
        });

        res.json(exchange);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};


//function to download pdf file with exchanges report
export const reportExchange = async (req, res) => {
    //parameters
    const startDateExchange = new Date(req.params.startDateExchange);
    const finalDateExchange = new Date(req.params.finalDateExchange); 

    try {
        const exchange = await Exchange.findAll({
            where: {
                exchangeDate: {
                    [Op.between]: [startDateExchange, finalDateExchange]
                }
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange'
                }
            ],
        });

        //information is displayed in table form
        let exchangesRows = '';
        exchange.forEach(e => {
            exchangesRows += `<tr>
            <td>${e.exchangeDate}</td>
            <td>${e.exchangeCashPrice}</td>
            <td>${e.exchangeDepartment}</td>
            <td>${e.exchangeMunicipality}</td>
            <td>${e.client.clientName}</td>
            <td>${e.client.clientLastName}</td>
            <td>`;
        
        // Add vehicle´s license plate
        e.vehiclesExchange.forEach(vehicle => {
            exchangesRows += `${vehicle.licensePlate}, `;
        });

        exchangesRows += '</td></tr>';
        });
        
        //code html
        const html = `
            <html>
            <head>
            <style>
                body {
                font-family: 'Arial', sans-serif;
                background-color: white;
                color: black;
                margin: 0;
                padding: 0;
                }

                header {
                    text-align: center;
                    margin-top: 20px;
                }
        
                h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #000000;
                }
            
                h2 {
                    margin-top: 10px;
                    font-size: 1.5rem;
                    color: #0D0628;
                    text-align: center;
                }
        
                p {
                color: #808080;
                text-align: center;
                }
        
                table {
                border-collapse: collapse;
                width: 100%;
                margin-top: 20px;
                }
        
                th, td {
                border: 1px solid #27336F;
                padding: 10px;
                text-align: left;
                }
        
                th {
                background-color: #27336F;
                color: white;
                }
        
                tr:nth-child(even) {
                background-color: white;
                }
        
                tr:hover {
                background-color: #f2f2f2;
                }
            </style>
            </head>
            <body>
            <header>
                <h2>LifeJacket</h2>
                <h1>Informe de intercambios</h1>
                <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
            </header>
            <table>
                <tr>
                <th>Fecha</th>
                <th>Efectivo involucrado</th>
                <th>Departamento</th>
                <th>Municipio</th>
                <th>Nombre del cliente</th>
                <th>Apellido del cliente</th>
                <th>Placa</th>
                </tr>
                ${exchangesRows}
            </table>
            </body>
        </html>
      
      
        `;
        
        const options = { format: 'Letter' };
        
        //generates the PDF and saves it to the file
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporteIntercambio.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//function to download pdf file with exchange contract
export const contractExchange = async (req, res) => {
    const { idExchange } = req.params;

    try {
        const exchange = await Exchange.findByPk(idExchange, {
            //include exchanges related models
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
                    as: 'vehiclesExchange',
                    include: [
                        {
                            model: othervehicleinformation,

                        }
                    ]
                }
            ]
        });

        const user = await User.findOne({
            where: {
                userDocument : process.env.DOCUMENT
            },
        });

        if (!user) {
            return res.status(200).json({ message: 'No puedes descargar el contrato ya que la persona encargada del intercambio no se encuentra registrada en usuarios' });
        }
        

        function addZeroPrefix(number) {
            return number < 10 ? '0' + number : number;
        }

        const date = exchange.exchangeDate;
        const formattedDate = `${addZeroPrefix(date.getDate())}/${addZeroPrefix(date.getMonth() + 1)}/${date.getFullYear()} ${addZeroPrefix(date.getHours())}:${addZeroPrefix(date.getMinutes())}`;
        
        //Create html with the exchange information
        const html = `
        <html>
        <style>
            .contentone{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 20px;
            }
    
            .contenttwo {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center; 
            }

            .contenttwo > div {
                border: 1px solid #000;
                border-radius: 10px;
                text-align: center;
              }

            h1 {
                color: black; 
                font-weight: 700; 
                font-size: 22px ;
                text-align: center;
                margin-bottom: 15px;
                margin-top: 20px; 
            }
            h2 {
                text-align: center;
                margin: 2px;
                font-size: 15px;
            }
            .pone{
                font-weight: 400; 
                font-size: 14px;
                margin: 10px;
                text-align: justify;
            }

            .ptwo{
                font-weight: 600; 
                font-size: 14px;
                margin: 10px;
                text-align: justify;
            }
            .pthree{
                font-weight: 400; 
                font-size: 10px;
                margin: 10px;
                text-align: justify;
            }
            .pfour{
                font-weight: 400; 
                font-size: 14px;
                margin: 10px;
                text-align: center;
            }
            body {
                border: 2px solid black;
                padding: 10px;
                margin: 20px;
                border-radius: 10px;
                font-family: sans-serif;
            }
            .date-box {
                display: flex;
                align-items: center;
                margin-left: 75%
            }
            .date-part {
                border: 1px solid #000;
                padding: 3px;
                box-sizing: border-box;
                display: inline-block;
            }
            .pricebox{
                border: 1px solid #000;
                padding: 20px; 
                margin: 10px;
                overflow-wrap: break-word;
                border-radius: 10px;
                text-align: justify; 
            
            }
        
            table {
                width: 100%;
                margin-top: 20px;
            }
            
            table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
            }
            
            th, td {
                padding: 8px;
                text-align: left;
            }
        </style>
        <body>

            <h1>CONTRATO DE COMPRAVENTA</h1>

            <div class="contentone">
                <div class="date-box">
                    Fecha: <div class="date-part">${formattedDate}</div>
                </div>
            </div>
            <div class="contenttwo">
                <div>
                    <h2>Comprador</h2>
                    ${exchange.client.clientTypeDocument}
                    ${exchange.client.clientDocument}
                    ${exchange.client.clientName}
                    ${exchange.client.clientLastName}
                    ${exchange.client.clientDepartment}
                    ${exchange.client.clientMunicipality}
                    ${exchange.client.clientAddress}
                    ${exchange.client.clientPhoneNumber}
                    ${exchange.client.clientOtherContact}
                    ${exchange.client.clientOtherPhoneNumber}
                </div>
            
                <div>
                    <h2>Vendedor</h2>
                    ${user.userTypeDocument}
                    ${user.userDocument}
                    ${user.userName}
                    ${user.userLastName}
                    ${user.userDepartment}
                    ${user.userMunicipality}
                    ${user.userAddress}
                    ${user.userPhoneNumber}
                    ${user.userOtherPhoneNumber}
                </div>
            </div>
            <p class="pone">Por medio del presente Contrato de Compra-Venta, EL COMPRADOR declara haber recibido real y materialmente el automotor descrito en este título valor a completa y entera satisfacción y se obliga a pagar el precio en la forma pactada aqui mismo. Pago que se efectuará en la ciudad en moneda colombiana de curso legal.</p>
            <table border="1">
            <tr>
            </tr>
            ${exchange.vehiclesExchange.map(vehicle => `
                <tr>
                    <td>${vehicle.licensePlate}</td>
                    <td>${vehicle.vehicleType}</td>
                    <td>${vehicle.brand}</td>
                    <td>${vehicle.model}</td>
                    <td>${vehicle.type}</td>
                    <td>${vehicle.line}</td>
                    <td>${vehicle.color}</td>
                    <td>${vehicle.othervehicleinformation.business}</td>
                    <td>${vehicle.othervehicleinformation.series}</td>
                    <td>${vehicle.othervehicleinformation.motor}</td>
                    <td>${vehicle.othervehicleinformation.register}</td>
                    <td>${vehicle.othervehicleinformation.chassis}</td>
                    <td>${vehicle.othervehicleinformation.capacity}</td>
                    <td>${vehicle.othervehicleinformation.service}</td>
                    <td>${vehicle.othervehicleinformation.identificationCard}</td>
                    
                </tr>
            `).join('')}
            </table>
            <div class="pricebox">
                El dinero en efectivo convenido para este intercambio, es la suma de: $${exchange.exchangeCashPrice} COP que será pagado de la siguiente forma: ___________________________________________________
                ____________________________________________________________________________
                ____________________________________________________________________________
                Limitaciones: ${exchange.exchangeLimitations}
            </div>
            <p class="pone">
                El Vendedor garantiza que el vehículo materia de esta negaciación es de exclusiva propiedad, no soporta gravámenes o embargo alguno, y que el vehículo fue introducido legalmente al país y que sobre él no existen multas ni infracciones de tránsito y que está a paz y salvo con el Tesoro Municipal y Nacional por concepto de Impuestos.<br>
                El Vendedor se compromete por medio de la presente a devolver el valor del vehículo en venta en caso de que las autoridades civiles o de tránsito lo requieran para cualquier diligencia judicial, Penal o Aduanera. Excusado el protesto y rechazo y sin que alegue a su favor la doctrina Comprador o Vendedor de Buena Fé.
            </p>
            <p class="ptwo">
                El presente contrato presta merito ejecutivo para hacer efectivas las obligaciones contenidas en el, sin necesidad de requerimiento judicial o extrajudicial.<br>
                para todos los efectos legales del presente contrato se toma como domicilio la ciudad de ${exchange.exchangeMunicipality}, ${exchange.exchangeDepartment}.<br>
                Cabe anotar que el carro fue entregado con peritaje bajo entera satisfacción y cualquier anomalía debe ser
                atendida por el comprador.
            </p>
            <p class="pthree">Dando cumplimiento al artículo 8 de la ley 1480 del 12 de Octubre del 2011 nos permitimos informarie que el COMPRADOR declara conocer el estado actual del vehículo usado y haber verificado el funcionamiento del mismo, por lo que exime al VENDEDOR de garantia por vicios o defectos que surjan con posterioridad.</p>
            <p class="pfour">
                Vehículo usado no tiene garantia ni por parte del vendedor ni del intermediario.<br><br>
                CLAUSULA PENAL
            </p>
            <p class="ptwo">Las partes establecen como sanción pecuniaria a cargo de quien incumpla una cualquiera de las estipulaciones derivadas de este acto juridico la suma de: $${exchange.exchangePecuniaryPenalty} COP.</p>



            
        </body>
        </html> 
        `;

        const options = { format: 'Letter' };
        
        //generates the PDF and saves it to the file
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=contratoCambio.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};