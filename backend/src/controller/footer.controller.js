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


export {addFooterCategory}