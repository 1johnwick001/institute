import Blog from "../model/Blogs.model.js";


const createBlog = async (req,res) => {
    try {

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                code:400,
                status:false,
                message:"Content is required",
            })
        }

        // collect the urls from the uploaded files

        const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;

        const newBlog = new Blog ({
            content ,
            images : fileUrl,
        })

        await newBlog.save();

        res.status(201).json({
            code: 201,
            status: true,
            message: 'Blog created successfully!',
            data: newBlog,
        });

        
    } catch (error) {
        console.error(error);
    res.status(500).json({
      code: 500,
      status: false,
      message: error.message,
    });
    }
}

const getBlogs = async (req,res) => {
    try {

        const blogs = await Blog.find()

        return res.status(200).json({
            code:200,
            status:true,
            message:'Blogs fetched successfully',
            data : blogs
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        });
    }
}

export {createBlog , getBlogs}