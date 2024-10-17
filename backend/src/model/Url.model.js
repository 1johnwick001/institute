import mongoose from "mongoose";


const urlSchema = new mongoose.Schema({
    urlAddress : {
        type:String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    tab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TabsData',
        default: null
    }
},{timestamps:true})


const URL = mongoose.model("URL",urlSchema);

export default URL