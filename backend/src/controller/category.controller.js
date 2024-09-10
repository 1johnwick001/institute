import Category from "../model/category.model.js";

const createCategory = async (req, res) => {
    try {

      const { name, parentId } = req.body;
  
      if (!name) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Name is required',
        });
      }
  
      // Check if category with the same name already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: 'Category with this name already exists',
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
  
      const category = new Category({ name, parent: parentId || null, level });
  
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
        const {id} = req.params;  // Geting category ID from the URL parameter
        const {name } = req.body;

        if (!name) {
            return res.status(400).json ({
                code :400,
                status:false,
                message:'Name is required'
            })
        }

        // finding category Id and updating it

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                cide:404,
                status:false,
                message:"categoryId not found"
            })
        }

        // checking if the new name alredy exists (excluding the current category)
        const existingCategory = await Category.findOne({name,_id : {$ne:id}});

        if (existingCategory) {
            return res.status(400).json({
                code:400,
                status:false,
                message:' name alredy exists' 
            })
        }

        // update the category
        category.name = name;
        await category.save();

        return res.status(200).json({
            code:200,
            status:true,
            message:'category updated successfully',
            data : category
        })

    } catch (error) {
        console.error('Error while creating category', error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: 'Error while updating category',
            data: error.message,
        });
    }
};


// below function recursively finds and deletes all subcategories
const deleteCategoryAndSubcategories = async (id) => {
    const category = await Category.findById(id);

    if (category) {
        // Find all subcategories
        const subcategories = await Category.find({parent: id});

        for (const subcategory of subcategories) {
            // recursively delete each subcategory

            await deleteCategoryAndSubcategories(subcategory._id);
        }
        // delete the category itself
        await Category.deleteOne({_id: id})
    }
}

// this function checks if category exists , calls recursive function , sends appropriate response based on the outcome.
const deleteCategory = async (req, res) => {
    try {

        const {id} = req.params; 

        // find the category by Id

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({
                code:404,
                status:false,
                message:'category not found'
            });
        }

        // recursively delete the category and its subcategories

        await deleteCategoryAndSubcategories(id);

        return res.status(200).json({
            code:200,
            status:true,
            message:'category and its subcategories deleted successfully'
        })
        
    } catch (error) {
        console.error('Error while deleting category', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'Error while deleting category',
      data: error.message,
    });
    }
}



export  {createCategory, getCategories, getCategoriesLevel2AndAbove ,updateCategory , deleteCategory};