import ContactUSAddress from "../model/contactUSAddress.model.js";

const createContactUsAddress = async (req, res) => {
    try {
        const { title, virtualTourLink, address, phone_no, mob_no,email, fax } = req.body;

        const newContactAddress = new ContactUSAddress({
            title,
            virtualTourLink,
            address,
            phone_no,
            mob_no,
            fax,
            email,
            icon: req.file ? `uploads/media/${req.file.filename}` : ''
        });

        const savedAddress = await newContactAddress.save();
        
        return res.status(201).json({
            status: true,
            message: 'Contact Us Address created successfully',
            data: savedAddress
        });

    } catch (error) {
        console.error("Error while submitting contact us address", error);
        return res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        });
    }
};

const getAllContactUsAddresses = async (req, res) => {
    try {
        const addresses = await ContactUSAddress.find();
        return res.status(200).json({
            status: true,
            message:"address fetched successfully",
            data: addresses
        });
    } catch (error) {
        console.error("Error while fetching contact us addresses", error);
        return res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        });
    }
};

// Get single ContactUs Address by ID
const getContactUsAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await ContactUSAddress.findById(id);
        if (!address) {
            return res.status(404).json({
                status: false,
                message: "Address not found"
            });
        }
        return res.status(200).json({
            status: true,
            data: address
        });
    } catch (error) {
        console.error("Error while fetching contact us address by ID", error);
        return res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        });
    }
};

// Update ContactUs Address by ID
const updateContactUsAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, virtualTourLink, address, phone_no, mob_no,email, fax } = req.body;
        const updatedData = {
            title,
            virtualTourLink,
            address,
            phone_no,
            mob_no,
            email,
            fax
        };

        // If a new icon is uploaded, update it
        if (req.file) {
            updatedData.icon = req.file.filename;
        }

        const updatedAddress = await ContactUSAddress.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedAddress) {
            return res.status(404).json({
                status: false,
                message: "Address not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Contact Us Address updated successfully',
            data: updatedAddress
        });
    } catch (error) {
        console.error("Error while updating contact us address", error);
        return res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        });
    }
};

// Delete ContactUs Address by ID
const deleteContactUsAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAddress = await ContactUSAddress.findByIdAndDelete(id);
        if (!deletedAddress) {
            return res.status(404).json({
                status: false,
                message: "Address not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Contact Us Address deleted successfully',
            data: deletedAddress
        });
    } catch (error) {
        console.error("Error while deleting contact us address", error);
        return res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        });
    }
};

export {createContactUsAddress, getAllContactUsAddresses , getContactUsAddressById , updateContactUsAddress , deleteContactUsAddress}