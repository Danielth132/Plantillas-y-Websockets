import express from "express";
import productsRoutes from './routes/products.routes.js'
import cartRoutes from './routes/cart.routes.js'

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api/products',productsRoutes)
app.use('/api/carts',cartRoutes)

app.listen(PORT, async() => {
  console.log(`server run on port: ${PORT}`);
});

