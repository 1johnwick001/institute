import express from "express";
import dotenv from "dotenv";
import ImageKit from "imagekit"
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
app.use(express.json({ limit: '50mb' })); 
// middleware to parse url-encoded form data
app.use(express.urlencoded({
    extended:true,
    limit: '50mb'
}));
app.use(cors());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads/media',express.static(path.join(path.resolve(),'uploads/media')))


// configuring Routes
app.use(adminRoutes); //routes for admin auth
app.use(allRoutes); //routes for all general routing

// Initialize ImageKit instance
const imagekit = new ImageKit ({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT,
})

const port = process.env.PORT || 8080;

app.get('/',(req, res) => {
    res.send('Hello from server side')
});

// Define the authentication endpoint
app.get('/api/imagekit-auth', (req, res) => {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    // console.log('Authentication Parameters:', authenticationParameters);
    res.json(authenticationParameters);
  });

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});