import mongoose from "mongoose";


const gallerySchema = new mongoose.Schema({
    galleryName:{
        type:String,
    },
    galleryImage :{
        type:String,
    },
    galleryVideo : {
        type:String
    },
    mediaType:{
        type:String,
        enum:['image','video']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps:true})


const Gallery = mongoose.model("Gallery",gallerySchema);

export default Gallery