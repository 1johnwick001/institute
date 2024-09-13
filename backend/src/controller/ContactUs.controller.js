import ContactUs from "../model/contactUs.model.js";

const createContactUs = async (req, res) => {
    try {
        const { name, mobileNumber, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                code: 400,
                status: false,
                message: 'Name, Email, and Message are required',
            });
        }

        // Create a new contact entry
        const contactUs = new ContactUs({
            name,
            mobileNumber,
            email,
            message,
        });

        // Save to database
        await contactUs.save();

        return res.status(201).json({
            code: 201,
            status: true,
            message: 'Contact message submitted successfully',
            data: contactUs,
        });
    } catch (error) {
        console.error('Error while submitting contact message:', error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: 'Error while submitting contact message',
            error: error.message,
        });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await ContactUs.find().sort({ createdAt: -1 }); // Sort by newest first
        return res.status(200).json({
            code: 200,
            status: true,
            message: 'Contact messages fetched successfully',
            data: contacts,
        });
    } catch (error) {
        console.error('Error while fetching contact messages:', error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: 'Error while fetching contact messages',
            error: error.message,
        });
    }
};

const viewContactUs = async (req,res) => {
    try {
        const { id } = req.params;
        const contactForm = await ContactUs.findById(id);

        if (!contactForm) {
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
            data: contactForm,
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

const deleteContactUs = async (req,res) => {
    try {
        const { id } = req.params; // Document ID from URL
    
        // Find the document by ID
        const contact = await ContactUs.findById(id);
    
        if (!contact) {
          return res.status(404).json({ message: "contactform not found." });
        }
    
        // Remove the document from the database
        await ContactUs.findByIdAndDelete(id);
    
        // Respond with success
        res.status(200).json({ message: "contact form deleted successfully." });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "something went wrong while deleting form data." });
    }
}

export  {createContactUs , getContacts , viewContactUs , deleteContactUs}