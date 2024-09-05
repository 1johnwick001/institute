import mongoose from "mongoose";

const bogMemberSchema = new mongoose.Schema({
    name: {
        type : String
    },
    designation: {
        type : String
    },
    companyName: {
        type : String
    },
    imageLink: {
        type : String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
    
},{timestamps:true});

const BOG = mongoose.model("BOG",bogMemberSchema);

export default BOG