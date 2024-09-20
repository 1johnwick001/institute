import Feedback from "../model/feedbackForms.model.js";

// Create Feedback
const createFeedback = async (req, res) => {
    try {
        const feedbackData = req.body;
    
        const newFeedback = new Feedback(feedbackData);
        
        await newFeedback.save();

        return res.status(201).json({
            status: true,
            message: 'Feedback created successfully',
            data: newFeedback,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error creating feedback',
            error: error.message,
        });
    }
};

const getFeedBackForm = async (req,res) => {
    try {

        const feedbackFormData = await Feedback.find({})

        if (feedbackFormData.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No feedback Form Data found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "feedback form data retrieved successfully",
            data: feedbackFormData
        });
        
    } catch (error) {
        console.error('error while fetching feedback form data',error);
        return res.status(500).json({
            status:false,
            message:"error while fetching feedback form data"
        })
    }
}

const viewFeedbackById = async (req,res) => {
    try {
        const { id } = req.params;
        const appForm = await Feedback.findById(id);

        if (!appForm) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Feedback Form not found",
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: "feedback Form retrieved successfully",
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

// Delete Feedback by ID
const deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findByIdAndDelete(feedbackId);

        if (!feedback) {
            return res.status(404).json({
                status: false,
                message: 'Feedback not found',
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Feedback deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error deleting feedback',
            error: error.message,
        });
    }
};


export  {createFeedback , getFeedBackForm , viewFeedbackById , deleteFeedback}