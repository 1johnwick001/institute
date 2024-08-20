import mongoose from "mongoose"



const MONGO_URL = process.env.MONGO_URL

// connection for connecting backend to chameli devi db


const connectDB = async() => {
    try {
        const connection = await mongoose.connect(`${MONGO_URL}`)
        console.log(`\n ====MONGODB connected successfully ====`);
    } catch (error) {
        console.log("mongo DB connection error, error while connecting DB by url___",error);
    }
}

export default connectDB