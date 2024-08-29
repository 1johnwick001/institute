import Category from "../model/category.model.js";
import Gallery from "../model/gallery.model.js";

const uploadGallery = async (req, res) => {
    try {
      const { galleryName, category } = req.body;
  
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Please upload a Gallery Item",
        });
      }
  
      // Check if the category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }
  
      // Determine if the file is an image or video
      let mediaType;
      let mediaField;
      if (req.file.mimetype.startsWith('image/')) {
        mediaType = 'image';
        mediaField = 'galleryImage'; // use this to set the image field in the schema
      } else if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
        mediaField = 'galleryVideo'; // use this to set the video field in the schema
      } else {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Invalid file type. Only images and videos are allowed.",
        });
      }
  
      // Create the URL for the uploaded file
      const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  
      // Create a new gallery document
      const galleryData = new Gallery({
        galleryName,
        mediaType,
        category: categoryExists._id,
        [mediaField]: fileUrl // dynamically set either image or video field
      });
  
      // Save the document to the database
      await galleryData.save();
  
      // Respond with success
      res.status(201).json({
        code: 201,
        status: true,
        message: 'Gallery uploaded successfully',
        data: {
          galleryData
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: error.message,
      });
    }
  };  

const getGalleryImage = async (req, res) => {
    try {

        const images = await Gallery.find({}); //fetch all images from the database

        if (images.length === 0) {
            return res.json({
                code:404,
                status:false,
                message:"No images found"
            })
        }

        return res.json({
            code:200,
            status:false,
            message:"Images retrieved successfully",
            data: images
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        });
    }
}

const editGallery = async (req, res) => {
    try {
        const { id } = req.params; // Gallery ID from request parameters
        const { galleryName, category } = req.body; // Text fields from request body

        // Fetch the existing gallery item by ID
        const galleryItem = await Gallery.findById(id);

        if (!galleryItem) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Gallery item not found"
            });
        }

        // Check if category exists if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: "Category not found"
                });
            }
            galleryItem.category = categoryExists._id; // Update category
        }

        // Update the galleryName if provided
        if (galleryName) {
            galleryItem.galleryName = galleryName;
        }

        // Handle file uploads if a new file is uploaded
        if (req.file) {
            let mediaType;
            let mediaField;
            if (req.file.mimetype.startsWith('image/')) {
                mediaType = 'image';
                mediaField = 'galleryImage';
            } else if (req.file.mimetype.startsWith('video/')) {
                mediaType = 'video';
                mediaField = 'galleryVideo';
            } else {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "Invalid file type. Only images and videos are allowed."
                });
            }

            // Create the URL for the uploaded file
            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            // Update media fields dynamically based on the type
            galleryItem.mediaType = mediaType;
            galleryItem[mediaField] = fileUrl;
        }

        // Save the updated gallery item
        await galleryItem.save();

        return res.status(200).json({
            code: 200,
            status: true,
            message: 'Gallery item updated successfully',
            data: galleryItem
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        });
    }
};


const deleteGalleryImage = async (req,res) => {
    try {

        const {id} = req.params;

          // Find and delete the image by ID
          const image = await Gallery.findByIdAndDelete(id);

          if (!image) {
            return res.json({
                code:404,
                status:false,
                message:"Gallery not Found"
            });
        }

        return res.json({
            code:200,
            status:true,
            message:'Gallery deleted successfully'
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: error.message,
        }); 
    }
}

export  {uploadGallery , getGalleryImage ,editGallery, deleteGalleryImage}