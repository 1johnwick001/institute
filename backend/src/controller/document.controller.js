import path from "path";
import DocFiles from "../model/document.model.js";
import fs from "fs"
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";


const createDoc = async (req, res) => {
  try {
      const { category, fileName, tab } = req.body;
      const file = req.file ? `${req.protocol}://${req.get('host')}/uploads/docs/${req.file.filename}` : null;

      // Check if the category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
          return res.status(404).json({
              code: 404,
              status: false,
              message: "Category not found",
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

      // Create a new document entry in the database
      const newDocument = new DocFiles({
          fileName,
          fileUrl: file,
          category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
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
        const docuFiles = await DocFiles.find({}).populate('category','name')

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
      const {  fileName } = req.body;

      const updatedFields = { fileName };

      // Find the document by ID
      const existingDocument = await DocFiles.findById(id);
      if (!existingDocument) {
          return res.status(404).json({ message: "Document not found." });
      }

      // If a new file is uploaded, delete the previous file and update the file URL
      if (req.file) {
          const oldFilePath = path.join('uploads/docs', existingDocument.fileUrl.split('/uploads/docs/')[1]);
          
          // Delete the old file
          fs.unlink(oldFilePath, (err) => {
              if (err) {
                  console.error("Error deleting old file:", err);
              }
          });

          const { filename, mimetype } = req.file;
          const fileUrl = `${req.protocol}://${req.get("host")}/uploads/docs/${filename}`;
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

      // Construct the file path for deletion
      const oldFilePath = path.join('uploads/docs', document.fileUrl.split('/uploads/docs/')[1]);

      // Delete the old file
      fs.unlink(oldFilePath, (err) => {
          if (err) {
              console.error("Error deleting old file:", err);
              return res.status(500).json({ message: "Failed to delete file from disk." });
          }
       }) 
  
      if (!document) {
        return res.status(404).json({ message: "Document not found." });
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