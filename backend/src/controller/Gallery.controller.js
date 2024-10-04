import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import Category from "../model/category.model.js";
import Gallery from "../model/gallery.model.js";
import TabsData from "../model/Tabs.models.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadGallery = async (req, res) => {
  try {
    const { galleryName, category, mediaType, tab } = req.body;
    
    // Check if required fields are provided
    if (!mediaType) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Please provide all required fields.",
      });
    }

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

    // Check if the tab exists, if provided
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

    // Use multer to save the file and create the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/media/${req.file.filename}`;

    // Create a new gallery document
    const galleryData = new Gallery({
      galleryName :galleryName || null,
      mediaType,
      category: tabExists ? null : categoryExists._id, // Associate with category if no tab is provided
      tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      [mediaType === 'image' ? 'galleryImage' : 'galleryVideo']: fileUrl, // Save the file URL
    });

    // Save the document to the database
    await galleryData.save();

    // Respond with success
    res.status(201).json({
      code: 201,
      status: true,
      message: 'Gallery uploaded successfully',
      data: galleryData,
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

      const images = await Gallery.find({})
      .populate('category', 'name') // Populate category name
      .populate({
          path: 'tab', // Populate tab
          select: 'name', // Select the tab name
          populate: {
              path: 'category', // Populate category of the tab
              select: 'name' // Only select the category name field
          }
      });

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
};

const editGallery = async (req, res) => {
  const id = req.params.id;

  const { galleryName, mediaType } = req.body;

  // Ensure mediaType is provided and valid
  if (!mediaType || !['image', 'video'].includes(mediaType)) {
    return res.status(400).json({ message: 'Invalid or missing mediaType' });
  }

  let updatedFields = {};
  if (galleryName) updatedFields.galleryName = galleryName;
  if (mediaType) updatedFields.mediaType = mediaType;

  // If a new file is uploaded, save its path in the DB
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/media/${req.file.filename}`;
    updatedFields[mediaType === 'image' ? 'galleryImage' : 'galleryVideo'] = fileUrl;

    // Optional: Remove the old file
    try {
      const currentItem = await Gallery.findById(id);
      if (currentItem) {
        const oldFilePath = path.join(__dirname, '..', currentItem[mediaType === 'image' ? 'galleryImage' : 'galleryVideo'].split('/uploads/media/')[1]);
        console.log('oldFilePath', oldFilePath);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete the old file
        }
      }
    } catch (err) {
      console.error('Error removing old file:', err);
    }
  }

  try {
    const updatedItem = await Gallery.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Gallery item updated successfully', data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the image by ID
    const image = await Gallery.findById(id);

    // Check if the image exists
    if (!image) {
      return res.json({
        code: 404,
        status: false,
        message: "Gallery not found",
      });
    }

    // Check if galleryImage exists and is a local file path (not a third-party URL)
    if (image.galleryImage && image.galleryImage.includes('/uploads/media/')) {
      const oldFilePath = path.join('uploads/media', image.galleryImage.split('/uploads/media/')[1]);

      // Check if the file exists before trying to delete it
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, async (err) => {
          if (err) {
            console.error("Error deleting old file:", err);
          }
          // Proceed to delete from the database even if unlink fails
          await Gallery.findByIdAndDelete(id);

          return res.json({
            code: 200,
            status: true,
            message: 'Gallery deleted successfully with file deletion',
          });
        });
      } else {
        // File does not exist, proceed with database deletion
        await Gallery.findByIdAndDelete(id);
        return res.json({
          code: 200,
          status: true,
          message: 'Gallery deleted successfully, file not found for deletion',
        });
      }
    } else {
      // galleryImage does not exist or is from a third-party URL, proceed to delete the image from the database
      await Gallery.findByIdAndDelete(id);
      return res.json({
        code: 200,
        status: true,
        message: 'Gallery deleted successfully without local file deletion',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: error.message,
    });
  }
};

export  {uploadGallery , getGalleryImage ,editGallery, deleteGalleryImage}