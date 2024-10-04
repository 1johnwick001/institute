import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
    },
    content: { type: String,
        required: true
    },
    images: { 
        type: String
    },
    createdAt: {
        type: Date, default: Date.now
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TabsData',
        default: null
    }
});

const Blog = mongoose.model('Blog',BlogSchema);

export default Blog;