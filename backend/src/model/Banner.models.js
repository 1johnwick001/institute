import mongoose from "mongoose";


const BannerSchema = new mongoose.Schema({
    bannerName:{
        type:String,
    },
    bannerImage :{
        type:String,
    }
},{timestamps:true})


const BannerImage = mongoose.model("bannerImage",BannerSchema);

export default BannerImage