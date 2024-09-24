import Blog from "../model/Blogs.model.js";
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";
import path , { dirname }from "path"
import fs from "fs"
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createBlog = async (req, res) => {
    try {
      const { title, content, category, tab } = req.body;

      const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` : null;
  
      if (!title || !content || !category) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Title, content, and category are required',
        });
      }
  
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: 'Category not found',
        });
      }
  
      let tabExists = null;
      if (tab) {
        tabExists = await TabsData.findById(tab);
        if (!tabExists) {
          return res.status(404).json({
            code: 404,
            status: false,
            message: 'Tab not found',
          });
        }
      }
  

      
      const newBlog = new Blog({
        title,
        content,
        images: fileUrl || [],
        category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
        tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      });
  
      await newBlog.save();
  
      res.status(201).json({
        code: 201,
        status: true,
        message: 'Blog created successfully!',
        data: newBlog,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: false,
        message: error.message,
      });
    }
};

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
        const { content, title } = req.body;

        // Get the new image URL if a file is uploaded
        const images = req.file 
            ? `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}` 
            : null;

        // Validate that at least one field is provided
        if (!title && !content ) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: 'At least one field (title, content) is required to update',
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
        if (images) updateFields.images = images; // Update images if provided

        // Update the blog document
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateFields,
            { new: true } // Return the updated document
        );

        res.status(200).json({
            code: 200,
            status: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });

    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            code: 500,
            status: false,
            message: "Internal server error.",
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the blog by ID first to get the image path
        const blogToDelete = await Blog.findById(id);
        if (!blogToDelete) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Blog not found",
            });
        }

        

        // Delete the image file from the filesystem
        if (blogToDelete.images) {
            const imageFileName = blogToDelete.images.split('/').pop(); // Extract the filename
            const imagePath = path.join(__dirname, 'uploads/media', imageFileName); // Adjusted path

            // Directly attempt to delete the file
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting old file:", err);
                } else {
                    console.log("File deleted successfully:", imagePath);
                }
            });
        } else {
            console.log("No image to delete.");
        }

        // Now delete the blog
        const deletedBlog = await Blog.findByIdAndDelete(id);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Blog deleted successfully",
            data: deletedBlog,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        });
    }
};

export {createBlog , getBlogs ,  editBlog, deleteBlog}