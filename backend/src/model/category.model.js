import mongoose, { Types } from "mongoose";

const categorySchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },

    parent: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    
})


const Category = mongoose.model('Category', categorySchema);

export default Category;