import { Router } from 'express'
import CartManager from '../CartManager.js'
import ProductManager from '../ProductManager.js'

const router = Router()
let carts = []
const car = new CartManager()

//crear carrito
router.post('/',async(req,res)=>{
    await car.addCart()
    res.status(200).send({
        status: "Success",
        message: 'Se cargo el carrito'
    })
})
//obtener carrito por id
router.get('/:cid',async(req,res)=>{
    carts = await car.getCartById(parseInt(req.params.cid))

    if(Object.keys(carts).length === 0) {
        res.status(200).send({
            status: "info",
            error: `No se encontró el carrito con ID: ${req.params.cid}`
        })
    }else{
        res.status(200).send({ status: "Success", message: carts });
    }
})
//cargar producto a carrito
router.post('/:cid/product/:pid',async(req,res)=>{
    let cid = parseInt(req.params.cid)
    let pid = parseInt(req.params.pid)

    let carts = await car.getCartById(cid)

    //verificar existencia de id del carrito
    if(Object.keys(carts).length === 0) {
        res.status(200).send({
            status: "info",
            error: `No se encontró el carrito con ID: ${req.params.cid}`
        })
    }else{
        let productArray = await new ProductManager().getProductById(pid);

        /* Verifico si existe el id del producto en el maestro de productos  */
        if (productArray[0] === 1) {
            res.status(202).send({
              status: "info",
              error: `Se encontró carrito con ID: ${cid} pero No se encontró el producto con Id: ${pid}`,
            });
        }else {
            /* Existe el id del carrito y el id del producto en el maestro de productos */
            car.addProductCart(cid, pid);
      
            res.status(200).send({
              status: "Success",
              message: `Se agrego-actualizó el producto Id: ${pid} en el carrito con Id: ${cid}`,
            });
          }
    }
})
export default router