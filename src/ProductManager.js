import fs from "fs"

class ProductManager {

    constructor(){
        this.products = [];
        this.userDirPath = "./files";
        this.usersFilePath = this.userDirPath + "/Productos.json";
        this.fileSystem = fs;  
    }

    getLength = async() => {
        try {
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");

            this.products = JSON.parse(productosFile)

            return this.products.length
        }catch (error) {
            console.error(`ERROR agregando Productos: ${error}`);
        }
        
    }
    getProductByCode = (code) => {
        for (const obj of this.products) if (obj.code === code) return obj;
    };

    validaIngresos = (product) => {
        if (
          product.title == "" ||
          product.description == "" ||
          product.price == "" ||
          product.thumbnail == "" ||
          product.code == "" ||
          product.stock == "" ||
          product.status == "" ||
          product.category == ""
        ) {
          return [1, "Existen parámetros de ingreso en blanco"];
        }
        if (
          product.title == undefined ||
          product.description == undefined ||
          product.price == undefined ||
          product.thumbnail == undefined ||
          product.code == undefined ||
          product.stock == undefined ||
          product.status == undefined ||
          product.category == undefined
        ) {
          return [1, "Faltan parámetros de ingreso"];
        }
    
        if (this.getProductByCode(product.code) != undefined) {
          return [1, `El código ya existe para otro producto`];
        }
    
        return [0, "Validaciones OK"];
    };
    

    generateID = ()=>{
        if (this.products.length === 0) {
            return 0
        } else{
            let id = this.products[(this.products.length) - 1].id + 1
            return id
        }
    }
    
    valideCode = (code) =>{
        let estaCod = false
        this.products.map((prod)=>{
            if(prod.code === code){
                estaCod = true
                return estaCod
            }
        })
        return estaCod
    }

    addProduct = async({title,description,price,thumbnail,code,stock,status,category})=>{
        const producto = {
            id:0,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code ,
            stock: stock,
            status: status,
            category: category
        }
        
        try {
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");

            this.products = JSON.parse(productosFile)

            if (this.validaIngresos(producto)[0] == 0) {
                producto.id = this.generateID()
                
                this.products.push(producto)

                await this.fileSystem.promises.writeFile(this.usersFilePath, JSON.stringify(this.products));
                    
                console.log("Se agrego el producto " + title)
                
            }
        } catch (error) {
            console.error(`ERROR agregando Productos: ${error}`);
        }
        
        
    }
    getProducts = async()=>{
        try {
            
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");
            
            this.products = JSON.parse(productosFile);
            return this.products;

        } catch(error){
            
            console.error(`detalle del error: ${error}`);
            throw Error(` detalle del error: ${error}`);    
        }
    }
    getProductById = async(id)=>{

        try {
            
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");
            
            this.products = JSON.parse(productosFile);
            
            let exito = false
            let index = 0
            this.products.map((prod,indice)=>{
                if (prod.id === id){
                    exito = true
                    index = indice
                }
            })

            if(exito){
                return this.products[index]

            }else{
                console.log("Not Found")
                return [1,'No se encontro id']
            }
        } catch(error){
            console.error(`detalle del error: ${error}`);
            throw Error(` detalle del error: ${error}`);
                
        }
        
    }

    updateProduct = async(id,product)=>{
        try {
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                    await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }
                
            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");
                 
            this.products = JSON.parse(productosFile);

            let find = false
            let index = 0
            this.products.map((prod,indice)=>{
                if (prod.id === id) {
                    
                    find = true
                    index = indice
                }
            })

            if (find) {

                let estaCod = this.valideCode(product.code)
                if (estaCod && this.products[index].code !== product.code ) {
                    {
                        return [1, "El code ya existe, no se modifico el producto con ID: " + id];
                    }
                } else {
                    this.products[index].title = product.title
                    this.products[index].description = product.description
                    this.products[index].price = product.price
                    this.products[index].thumbnail = product.thumbnail
                    this.products[index].code = product.code
                    this.products[index].stock = product.stock
                    this.products[index].status = product.status
                    this.products[index].category = product.category
                    
                    await this.fileSystem.promises.writeFile(this.usersFilePath, JSON.stringify(this.products));
       
                    {
                        return [0, "Se actualizo el producto con ID: "];
                    }
                }
            }
                

        } catch (error) {
            console.error(`ERROR actualizando Producto: ${error}`);
        }
        
    }

    deleteProduct = async(id)=>{
        try {
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }
            
            let productosFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");
            
            this.products = JSON.parse(productosFile);

            this.products = this.products.filter((product) => product.id !== id)

            await this.fileSystem.promises.writeFile(this.usersFilePath, JSON.stringify(this.products));
           
            console.log("Se actualizaron los productos ")
        } catch(error) {
            console.error(`detalle del error: ${error}`);
            throw Error(` detalle del error: ${error}`);
        }
    }

}

export default ProductManager
