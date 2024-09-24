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
      const { name, designation, companyName, category, tab } = req.body;
  
      // Check if the file is uploaded
      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Image file is missing',
        });
      }
  
      const imageLink = `${req.protocol}://${req.get('host')}/uploads/media/${imageFile.filename}`; // Assuming you're saving the file in 'uploads/media' directory
  
      if (!name) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Name is missing',
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
  
      const bogData = new BOG({
        name,
        designation,
        companyName,
        imageLink, // Save the image link
        category: tabExists ? null : categoryExists._id, // Associate with category if no tab is provided
        tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      });
  
      await bogData.save();
  
      // Respond with full data
      res.status(201).json({
        code: 201,
        status: true,
        message: 'BOG data uploaded successfully',
        data: bogData,
      });
    } catch (error) {
      console.error('Error while creating BOG', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'Error while creating BOG',
        data: error.message,
      });
    }
};

const getBog = async (req,res) => {
    try {
        const getbog = await BOG.find() 

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
}

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
      const { name, designation, companyName, imageLink } = req.body;
      
      // Check if the BOG entry exists
      const bogdata = await BOG.findById(id);
      
      if (!bogdata) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "BOG not found",
        });
      }
  
      // If a new image file is uploaded, replace the old image
      if (req.file) {
        const newImageLink = `${req.protocol}://${req.get('host')}/uploads/media/${req.file.filename}`;
        
        // Unlink (delete) the old image if it exists
        if (bogdata.imageLink) {
          const oldImagePath = path.join(__dirname, '..', bogdata.imageLink.replace(`${req.protocol}://${req.get('host')}`, ''));
          
          // Check if the file exists and delete it
          fs.access(oldImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(oldImagePath, (unlinkErr) => {
                if (unlinkErr) {
                  console.error('Error deleting old image:', unlinkErr);
                } else {
                  console.log('Old image deleted successfully');
                }
              });
            }
          });
        }
  
        bogdata.imageLink = newImageLink; // Use the new image link
      } else {
        bogdata.imageLink = imageLink || bogdata.imageLink; // Use existing image link if no new file is uploaded
      }
  
      // Update other fields
      bogdata.name = name || bogdata.name;
      bogdata.designation = designation || bogdata.designation;
      bogdata.companyName = companyName || bogdata.companyName;
  
      // Save the updated document
      const updatedBog = await bogdata.save();
  
      // Send a success response
      res.status(200).json({
        code: 200,
        status: true,
        message: "BOG updated successfully",
        data: updatedBog,
      });
    } catch (error) {
      console.error('Error updating BOG:', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'An error occurred while updating the BOG.',
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
    const imagePath = path.join(__dirname, '..', bogdata.imageLink.replace(`${req.protocol}://${req.get('host')}`, ''));

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