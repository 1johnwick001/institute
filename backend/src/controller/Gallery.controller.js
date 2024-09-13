import Category from "../model/category.model.js";
import Gallery from "../model/gallery.model.js";
import TabsData from "../model/Tabs.models.js";

const uploadGallery = async (req, res) => {
  try {
      
      const { galleryName, category, galleryImage, mediaType, tab } = req.body; // Expecting galleryImage to be a URL from frontend
      
    // Validate required fields
    if (!galleryName || !galleryImage || !mediaType) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Please provide all required fields.",
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

    // Ensure mediaType is valid
    if (!['image', 'video'].includes(mediaType)) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid media type. Only 'image' or 'video' are allowed.",
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

    // Create a new gallery document with the provided URL
    const galleryData = new Gallery({
      galleryName,
      mediaType,
      category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
      tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      [mediaType === 'image' ? 'galleryImage' : 'galleryVideo']: galleryImage, // Directly use the URL provided
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
    const id = req.params.id
    const { galleryName, galleryImage, mediaType } = req.body;

    try {
        const updatedItem = await Gallery.findByIdAndUpdate(id,{ galleryName, galleryImage, mediaType },{ new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Gallery item updated successfully', data: updatedItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
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