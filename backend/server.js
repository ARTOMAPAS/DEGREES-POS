require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const userRoutes =require('./routes/userRoutes')
const branchRoutes = require('./routes/branchRoutes')
const itemRoutes = require('./routes/itemRoutes')
const productRoutes = require('./routes/productRoutes')
const saleRoutes = require('./routes/saleRoutes')
const inventoryEntryRoutes = require('./routes/inventoryEntryRoutes')
const reportRoutes = require('./routes/reportRoutes')
const loginRoutes = require('./routes/loginRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const orderRoutes = require('./routes/orderRoutes')
const itemTypeRoutes = require('./routes/itemTypeRoutes')
const app = express()


//middleware
app.use(express.json())

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

//Routes
app.use('/login',loginRoutes)
app.use('/user',userRoutes)
app.use('/branch',branchRoutes)
app.use('/category',categoryRoutes)
app.use('/itemType',itemTypeRoutes)
app.use('/item',itemRoutes)
app.use('/product',productRoutes)
app.use('/sale',saleRoutes)
app.use('/inventoryEntry',inventoryEntryRoutes)
app.use('/report',reportRoutes)
app.use('/order',orderRoutes)

mongoose.connect(process.env.MONGODB)
    .then(()=>{
        app.listen(process.env.PORT, ()=> {
            console.log('Connected to db and listening on port 4000')
        })
    })
    .catch((err)=>{
        console.log(err)
    })

process.env