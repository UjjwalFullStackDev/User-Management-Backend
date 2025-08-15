const express = require('express');
const sequelize = require('./config/db');
const router = require('./routes/authRoute');
require('dotenv').config();


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const port = process.env.PORT;


sequelize.authenticate()
.then(() => console.log("Database Connected"))
.catch((err) => console.error("Error connecting DB", err))

sequelize.sync({alter: true})
.then(() => console.log("Models synced with DB"))
.catch((err) => console.error('Error syncing models: ', err))


app.use('/',router)


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})