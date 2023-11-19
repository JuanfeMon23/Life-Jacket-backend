/**
 * Developer: Felipe Monsalve
 * Email: elfuanfex@hotmail.com
 * Creation Date: oct 2023
 * 
 * Description: This script contains functions to manage operations related to application purchases which are: 
 * create, view, annular, search and create reports. Uses Express.js and Sequelize to interact with the database
 */

import {Purchase} from '../models/Purchases.model.js';
import {Client} from '../models/Clients.model.js';
import {Vehicle} from '../models/Vehicles.model.js';
import {User} from '../models/Users.model.js';
import pdf from 'html-pdf';
import { Op } from 'sequelize';
import app from '../app.js';
import { othervehicleinformation } from '../models/Othervehicleinformations.model.js';

//Function to get the list of purchases
export const getPurchases = async (req, res) => {
    try {
        //Query the database to get the list of purchases
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
        res.status(500).json({message : error.message});
    }
};

//Function to get a purchase by their ID
export const getPurchase = async (req, res) => {
    try {
        const {idPurchase} = req.params;

        //Query the database to obtain a purchase by its ID
        const purchase = await Purchase.findOne({
            where: {
                idPurchase
            },
            //include purchases related models
            include : [
                {
                    model : Client
                },
                {
                    model : Vehicle
                }
            ]
        });
        return res.status(200).json(purchase);  
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
};

//Function add a new purchase in the database
export const postPurchase = async (req, res) => {
    try {
        const {purchaseDate, purchaseFinalPrice, purchaseLimitations, purchaseDepartment, purchaseMunicipality, purchasePecuniaryPenalty, idClientPurchase, idVehiclePurchase} = req.body;

        //Function to create a new purchase
        const newPurchase = await Purchase.create({
            purchaseDate,
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

//Function to annular a purchase
export const statusPurchase = async (req, res) => {
    const { idPurchase } = req.params;

    try {
        const purchase = await Purchase.findByPk(idPurchase, {
            include: [{
                model: Vehicle
            }]
        });

        // Check if more than 20 days have passed since the purchase date
        const currentDate = new Date();
        const purchaseDate = new Date(purchase.purchaseDate);

        const timeDifference = currentDate - purchaseDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference > 20) {
            return res.status(400).json({ message: 'No puedes cambiar el estado de la compra después de 20 días' });
        }

        // Update status purchase
        await purchase.update({
            purchaseStatus: "false"
        });

        return res.status(200).json({ message: 'Compra anulada con éxito' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//Function to search for purchases based on various attributes (date, department, municipality, vehicles and client's information, etc.)
export const searchPurchase = async (req, res) => {
    const {search} = req.params;
    try {
        //Perform a search in the database
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


//function to download pdf file with purchases report
export const reportPurchase = async (req, res) => {
    //parameters
    const startDatePurchase = new Date(req.params.startDatePurchase);
    const finalDatePurchase = new Date(req.params.finalDatePurchase);
    

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

        //information is displayed in table form
        let purchasesRows = '';
        purchase.forEach(p => {
          purchasesRows += `<tr>
            <td>${p.purchaseDate}</td>
            <td>${p.purchaseFinalPrice}</td>
            <td>${p.purchaseDepartment}</td>
            <td>${p.purchaseMunicipality}</td>
            <td>${p.client.clientName}</td>
            <td>${p.client.clientLastName}</td>
            <td>${p.vehicle.licensePlate}</td>
          </tr>`;
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
                <h1>Informe de compras</h1>
                <p>Fecha del reporte: ${new Date().toLocaleDateString()}</p>
              </header>
              <table>
                <tr>
                  <th>Fecha</th>
                  <th>Precio de compra</th>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Nombre del cliente</th>
                  <th>Apellido del cliente</th>
                  <th>Placa de vehículo</th>
                </tr>
                ${purchasesRows}
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
            res.setHeader('Content-Disposition', 'attachment; filename=reporteCompra.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//function to download pdf file with purchase contract
export const contractPurchase = async (req, res) => {
    const { idPurchase } = req.params;

    try {
        const purchase = await Purchase.findByPk(idPurchase, {
            //include purchases related models
            include: [
                {
                    model: Client
                },
                {
                    model: Vehicle,
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
            return res.status(200).json({ message: 'No puedes descargar el contrato ya que la persona encargada de la compra no se encuentra registrada en usuarios' });
        }
        
        function addZeroPrefix(number) {
            return number < 10 ? '0' + number : number;
        }
        
        // Validación de fecha
        const date = purchase.purchaseDate ? new Date(purchase.purchaseDate) : null;
        
        const formattedDate = `${addZeroPrefix(date.getDate())}/${addZeroPrefix(date.getMonth() + 1)}/${date.getFullYear()}`;
        
        //Create html with the sale information
        const html = `
        <html>
        <style>
            body {
                border: 2px solid black;
                padding: 10px;
                margin: 20px;
                border-radius: 10px;
                font-family: sans-serif;
                height: 95%;
            }
            .contentone{
                align-items: flex-start;
                margin-bottom: 20px;
            }
    
            .contenttwo {
                justify-content: space-around;
                margin: 10px;
            }

            .contenttwo > div {
                border: 1px solid #000;
                border-radius: 10px;
                text-align: center;
                margin-top: 5px;
                width: 350px;
                height: 150px
            }

            .client{
                text-align: left;
                margin-left: 18px;
                text-align: justify;
            }

            .contentdiv{
                position: relative;
                left: 380px;
                top: -157px;
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
                margin: 5px;
                font-size: 16px;
            }
            .pone{
                font-weight: 400; 
                font-size: 14px;
                margin: 10px;
                text-align: justify;
                position: relative;
                top: -155px;
            }

            .poneo{
                font-weight: 400; 
                font-size: 14px;
                margin: 10px;
                text-align: justify;
                position: relative;
                top: -490px;
            }

            .ptwo{
                font-weight: 600; 
                font-size: 14px;
                margin: 10px;
                text-align: justify;
                position: relative;
                bottom: 500px;
            }
            .pthree{
                font-weight: 400; 
                font-size: 10px;
                margin: 10px;
                text-align: justify;
                position: relative;
                bottom: 500px;
            }
            .pfour{
                font-weight: 400; 
                font-size: 14px;
                margin: 10px;
                text-align: center;
                position: relative;
                bottom: 500px;
            }

            .date-box {
                align-items: center;
                margin-left: 80%
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
                position: relative;
                bottom: 490px;
            }

            .formvehicle{
                width: 250px;
                height: 300px;
                position: relative;
                top: -145px;
                margin: 20px;
                left: 70px;
                text-align: justify; 
            }

            .formvehicletwo{
                width: 250px;
                height: 300px;
                position: relative;
                top: -470px;
                margin: 5px;
                left: 430px;
                text-align: justify; 
            }

          
            .firmaone {
                text-align: center;
                position: relative;
                bottom: 391px;
                right: 225px;
            }

            .firmatwo {
                text-align: center;
                position: relative;
                left: 125px;
                bottom: 430px
            }
          
            .linea-firma {
                border-bottom: 2px solid #000;
                width: 230px;
                margin: 10px auto;
            }

            .boxonehuella{
                border: 1px solid #000;
                width: 90px;
                height: 120px;
                position: relative;
                bottom: 550px;
                left: 275px
            }

            .boxtwohuella{
                border: 1px solid #000;
                width: 90px;
                height: 120px;
                position: relative;
                bottom: 665px;
                left: 635px
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
                <div class="contentdivtwo">
                    <h2>COMPRADOR</h2>
                        <p class="client">
                        ${user.userName} ${user.userLastName}<br>
                        ${user.userTypeDocument} N° ${user.userDocument} de ${user.userMunicipality}, ${user.userDepartment}<br>
                        Dirección: ${user.userAddress}<br>
                        Teléfono: ${user.userPhoneNumber}, ${user.userOtherPhoneNumber}
                        </p>
                </div>
            
                <div class="contentdiv">
                    <h2>VENDEDOR</h2>
                        <p class="client">
                        ${purchase.client.clientName} ${purchase.client.clientLastName}<br>
                        ${purchase.client.clientTypeDocument} N° ${purchase.client.clientDocument} de ${purchase.client.clientMunicipality}, ${purchase.client.clientDepartment}<br>
                        Dirección: ${purchase.client.clientAddress}<br>
                        Teléfono: ${purchase.client.clientPhoneNumber}<br>
                        Otro contacto: ${purchase.client.clientOtherContact}, ${purchase.client.clientOtherPhoneNumber}
                        </p>
                </div>
            </div>
            <p class="pone">Por medio del presente Contrato de Compra-Venta, EL COMPRADOR declara haber recibido real y materialmente el automotor descrito en este título valor a completa y entera satisfacción y se obliga a pagar el precio en la forma pactada aquí mismo. Pago que se efectuará en la ciudad en moneda colombiana de curso legal.</p>
            
            <div class="formvehicle">
                <p>Vehículo: ${purchase.vehicle.vehicleType}</p>
                <p>Marca: ${purchase.vehicle.brand} </p>
                <p>Modelo: ${purchase.vehicle.model}</p>
                <p>Capacidad: ${purchase.vehicle.othervehicleinformation.capacity}</p>
                <p>Tipo: ${purchase.vehicle.type}</p>
                <p>Color: ${purchase.vehicle.color}</p>
                <p>Servicio: ${purchase.vehicle.othervehicleinformation.service}</p>
            </div>
            <div class="formvehicletwo">
                <p>Línea: ${purchase.vehicle.line}</p>
                <p>Motor N°: ${purchase.vehicle.othervehicleinformation.motor} </p>
                <p>Chasis N°: ${purchase.vehicle.othervehicleinformation.chassis}</p>
                <p>Serie N°: ${purchase.vehicle.othervehicleinformation.series} </p>
                <p>Placa N°: ${purchase.vehicle.licensePlate}</p>
                <p>Empresa: ${purchase.vehicle.othervehicleinformation.business}</p>
                <p>Matrícula a nombre de: ${purchase.vehicle.othervehicleinformation.register}</p>
                <p>C.C. N°: ${purchase.vehicle.othervehicleinformation.identificationCard}</p>
            </div>

            <div class="pricebox">
                El dinero concebido para esta venta, es la suma de: $${purchase.purchaseFinalPrice} COP que será pagada de la siguiente forma: ___________________________________________________
                ____________________________________________________________________________
                ____________________________________________________________________________<br>
                Limitaciones: ${purchase.purchaseLimitations}
            </div>
            <p class="poneo">
                El Vendedor garantiza que el vehículo materia de esta negaciación es de exclusiva propiedad, no soporta gravámenes o embargo alguno, y que el vehículo fue introducido legalmente al país y que sobre él no existen multas ni infracciones de tránsito y que está a paz y salvo con el Tesoro Municipal y Nacional por concepto de Impuestos.<br>
                El Vendedor se compromete por medio de la presente a devolver el valor del vehículo en venta en caso de que las autoridades civiles o de tránsito lo requieran para cualquier diligencia judicial, Penal o Aduanera. Excusado el protesto y rechazo y sin que alegue a su favor la doctrina Comprador o Vendedor de Buena Fé.
            </p>
            <p class="ptwo">
                El presente contrato presta merito ejecutivo para hacer efectivas las obligaciones contenidas en el, sin necesidad de requerimiento judicial o extrajudicial.<br>
                para todos los efectos legales del presente contrato se toma como domicilio la ciudad de ${purchase.purchaseMunicipality}, ${purchase.purchaseDepartment}.<br>
                Cabe anotar que el carro fue entregado con peritaje bajo entera satisfacción y cualquier anomalía debe ser
                atendida por el comprador.
            </p>
            <p class="pthree">Dando cumplimiento al artículo 8 de la ley 1480 del 12 de Octubre del 2011 nos permitimos informarie que el COMPRADOR declara conocer el estado actual del vehículo usado y haber verificado el funcionamiento del mismo, por lo que exime al VENDEDOR de garantia por vicios o defectos que surjan con posterioridad.</p>
            <p class="pfour">
                Vehículo usado no tiene garantia ni por parte del vendedor ni del intermediario.<br><br>
                CLAUSULA PENAL
            </p>
            <p class="ptwo">Las partes establecen como sanción pecuniaria a cargo de quien incumpla una cualquiera de las estipulaciones derivadas de este acto juridico la suma de: $${purchase.purchasePecuniaryPenalty} COP.</p>
            <p class="pfour">ACEPTADA</p>


            <div class="firmaone">
              <div class="linea-firma"></div>
              FIRMA COMPRADOR
            </div>
        
            <div class="firmatwo">
              <div class="linea-firma"></div>
              FIRMA VENDEDOR
            </div>

            <div class="boxonehuella"></div>
            <div class="boxtwohuella"></div>
            
        </body>
        </html> 
        `;

        const options = { format: 'Letter', height: '15in', width: '8.5in' };
        
        //generates the PDF and saves it to the file
        pdf.create(html, options).toStream(function(err, stream) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            //send the stream to the client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=contratoCompra.pdf');
            stream.pipe(res);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};