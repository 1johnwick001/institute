import Application from "../model/applicationForm.model.js";
import fs from 'fs';

const createApplicationForm = async (req, res) => {
    try {
      const {
        postAppliedFor, department, firstName, surname, gender, dateOfBirth,
        addressForCorrespondence, telephoneNo, cellNo, alternateCellNo, emailAddress, alternateEmail,
        educationalQualification, nationalStateLevelExamination, workExperience
      } = req.body;
  
      const resumePath = req.file ? req.file.path : null;
  
      if (!resumePath) {
        return res.status(400).json({ message: "Resume file is required" });
      }
  
     const newApplication = new Application({
        postAppliedFor,
        department,
        firstName,
        surname,
        gender,
        dateOfBirth,
        addressForCorrespondence,
        telephoneNo,
        cellNo,
        alternateCellNo: alternateCellNo || null,
        emailAddress,
        alternateEmail: alternateEmail || null,
        educationalQualification: {
          ug: educationalQualification?.ug || {},
          pg: educationalQualification?.pg || {},
          mphil: educationalQualification?.mphil || {},
          phd: educationalQualification?.phd || {}
        },
        nationalStateLevelExamination: {
          qualifiedExamName: nationalStateLevelExamination?.qualifiedExamName,
          qualifyingYear: nationalStateLevelExamination?.qualifyingYear
        },
        workExperience: workExperience ? {
          teaching: workExperience?.teaching || 0,
          industry: workExperience?.industry || 0,
          research: workExperience?.research || 0,
        } : {},
        resume: resumePath
      });
  
      await newApplication.save();
  
      return res.status(201).json({
        status: true,
        message: 'Application form created successfully',
        data: newApplication
      });
  
    } catch (error) {
      console.error('Error while creating application form:', error);
      return res.status(500).json({
        status: false,
        data: error.message
      });
    }
};

const getApplicationForm = async (req,res) => {
    try {

        const applicationFormData = await Application.find({})

        if (applicationFormData.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No Application Form Data found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Application form data retrieved successfully",
            data: applicationFormData
        });
        
    } catch (error) {
        console.error('error while fetching application form data',error);
        return res.status(500).json({
            status:false,
            message:"error while fetching application form data"
        })
    }
}

const viewApplicationById = async (req,res) => {
    try {
        const { id } = req.params;
        const appForm = await Application.findById(id);

        if (!appForm) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Application Form not found",
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: "Application Form retrieved successfully",
            data: appForm,
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

const deleteApplicationForm = async (req,res) => {
    try {
        const { id } = req.params; // Document ID from URL
    
        // Find the document by ID
        const document = await Application.findById(id);
    
        if (!document) {
          return res.status(404).json({ message: "Document not found." });
        }

        const fileName = document.resume;
      
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
    
        // Remove the document from the database
        await Application.findByIdAndDelete(id);
    
        // Respond with success
        res.status(200).json({ message: "Document deleted successfully." });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "something went wrong while deleting form data." });
    }
}

export  {createApplicationForm , getApplicationForm ,viewApplicationById ,deleteApplicationForm}