import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";
import URL from "../model/Url.model.js";


const CreateUrl = async (req, res) => {
    try {
      const { urlAddress, category } = req.body;
      
      // Check if the category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }
  
      
  
      // Create a new gallery document
      const UrlData = new URL({
        urlAddress :urlAddress || null,
        category:  categoryExists._id, // Associate with category if no tab is provided
      });
  
      // Save the document to the database
      await UrlData.save();
  
      // Respond with success
      res.status(201).json({
        code: 201,
        status: true,
        message: 'URL uploaded successfully',
        data: UrlData,
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

const EditUrl = async (req,res) => {
    const id = req.params.id;

    const { urlAddress } = req.body;

  try {
    const updatedItem = await URL.findByIdAndUpdate(id, {urlAddress},{ new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Url not found' });
    }

    res.json({ message: 'url  updated successfully', data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const getUrlAddress = async (req, res) => {
    try {

      const urlAdd = await URL.find({})
      .populate('category', 'name') // Populate category name
      .populate({
          path: 'tab', // Populate tab
          select: 'name', // Select the tab name
          populate: {
              path: 'category', // Populate category of the tab
              select: 'name' // Only select the category name field
          }
      });

        if (urlAdd.length === 0) {
            return res.json({
                code:404,
                status:false,
                message:"No url found"
            })
        }

        return res.json({
            code:200,
            status:false,
            message:"url retrieved successfully",
            data: urlAdd
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

const deleteUrlAddress = async (req, res) => {
    try {
        const { id } = req.params;
    
        // Find and delete the URL by ID
        const deletedUrl = await URL.findByIdAndDelete(id);
    
        if (!deletedUrl) {
            return res.json({
                code: 404,
                status: false,
                message: "URL not found",
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: 'URL deleted successfully',
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

export {CreateUrl , getUrlAddress, EditUrl , deleteUrlAddress}