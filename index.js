import express  from "express"
import bootstrap from './src/bootstrap.js'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
const app = express()


const port = +process.env.PORT


bootstrap(app,express)


// const invoice = {
//   shipping: {
//     name: "John Doe",
//     address: "1234 Main Street",
//     city: "San Francisco",
//     state: "CA",
//     country: "US",
//     postal_code: 94111,
//   },
//   items: [
//     {
//       item: "TC 100",
//       description: "Toner Cartridge",
//       quantity: 2,
//       amount: 6000,
//     },
//     {
//       item: "USB_EXT",
//       description: "USB Cable Extender",
//       quantity: 1,
//       amount: 2000,
//     },
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234,
// };
// createInvoice(invoice, "invoice.pdf");



app.listen(port,()=>{
    console.log(`app running on port ${port}`);
})