import express from "express";
import routes from "./src/routes/routes.js";
import connectDB from "./src/config/db.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 9000;
const db = connectDB();

routes({app})

db.then(() =>{
    app.listen(port, ()=>{
        console.log('Se levanto el proyecto');
    })
})