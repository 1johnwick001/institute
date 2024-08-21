import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema ({
    content: { type: String,
        required: true
    }, // HTML content from Jodit
    images: { 
        type: String
    }, 
    createdAt: {
        type: Date, default: Date.now
    },
})

const Blog = mongoose.model('Blog',BlogSchema);

export default Blog;