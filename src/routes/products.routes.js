import { Router } from 'express';
import ProductManager from '../ProductManager.js';

let productManager = new ProductManager();
const router = Router();


let products = []

//traer todos los productos o limit
router.get('/', async(request, response) => {
    
    let consultasArch = await productManager.getProducts();
    let consultas = request.query

    let numLimit = parseInt(consultas.limit) 

    if (numLimit) {
        let consultLimit = [];
    for (let i = 0; i < numLimit && i < consultasArch.length ; i++) {
      consultLimit.push(consultasArch[i]);
    }
    response.send(consultLimit);

    } else {
        response.send(consultasArch);
    }

});

//subir producto
router.post('/',async(req,res)=>{
    let product = req.body
    
    let arrVali = productManager.validaIngresos(product);

    if (arrVali[0] === 1) {
        res.status(400).send({ status: "Error", message: arrVali[1] });
    } else {
        await productManager.addProduct({...product})

        res.status(200).send({
        status: "Success",
        message: `Se cargo el producto Cod: ${product.code}`,
        });
    }
    
    
})

//buscar por id
router.get('/:pid', async(req, res) => {
    let pid = parseInt(req.params.pid) 
    let producto = await productManager.getProductById(pid)
    
    
    if (producto) {
        res.send(producto) 
        console.log("Producto encontrado")
    }else{
      res.send({ messasge: "Producto no encontrado!!" })
    }
    
})

router.put("/:pid", async (req, res) => {
    let user = req.body;
    let pid = parseInt(req.params.pid);
    
    let lengthProducts =  await productManager.getLength()

    if (pid < 0 || pid > lengthProducts ) {
        res.status(400).send({ status: "Error", message: "Numero fuera de limite" });
    }else {
        let update = await productManager.updateProduct(pid, user);
        //console.log(update)
        if ( update[0] === 1 ) {
            //await productManager.updateProduct(pid, user);
            res.status(400).send({ status: "Error", message: update[1] });
        
        }else {
            res.status(200).send({
                status: "Success",message: `${update[1]} ${pid}`
            })
        }
    }    
});

//eliminar producto
router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.status(200).send({
      status: "Success",
      message: `Se eliminó el producto ID: ${req.params.pid}`,
    });
  });

export default router;
