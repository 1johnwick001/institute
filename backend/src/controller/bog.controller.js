import { fileURLToPath } from 'url';
import BOG from "../model/bog.model.js";
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";
import fs from "fs"
import path,{dirname} from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createBog = async (req, res) => {
  try {
    const { name, designation, companyName, category, tab, details } = req.body;

    // Access the uploaded files
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const pdfFile = req.files?.pdfFile ? req.files.pdfFile[0] : null;

    if (!imageFile) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Image file is missing',
      });
    }

    // Construct the relative paths for the image and PDF files
    const relativeImagePath = `uploads/media/${imageFile.filename}`;
    const relativePdfPath = pdfFile ? `uploads/media/${pdfFile.filename}` : null;

    // Create BOG data with the relative paths for image and PDF
    const bogData = new BOG({
      name,
      designation,
      companyName,
      imageLink: relativeImagePath,   // Save the relative path for the image
      pdfFile: relativePdfPath,       // Save the relative path for the PDF
      details: details || '',
      category: tab ? null : category,
      tab: tab || null,
    });

    await bogData.save();

    // Send response with relative paths
    res.status(201).json({
      code: 201,
      status: true,
      message: 'BOG data uploaded successfully',
      data: bogData
    });
  } catch (error) {
    console.error('Error while creating BOG:', error);
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while creating BOG',
      data: error.message,
    });
  }
};

const getBog = async (req,res) => {
    try {
        const getbog = await BOG.find().populate('category', 'name') // Populate category name
        .populate({
            path: 'tab', // Populate tab
            select: 'name', // Select the tab name
            populate: {
                path: 'category', // Populate category of the tab
                select: 'name' // Only select the category name field
            }
        });

        if (getBog.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No bog name and number found"
            })
        }

        return res.json({
            code: 200,
            status: true,
            message: "bog retrieved successfully",
            data: getbog
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

const getBogById = async (req, res) => {
    try {
        const { id } = req.params;
        const bog = await BOG.findById(id);

        if (!bog) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "BOG not found",
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: "BOG retrieved successfully",
            data: bog,
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

const editBog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, companyName, details } = req.body;

    // Find the existing BOG document by ID
    const bogData = await BOG.findById(id);

    if (!bogData) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'BOG data not found.',
      });
    }

    // Access the uploaded files
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const pdfFile = req.files?.pdfFile ? req.files.pdfFile[0] : null;

    // If new image file is uploaded, update the imageLink with relative path
    if (imageFile) {
      bogData.imageLink = `uploads/media/${imageFile.filename}`;
    }

    // If new PDF file is uploaded, update the pdfFile with relative path
    if (pdfFile) {
      bogData.pdfFile = `uploads/media/${pdfFile.filename}`;
    }

    // Update other fields
    bogData.name = name || bogData.name;
    bogData.designation = designation || bogData.designation;
    bogData.companyName = companyName || bogData.companyName;
    bogData.details = details || bogData.details;


    // Save the updated BOG data
    await bogData.save();

    // Send response with updated data
    res.status(200).json({
      code: 200,
      status: true,
      message: 'BOG data updated successfully',
      data: bogData
    });
  } catch (error) {
    console.error('Error while updating BOG:', error);
    res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while updating BOG',
      data: error.message,
    });
  }
};

const deleteBog = async (req, res) => {
  try {
      const { id } = req.params;
  
      // Find the BOG entry by ID
      const bogdata = await BOG.findById(id);
  
      if (!bogdata) {
      return res.status(404).json({
          code: 404,
          status: false,
          message: "BOG data not found",
      });
      }
  
      // Check if there's an image to delete
      if (bogdata.imageLink) {
      const imagePath = bogdata.imageLink;
  
      // Check if the image file exists and delete it
      fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (!err) {
          fs.unlink(imagePath, (unlinkErr) => {
              if (unlinkErr) {
              console.error('Error deleting image:', unlinkErr);
              } else {
              console.log('Image deleted successfully');
              }
          });
          } else {
          console.log('Image file not found:', imagePath);
          }
      });
      }
  
      // Delete the BOG entry from the database
      await BOG.findByIdAndDelete(id);
  
      return res.json({
      code: 200,
      status: true,
      message: 'BOG data and associated image deleted successfully',
      });
  
  } catch (error) {
      console.error('Error while deleting BOG data:', error);
      return res.status(500).json({
      code: 500,
      status: false,
      message: 'An error occurred while deleting the BOG data.',
      });
  }
};

export {createBog ,getBog, getBogById , editBog , deleteBog}