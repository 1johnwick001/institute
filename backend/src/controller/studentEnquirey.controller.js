import StudentEnquiry from "../model/StudentEnquirey.model.js";



const createEnquiry = async (req, res) => {
    try {
      const {name, mobile, email, city, course, mathAnswer} = req.body;
  
      // Validation: ensure required fields are present
      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Please provide all required fields."
        });
      }
  
      // Create a new enquiry document
      const newEnquiry = new StudentEnquiry({
        name,
        mobile,
        email,
        city,
        course,
        mathAnswer
      });
  
      // Save to the database
      await newEnquiry.save();
  
      return res.status(201).json({
        status: true,
        message: "Enquiry created successfully.",
        data: newEnquiry
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error.",
        error: error.message
      });
    }
};

const getEnquiryList = async (req, res) => {
    try {
      // Fetch all enquiries with status: 1 (active)
      const enquiries = await StudentEnquiry.find({ status: 1 });
  
      if (enquiries.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No active enquiries found.",
        });
      }
  
      return res.status(200).json({
        status: true,
        data: enquiries,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error.",
        error: error.message,
      });
    }
};

const viewEnquiryById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the enquiry by ID and check if its status is 1 (active)
      const enquiry = await StudentEnquiry.findOne({ _id: id, status: 1 });
  
      if (!enquiry) {
        return res.status(404).json({
          status: false,
          message: "Active enquiry not found."
        });
      }
  
      return res.status(200).json({
        status: true,
        data: enquiry
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error.",
        error: error.message
      });
    }
};

const softDeleteEnquiry = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the enquiry and update the status to 0 (soft delete)
      const enquiry = await StudentEnquiry.findByIdAndUpdate(id, { status: 0 }, { new: true });
  
      if (!enquiry) {
        return res.status(404).json({
          status: false,
          message: "Enquiry not found."
        });
      }
  
      return res.status(200).json({
        status: true,
        message: "Enquiry soft-deleted successfully.",
        data: enquiry
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Server error.",
        error: error.message
      });
    }
};

export {createEnquiry, getEnquiryList ,viewEnquiryById, softDeleteEnquiry}