import mongoose from "mongoose";


const ImageSchema = new mongoose.Schema({
    imageName:{
        type:String,
    },
    image :{
        type:String,
    }
},{timestamps:true})


const Image = mongoose.model("Image",ImageSchema);

export default Image