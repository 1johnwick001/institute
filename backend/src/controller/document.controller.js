import path from "path";
import DocFiles from "../model/document.model.js";
import fs from "fs"
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";


const createDoc = async (req, res) => {
  try {
    const { category, fileName, tab } = req.body;

    // Handle the file URL, ensuring it's set to null if no file is uploaded
    const fileUrl = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Check if the category exists
    let categoryExists = null;
    if (category) {
      categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Category not found",
        });
      }
    }

    // Check if the tab exists
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

    // Create a new document entry in the database
    const newDocument = new DocFiles({
      fileName,
      fileUrl, // Pass the file URL directly
      category: tabExists ? null : categoryExists ? categoryExists._id : null, // Only associate with category if no tab is provided
      tab: tabExists ? tabExists._id : null, // Associate with tab if provided
    });

    // Save the new document to the database
    await newDocument.save();

    // Respond with success
    res.status(201).json({
      message: "Document uploaded and saved successfully!",
      document: newDocument,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
 
const getDoc = async (req,res) => {
    try {
      const docuFiles = await DocFiles.find({})
      .populate('category', 'name') // Populate category name
      .populate({
          path: 'tab', // Populate tab
          select: 'name', // Select the tab name
          populate: {
              path: 'category', // Populate category of the tab
              select: 'name' // Only select the category name field
          }
      });

        if (docuFiles.length === 0) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"No images found"
            })
        }
        return res.json({
            code:200,
            status:false,
            message:" All Docs retrieved successfully !!",
            data: docuFiles
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

const editDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const updatedFields = { fileName };

    // Find the document by ID
    const existingDocument = await DocFiles.findById(id);
    if (!existingDocument) {
      return res.status(404).json({ message: "Document not found." });
    }

    // If a new file is uploaded, update the file URL
    if (req.file) {
      // Update with new file details
      const { mimetype } = req.file;
      const fileUrl = req.file.path.replace(/\\/g, '/') ;
      updatedFields.fileUrl = fileUrl;
      updatedFields.fileType = mimetype; // Update the file type if needed
    }

    // Update the document in the database
    const updatedDocument = await DocFiles.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({
      message: "Document updated successfully!",
      document: updatedDocument,
    });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteDoc = async (req, res) => {
  try {
    const { id } = req.params; // Document ID from URL

    // Find the document by ID
    const document = await DocFiles.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // Check if fileUrl exists and is a valid string before deleting the file from disk
    if (document.fileUrl && typeof document.fileUrl === 'string') {
      const fileName = document.fileUrl;
      
      // Check if fileName exists and is valid
      if (fileName) {
        
        const oldFilePath =  fileName;

        // Attempt to delete the file from the file system
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting file from disk:", err);
            // Log error but proceed with deleting the document from the DB
          }
        });
      }
    }

    // Remove the document from the database
    await DocFiles.findByIdAndDelete(id);

    // Respond with success
    res.status(200).json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { createDoc , getDoc , editDoc , deleteDoc}