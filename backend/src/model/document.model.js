import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    fileName : {
        type:String,
    } ,
    fileUrl : {
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
    },
    footerCategory: { // Add reference to footer categories
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FooterCategory',
        default: null,
    },
},{timestamps:true})

const DocFiles = mongoose.model("DocFiles",docSchema);

export default DocFiles