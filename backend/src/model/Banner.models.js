import mongoose from "mongoose";


const BannerSchema = new mongoose.Schema({
    bannerName:{
        type:String,
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'] // or any other valid media types
      },
    bannerImage :{
        type:String,
    },
    bannerVideo: {  
        type: String,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required : true
    }
},{timestamps:true})


const Banner = mongoose.model("Banner",BannerSchema);

export default Banner