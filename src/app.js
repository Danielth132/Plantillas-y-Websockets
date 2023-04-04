import express from "express";
import productsRoutes from './routes/products.routes.js'
import cartRoutes from './routes/cart.routes.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { Server } from 'socket.io'
import viewRouter from './routes/views.routes.js'
import userRoutes from './routes/users.routes.js'
import ProductManager from "./ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// configuracion de HBS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views/");
app.set('view engine', 'handlebars');

//public
app.use(express.static(__dirname+'/public/'));


app.use('/api/products',productsRoutes)
app.use('/api/carts',cartRoutes)
app.use('/api/home',viewRouter)
app.use('/api/realTimeProducts',userRoutes)

//-------------------- uso de websocket

const httpServer = app.listen(PORT,async()=>{
  console.log("Servidor escuchando puerto: "+PORT)
})


let products = [];
const pm = new ProductManager();

//configuacion para uso de socket del lado del servidor
const socketServer = new Server(httpServer)

//abrimos canal de comunicacion
socketServer.on('connection',socket=>{
  // recibir mensaje de nuevo cliente conectado
  socket.on("inicio", async (data) => {
    console.log(data);
    //traigo todos los productos y envio al cliente
    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });

  // Para eliminar producto por id
  socket.on("deleteProduct", async (data) => {
    await pm.deleteProduct(parseInt(data));
    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });

  // Para agregar producto
  socket.on("addProduct", async (data) => {
    let arrVali = pm.validaIngresos(data);

    if (arrVali[0] === 1) {
      socket.emit("error", arrVali[1]);
    } else {
      await pm.addProduct(data);
    }

    products = await pm.getProducts();
    socketServer.emit("productos", { products });
  });
  
})
