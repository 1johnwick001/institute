import Category from "../model/category.model.js";
import Gallery from "../model/gallery.model.js";
import Blog from "../model/Blogs.model.js";
import BannerImage from "../model/Banner.models.js";
import Banner from "../model/Banner.models.js";
import FactData from "../model/factInfo.model.js";
import DocFiles from "../model/document.model.js";
import BOG from "../model/bog.model.js";
import slugify from 'slugify'
import TabsData from "../model/Tabs.models.js";


const createCategory = async (req, res) => {
  try {
    const { name, parentId, type ,instituteId  } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Name is required',
      });
    }

    let level = 0;

    // If parentId is provided, set it as the parent category and calculate level
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Parent category not found',
        });
      }
      level = parentCategory.level + 1;
    }

    // Check if type is required
    if (level > 0) {
      if (!type) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Type is required for child and grandchild categories',
        });
      }

      // Check if type is valid
      const validTypes = ['pdf', 'text', 'both'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Invalid type. Allowed types are pdf, text, both',
        });
      }
    }

    // Check if category with the same slug already exists
    const slug = slugify(name, { lower: true, strict: true });
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Category with this name already exists',
      });
    }

    const category = new Category({ name, slug, parent: parentId || null, level, type ,instituteId: instituteId ||  null });

    await category.save();

    return res.status(201).json({
      code: 201,
      status: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error while creating category', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while creating category',
      data: error.message,
    });
  }
};

const getCategories = async (req, res) => {
try {
    const categories = await Category.find().populate('parent').exec();

    // Build a hierarchical structure
    const buildHierarchy = (categories) => {
    const map = {};
    const roots = [];

    // Initialize the map with all categories
    categories.forEach(category => {
        map[category._id] = { ...category._doc, subcategories: [] };
    });

    // Populate the subcategories and find root categories
    categories.forEach(category => {
        if (category.parent) {
        map[category.parent._id].subcategories.push(map[category._id]);
        } else {
        roots.push(map[category._id]);
        }
    });

    return roots;
    };

    const hierarchicalCategories = buildHierarchy(categories);

    return res.status(200).json({
    code: 200,
    status: true,
    data: hierarchicalCategories,
    });
} catch (error) {
    console.error('Error while fetching categories', error);
    return res.status(500).json({
    code: 500,
    status: false,
    message: 'Error while fetching categories',
    data: error.message,
    });
}
};

const getCategoriesLevel2AndAbove = async (req, res) => {
    try {
      // Fetch categories with level 2 and above
      const categories = await Category.find({ level: { $gte: 2 } }).populate('parent');
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Getting category ID from the URL parameter
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Name is required',
      });
    }

    // Finding category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'Category not found',
      });
    }

    // Check if the new name already exists (excluding the current category)
    const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
    if (existingCategory) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: 'Name already exists',
      });
    }

    // Update the category name and slug
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
    await category.save();

    return res.status(200).json({
      code: 200,
      status: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error while updating category', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while updating category',
      data: error.message,
    });
  }
};


// below function recursively finds and deletes all subcategories
const deleteCategoryAndSubcategories = async (categoryId) => {
    // Find all subcategories and delete them recursively
    const subcategories = await Category.find({ parent: categoryId });
    for (const subcategory of subcategories) {
      await deleteCategoryAndSubcategories(subcategory._id); // Recursive call for subcategories
    }
  
    // Delete related documents in other models (e.g., Blog, Product, Banner)
    await deleteRelatedDocuments(categoryId);
  
    // Finally, delete the category itself
    await Category.findByIdAndDelete(categoryId);
  };
  
  // Function to delete related documents in other collections
  const deleteRelatedDocuments = async (categoryId) => {
    // Assuming you have models like Blog, Product, and Banner that reference Category
    await Blog.deleteMany({ category: categoryId });   // Remove blogs related to this category
    await Gallery.deleteMany({ category: categoryId }); // Remove products related to this category
    await BannerImage.deleteMany({ category: categoryId });  // Remove bannerimages related to this category
    await Banner.deleteMany({ category: categoryId });  // Remove banners related to this category
    await FactData.deleteMany({ category: categoryId });  // Remove factdata related to this category
    await DocFiles.deleteMany({ category: categoryId });  // Remove DocFiles related to this category 
    await BOG.deleteMany({ category: categoryId });  // Remove Bog related to this category 
    await TabsData.deleteMany({ category: categoryId });  // Remove TabsData related to this category
    
    // Add more related collections here if necessary
  };
  
  const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the category by ID
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: 'Category not found',
        });
      }
  
      // Recursively delete the category and its subcategories
      await deleteCategoryAndSubcategories(id);
  
      return res.status(200).json({
        code: 200,
        status: true,
        message: 'Category and its related data deleted successfully',
      });
    } catch (error) {
      console.error('Error while deleting category', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'Error while deleting category',
        data: error.message,
      });
    }
  };

// this function checks if category exists , calls recursive function , sends appropriate response based on the outcome.
// const deleteCategory = async (req, res) => {
//     try {

//         const {id} = req.params; 

//         // find the category by Id

//         const category = await Category.findById(id)
//         if (!category) {
//             return res.status(404).json({
//                 code:404,
//                 status:false,
//                 message:'category not found'
//             });
//         }

//         // recursively delete the category and its subcategories

//         await deleteCategoryAndSubcategories(id);

//         return res.status(200).json({
//             code:200,
//             status:true,
//             message:'category and its subcategories deleted successfully'
//         })
        
//     } catch (error) {
//         console.error('Error while deleting category', error);
//     return res.status(500).json({
//       code: 500,
//       status: false,
//       message: 'Error while deleting category',
//       data: error.message,
//     });
//     }
// }



export  {createCategory, getCategories, getCategoriesLevel2AndAbove ,updateCategory , deleteCategory};