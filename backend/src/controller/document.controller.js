import path from "path";
import DocFiles from "../model/document.model.js";
import fs from "fs"

const createDoc = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Extract data from the request
        const { category, fileName } = req.body; // 
        const { filename, mimetype } = req.file; // 


        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/media/${filename}`;

        // Create a new document entry in the database
        const newDocument = new DocFiles({
            fileName: fileName,
            fileUrl: fileUrl,
            fileType: mimetype, // Store the file's MIME type, e.g., 'application/pdf'
            category: category,
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

}

const getDoc = async (req,res) => {
    try {
        const docuFiles = await DocFiles.find({})

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
      const { category, fileName } = req.body; 

      let updateFields = { category, fileName }; 
  
      // If a new file is uploaded, update the file URL and type
      if (req.file) {
        const { filename, mimetype } = req.file;
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/media/${filename}`;
        updateFields.fileUrl = fileUrl;
        updateFields.fileType = mimetype;
      }
  
      // Find the document by ID and update it
      const updatedDocument = await DocFiles.findByIdAndUpdate(id, updateFields, { new: true });
  
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found." });
      }
  
      
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
  
      // Delete the file from the server
      const filePath = path.join("uploads", "media", path.basename(document.fileUrl));
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
  
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