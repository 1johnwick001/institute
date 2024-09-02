import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    fileName : {
        type:String,
    } ,
    fileUrl : {
        type:String
    },
    fileType: {
        type: String, 
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps:true})

const DocFiles = mongoose.model("DocFiles",docSchema);

export default DocFiles