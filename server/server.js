env.config()
import express from 'express';
import colors from "colors"
import env from 'dotenv'
import morgan from 'morgan';
import conneDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import cors from 'cors'

// Database config
conneDB()

const app = express()

// middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth',authRoutes)
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.get("/",(req,res)=>{
    res.send('<h1>Hello</h1>')
})

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
    
})