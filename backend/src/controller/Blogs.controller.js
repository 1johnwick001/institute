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

const getBlogs = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Fetch a single blog by ID
            const blog = await Blog.findById(id);

            if (!blog) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Blog not found',
                });
            }

            return res.status(200).json({
                code: 200,
                status: true,
                message: 'Blog fetched successfully',
                data: blog,
            });
        } else {
            // Fetch all blogs
            const blogs = await Blog.find();

            return res.status(200).json({
                code: 200,
                status: true,
                message: 'Blogs fetched successfully',
                data: blogs,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        });
    }
};

const editBlog = async (req,res) => {
    try {

        const {id} = req.params;
        const {content} = req.body;

        if (!content) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: "Content is required",
            });
        }

        // If a new image is uploaded, generate the file URL
        const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;

        // Find the blog by ID and update it
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                content,
                images: fileUrl || undefined,  // Only update image if a new file is uploaded
            },
            { new: true }  // Return the updated document
        );

        if (!updatedBlog) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Blog updated successfully",
            data: updatedBlog,
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

const deleteBlog = async (req,res) => {
    try {

        const {id} = req.params;

        const deleteBlog = await Blog.findByIdAndDelete(id);

        if (!deleteBlog) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Blog deleted successfully",
            data: deleteBlog,  // Optionally, return the deleted blog data
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

export {createBlog , getBlogs ,  editBlog, deleteBlog}