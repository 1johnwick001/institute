import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    fileName : {
        type:String,
    } ,
    fileUrl : {
        type:String
    },
    fileType: {
        type: String, // Optional: Add a field for file type (e.g., 'pdf', 'docx')
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps:true})

const DocFiles = mongoose.model("DocFiles",docSchema);

export default DocFiles