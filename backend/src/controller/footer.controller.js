import FooterCategory from "../model/footer.model.js";

const addFooterCategory = async (req, res) => {
    try {
      const { name, type } = req.body;
  
      // Validate the required fields
      if (!name || !type) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Name and type are required fields",
        });
      }
  
      // Create a new footer category document
      const newFooterCategory = new FooterCategory({
        name,
        type,
      });
  
      // Save the new footer category to the database
      const savedFooterCategory = await newFooterCategory.save();
  
      return res.status(201).json({
        code: 201,
        status: true,
        message: 'Footer category created successfully',
        data: savedFooterCategory,
      });
  
    } catch (error) {
      console.error("Error creating footer category:", error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "An error occurred while creating the footer category",
      });
    }
};

const editFooterCategory = async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from request parameters
      const { name, type } = req.body; // Get the new name and type from the request body
  
      // Validate the required fields
      if (!name && !type) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "At least one field (name or type) is required for update",
        });
      }
  
      // Find the footer category by ID
      const footerCategory = await FooterCategory.findById(id);
  
      // Check if the footer category exists
      if (!footerCategory) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Footer category not found",
        });
      }
  
      // Update only the fields that are provided
      if (name) {
        footerCategory.name = name;
      }
      if (type) {
        footerCategory.type = type;
      }
  
      // Save the updated footer category
      const updatedFooterCategory = await footerCategory.save();
  
      return res.status(200).json({
        code: 200,
        status: true,
        message: "Footer category updated successfully",
        data: updatedFooterCategory,
      });
  
    } catch (error) {
      console.error("Error updating footer category:", error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "An error occurred while updating the footer category",
      });
    }
};

const softDeleteFooterCategory = async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from the request parameters
  
      // Find the footer category by ID
      const footerCategory = await FooterCategory.findById(id);
  
      // Check if the footer category exists
      if (!footerCategory) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Footer category not found",
        });
      }
  
      // Update the status to 0 (soft delete)
      footerCategory.status = 0;
  
      // Save the updated footer category
      await footerCategory.save();
  
      return res.status(200).json({
        code: 200,
        status: true,
        message: "Footer category soft-deleted successfully",
      });
  
    } catch (error) {
      console.error("Error soft deleting footer category:", error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "An error occurred while  deleting the footer category",
      });
    }
};

const getActiveFooterCategories = async (req, res) => {
    try {
      // Find all footer categories where status is 1 (active)
      const activeCategories = await FooterCategory.find({ status: 1 });
  
      // Check if any active categories were found
      if (activeCategories.length === 0) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "No active footer categories found",
        });
      }
  
      // Return the list of active footer categories
      return res.status(200).json({
        code: 200,
        status: true,
        message: "Active footer categories retrieved successfully",
        data: activeCategories,
      });
  
    } catch (error) {
      console.error("Error retrieving active footer categories:", error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "An error occurred while retrieving active footer categories",
      });
    }
};

export {getActiveFooterCategories, addFooterCategory, editFooterCategory , softDeleteFooterCategory}