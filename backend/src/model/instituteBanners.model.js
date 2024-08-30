import mongoose from "mongoose";


const instBannerSchema = new mongoose.Schema({
    instituteName : {
        type : String,
    },
    instituteImage:{
        type:String,
    },
    instituteIcon:{
        type:String,
    },
    instituteLink : {
        type:String,
    }
    
},{timestamps:true})

const InstituteBanner = mongoose.model("InstituteBanner",instBannerSchema);

export default InstituteBanner;