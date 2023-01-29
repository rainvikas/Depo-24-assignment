const itemModel = require("../Models/itemModel")
const orderModel = require("../Models/orderModel")
const validator = require("../Utils/validators")
const fs = require('fs');

const pdfkit = require('pdfkit');

let doc = new pdfkit

    
    const createOrder = async function (req, res) {
        try {
            let data = req.body

            if (Object.keys(data).length == 0) {
                return res.status(400).send({
                    status: false,
                    msg: "request body can't be empty, BAD REQUEST"
                })
            }

            let { shipping, items} = data;
            for(let i=0;i<data.items.length; i++){
                let itemName = data.items[i].item;
                let isItemAvailable = await itemModel.find({name:itemName});
                if(!isItemAvailable.length){
                    return res.status(400).send({status: false, msg:`item ${itemName} is not available`})
                }
            }

            let totalQuantity = 0; itemTotal = 0; totalAmount = 0

            let totalItems = [];

           for(let i=0;i<data.items.length; i++) {
               let quantity = data.items[i].quantity;;
               totalQuantity += data.items[i].quantity;
               itemTotal = data.items.length;

               let itemName = data.items[i].item;
               let productDetails = await itemModel.findOne({itemName});

               let cgstAmount = (productDetails.rate * 9)/100;
               let sgstAmount = (productDetails.rate * 9)/100;

               let itemDetails = {
                "itemName": itemName,
                "productId": productDetails._id,
                "quantity" : quantity,
                "description": productDetails.description,
                "total" : productDetails.rate,
                "lineTotal" : (productDetails.rate + cgstAmount + sgstAmount -productDetails.discount)*quantity
               }

               totalItems.push(itemDetails);

               totalAmount += (productDetails.rate + cgstAmount + sgstAmount- productDetails.discount)*quantity;
           }

           doc.pipe(fs.createWriteStream("invoice2.pdf"));

           doc.text(shipping.name, 110, 57).fontSize(10);
           doc.text(shipping.address, 200, 65, { align: 'right' })
           doc.text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 200, 80, { align: 'right' })
           .moveDown();
           
             doc.moveTo(50,190)
             .lineTo(550,190)
             .stroke();

             //doc.fontSize(20,).text('Invoice', 50, 170);
               
               doc.text(`Invoice Number: 1234`, 50, 200)
                   .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 215)
                   .text(`Balance Due: ${totalAmount}`, 50, 230)
           
                   .text(shipping.name, 300, 200)
                   .text(shipping.address, 300, 215)
                   .text(
                       `${shipping.city}, ${shipping.state}, ${shipping.country}`,
                       300,
                       230,
                   )
                   .moveDown();
                   doc.moveTo(50,250)
                   .lineTo(550,250)
                   .stroke();
           
                   function generateTableRow(doc, y, c1, c2, c3, c4, c5,c6,c7) {
                       doc.fontSize(10)
                           .text(c1, 50, y)
                           .text(c2, 125, y)
                           .text(c3, 200, y, { width: 90, align: 'right' })
                           .text(c4, 275, y, { width: 90, align: 'right' })
                           .text(c5, 325, y, { width: 90, align: 'right' })
                           .text(c6, 400, y, { width: 90, align: 'right' })
                           .text(c7, 0, y, { align: 'right' });
                   }
           
                   generateTableRow(doc,325,"Item","description","Unit Cost", "Quantity", "CGST", "SGST", "LineTotal");
           
                   let i,
                   invoiceTableTop = 330;
           
               for (i = 0; i < totalItems.length; i++) {
                   const item = totalItems[i];
                   const position = invoiceTableTop + (i + 1) * 30;
                   generateTableRow(
                       doc,
                       position,
                       item.itemName,
                       item.description,
                       item.total / item.quantity,
                       item.quantity,
                       (item.total*9)/100*item.quantity,
                       (item.total*9)/100*item.quantity,
                       item.lineTotal,
                   );
                   
               }
           
               for(i=0;i < totalItems.length+1; i++){
                   const position = invoiceTableTop + (i + 1) * 30;
                   doc.moveTo(50,position-10)
                   .lineTo(550,position-10)
                   .stroke();
               }
           
               doc.text("Subtotal",340,invoiceTableTop+(totalItems.length*30+30));
               doc.text("Paid To Date",340,invoiceTableTop+(totalItems.length*30+50));
               doc.text("Balance Due",340,invoiceTableTop+(totalItems.length*30+70));
               doc.text(`${totalAmount}`,520,invoiceTableTop+(totalItems.length*30+30));
               doc.text("0",520,invoiceTableTop+(totalItems.length*30+50));
               doc.text(`${totalAmount}`,520,invoiceTableTop+(totalItems.length*30+70));

               doc.fontSize(
                10,
            ).text(
                'Payment is due within 15 days. Thank you for your business.',
                50,
                700,
                { align: 'center', width: 500 },
            );
            doc.fontSize(
                20,
            ).text(
                'Invoice',
                50,
                170,
            );
            
           
           doc.end();

           let dataToBeCreated = { shipping, items:totalItems, subTotal: totalAmount, totalItems: itemTotal, totalQuantity: totalQuantity}
            let orderData = await orderModel.create(dataToBeCreated);
            return res.status(201).send({
                status: true,
                msg: "order created successfully",
                data: orderData
            })
    
            
    
        }
        catch (error) {
            console.log(error)
            return res.send({ msg: error.message })
        }
    }

    const getOrders = async function (req, res) {
        try {
            let getAllOrders = await orderModel.find()
            res.send(getAllOrders)
        } catch (error) {
            console.log(error)
            res.status(500).send({
                msg: error.message
            })
        }
    }
    
    

module.exports = { createOrder, getOrders}