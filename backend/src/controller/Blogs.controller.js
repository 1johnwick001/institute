import Blog from "../model/Blogs.model.js";
import Category from "../model/category.model.js";


const createBlog = async (req,res) => {
    try {

        const { title, content, category , images } = req.body;

        if (!title || !content || !category ) {
            return res.status(400).json({
              code: 400,
              status: false,
              message: 'Title , content , image and category are required',
            });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
            code: 404,
            status: false,
            message: "Category not found",
            });
        }

        

        const newBlog = new Blog ({
            category: categoryExists._id,
            title,
            content ,
            images : images || [] ,
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

const editBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, title, images } = req.body;

        // Validate that at least one field is provided
        if (!title && !content && !images) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: 'At least one field (title, content, images) is required to update',
            });
        }

        // Find the blog by ID
        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Blog not found",
            });
        }

        // Prepare update object with only the fields provided
        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (images !== null) {
            // Only include images in updateFields if provided
            updateFields.images = images;
        }

        // Update the blog document
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateFields,
            { new: true } // Return the updated document
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