import mongoose from "mongoose";

const contactUsAddSchema = new mongoose.Schema({
    title : {
        type:String,
    },
    virtualTourLink : {
        type : String,
    },
    address : {
        type:String,
    },
    phone_no : {
        type : String
    },
    mob_no : {
        type : String
    },
    email: {
        type: String,
    },
    fax : {
        type : String
    },
    icon : {
        type:String
    }
},{timestamps:true})

const ContactUSAddress = mongoose.model ("ContactUSAddress",contactUsAddSchema);

export default ContactUSAddress