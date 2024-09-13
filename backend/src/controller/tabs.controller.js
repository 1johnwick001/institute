import TabsData from "../model/Tabs.models.js";
import Category from "../model/category.model.js";
import slugify from 'slugify';
import Gallery from "../model/gallery.model.js";
import Blog from "../model/Blogs.model.js";
import BannerImage from "../model/Banner.models.js";
import Banner from "../model/Banner.models.js";
import FactData from "../model/factInfo.model.js";
import DocFiles from "../model/document.model.js";
import BOG from "../model/bog.model.js";

// Create a new Tab
const createTab = async (req, res) => {
    try {
      const { category, name, parentId } = req.body;
  
      // Check if the category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }

      const slug = slugify(name, { lower: true, strict: true });
      const existingTab = await TabsData.findOne({ slug });
      if (existingTab) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Tab with this name already exists',
        });
      }
  
      let level = 0;
  
      // If parentId is provided, set it as the parent tab and calculate level
      if (parentId) {
        const parentTab = await TabsData.findById(parentId);
        if (!parentTab) {
          return res.status(404).json({
            code: 404,
            status: false,
            message: 'Parent tab not found',
          });
        }
        level = parentTab.level + 1;
      }
  
      // Create a new document entry in the database
      const newTab = new TabsData({
        name,
        category,
        parent: parentId || null,
        slug,
        level,
      });
  
      // Save the new document to the database
      await newTab.save();
  
      // Respond with success
      res.status(201).json({
        code: 201,
        status: true,
        message: "Tab created successfully!",
        data: newTab,
      });
  
    } catch (error) {
      console.error('Error while creating tab', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'Error while creating tab',
        data: error.message,
      });
    }
};

const getTabs = async (req,res) => {
    try {
        const tabs = await TabsData.find().populate('category','name').exec();
        return res.status(200).json({
          code: 200,
          status: true,
          data: tabs,
        })
    }catch (error) {
        console.error('Error while fetching categories', error);
    return res.status(500).json({
    code: 500,
    status: false,
    message: 'Error while fetching categories',
    data: error.message,
    });
    }
}

const getTabsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Find tabs related to the specific category
    const tabs = await TabsData.find({ category: categoryId }).exec();
    
    if (!tabs) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'No tabs found for this category',
      });
    }
    
    res.status(200).json({
      code: 200,
      status: true,
      message: 'Tabs fetched successfully',
      data: tabs,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: false,
      message: error.message,
    });
  }
};

const updateTab = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Name is required',
        });
      }
  
      const tab = await TabsData.findById(id);
      if (!tab) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: 'Tab not found',
        });
      }
  
      const existingTab = await TabsData.findOne({ name, _id: { $ne: id } });
      if (existingTab) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Name already exists',
        });
      }
  
      tab.name = name;
      tab.slug = slugify(name, { lower: true, strict: true });
      await tab.save();
  
      return res.status(200).json({
        code: 200,
        status: true,
        message: 'Tab updated successfully',
        data: tab,
      });
    } catch (error) {
      console.error('Error while updating tab', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'Error while updating tab',
        data: error.message,
      });
    }
};

const deleteTab = async (req, res) => {
  try {
    const { id } = req.params;

    const tab = await TabsData.findById(id);
    if (!tab) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'Tab not found',
      });
    }

     // Perform all deletions in parallel
     await Promise.all([
      Blog.deleteMany({ tab: id }),
      Banner.deleteMany({ tab: id }),
      BannerImage.deleteMany({ tab: id }),
      FactData.deleteMany({ tab: id }),
      DocFiles.deleteMany({ tab: id }),
      BOG.deleteMany({ tab: id }),
      Gallery.deleteMany({ tab: id })
    ]);

    // Delete the tab itself
    await TabsData.findByIdAndDelete(id);

    return res.status(200).json({
      code: 200,
      status: true,
      message: 'Tab and associated data deleted successfully',
    });
  } catch (error) {
    console.error('Error while deleting tab', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while deleting tab and associated blogs',
      data: error.message,
    });
  }
};


export  {createTab,  getTabs, getTabsByCategory , updateTab , deleteTab} 