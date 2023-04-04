import express from "express";
import ProductManager from '../ProductManager.js';


let productManager = new ProductManager();
const router = express.Router()

//traer todos los productos
let consultasArch = await productManager.getProducts();

router.get('/',(req,res)=>{
    res.render('home',{
       productos:consultasArch
    })
    
})

export default router