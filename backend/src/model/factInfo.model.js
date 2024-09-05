import mongoose from "mongoose";

const factSchema = new mongoose.Schema({
    factName : {
        type : String,
    } , 
    factNumber : {
        type : String,
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
},{timestamps:true})

const FactData = mongoose.model("FactData", factSchema);

export default FactData;