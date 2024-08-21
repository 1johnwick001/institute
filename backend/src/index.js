import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./db/db.connection.js";

import adminRoutes from "./routes/Admin.routes.js";
import allRoutes from "./routes/routes.js";



dotenv.config({
    path:'./env'
});

// db function
connectDB();

const app = express()

//middlewares
app.use(express.json());
// middleware to parse url-encoded form data
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads/images',express.static(path.join(path.resolve(),'uploads/images')))


// configuring Routes
app.use(adminRoutes); //routes for admin auth
app.use(allRoutes); //routes for all general routing



const port = process.env.PORT || 8080;

app.get('/',(req, res) => {
    res.send('Hello from server side')
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route working!' });
});

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});