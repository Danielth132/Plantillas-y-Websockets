import fs from 'fs'

class CartManager {
    constructor() {
        this.carts = [];
        this.userDirPath = "./files";
        this.usersFilePath = this.userDirPath + "/Carts.json";
        this.fileSystem = fs;
    }

    generateCartID = ()=>{
        if (this.carts.length === 0) {
            return 0
        } else{
            let id = this.carts[(this.carts.length) - 1].id + 1
            return id
        }
    }

    addCart = async()=>{
        const cart = {
            id:0,
            products:[]
        }

        try {
            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            let cartsFile = await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8");

            this.carts = JSON.parse(cartsFile)

            cart.id = this.generateCartID()
            this.carts.push(cart)

            await this.fileSystem.promises.writeFile(this.usersFilePath, JSON.stringify(this.carts));

            console.log("Se agrego el cart ")

        } catch (error) {
            console.error(`ERROR agregando Carrito: ${error}`)
        }
    }

    addProductCart = async(cid,pid)=>{
        try {
            let flag = 0

            await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
            if (!this.fileSystem.existsSync(this.usersFilePath)) {
                await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
            }

            this.carts = JSON.parse(await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8"))

            for (const obj of this.carts) {
                if (obj.id === cid) {
                    for (const ob of obj.products){
                        if(ob.id ===pid){
                            ob.quantity++
                            flag = 1
                        }
                    }

                    if (flag === 0){
                        let newP = {
                            id:pid,
                            quantity:1
                        }
                        obj.products.push(newP)
                    }
                }
                
            }
            await this.fileSystem.promises.writeFile(this.usersFilePath, JSON.stringify(this.carts));

        } catch (error) {
            console.error(`ERROR no se pudo agregar el producto al carrito ${error}`);
        }
    }

    getCartById = async (id) => {
        try {
          let prod = {};
          
          await this.fileSystem.promises.mkdir(this.userDirPath, { recursive: true });
          if (!this.fileSystem.existsSync(this.usersFilePath)) {
              await this.fileSystem.promises.writeFile(this.usersFilePath, "[]");
          }

          let arrayP = JSON.parse(await this.fileSystem.promises.readFile(this.usersFilePath, "utf-8"))
          
          for (const obj of arrayP) if (obj.id === id) prod = { ...obj };
    
          return prod;
        } catch (err) {
          console.error(`ERROR obteniendo el Carrito por ID: ${err}`);
        }
    };
    
}

export default CartManager