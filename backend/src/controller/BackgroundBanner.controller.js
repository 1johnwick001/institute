import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';
import BackgroundBanner from "../model/BackgroundBanner.model.js";


// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createbgbanner = async (req, res) => {
    try {
        const { heading, subHeading } = req.body;

        const image = req.file.path.replace(/\\/g, '/'); // Get the path of the uploaded file

        const bbanner = new BackgroundBanner({
            heading,
            subHeading,
            image
        });

        await bbanner.save();

        res.status(201).json({
            status:true,
            message:"background banner created successfully",
            data : bbanner
        });

    } catch (error) {
        res.status(500).json({
            status:false,
            message: error.message 
        });
    }
};

const getBgBanner= async (req, res) => {
    try {

        const bgBanner = await BackgroundBanner.find();

        res.status(200).json({
            status:true,
            message:"background banners fetched successfully",
            data: bgBanner
        });
    } catch (error) {
        res.status(500).json({ 
            status:false,
            message: error.message 
        });
    }
};

const getBgBannerById = async (req, res) => {
    try {
        const { id } = req.params;

        const bgbanner = await BackgroundBanner.findById(id);

        if (!bgbanner) {
            return res.status(404).json({ message: 'Background Banner not found' });
        }
        return res.status(200).json({
            status:true,
            message:"bgbanner  by id fetched successfully",
            data : bgbanner
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateBgBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find the existing service
        const existingService = await BackgroundBanner.findById(id);
        if (!existingService) {
            return res.status(404).json({ message: 'background banner not found' });
        }

        // If a new logo is uploaded, unlink the previous one
        if (req.file) {
            const previousLogoPath = existingService.image;
            // Unlink the previous logo from the filesystem
            fs.unlink(path.join(__dirname, '..','..', previousLogoPath), (err) => {
                if (err) {
                    console.error("Failed to delete the previous image:", err);
                }
            });

            // Update the logo path in the updated data
            updatedData.image = req.file.path.replace(/\\/g, '/'); // Set the new logo path
        }

        // Update the service with new data
        const updatedService = await BackgroundBanner.findByIdAndUpdate(id, updatedData, { new: true });

        return res.status(200).json({
            status:true,
            message:" background banner updated successfully",
            data:updatedService
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBgBanner = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service to delete
        const serviceToDelete = await BackgroundBanner.findById(id);

        if (!serviceToDelete) {
            return res.status(404).json({ message: 'BackgroundBanner not found' });
        }

        // Get the path of the logo to unlink
        const imagePath = serviceToDelete.image;

        // Delete the service from the database
        await BackgroundBanner.findByIdAndDelete(id);

        // Unlink the logo from the filesystem
        fs.unlink(path.join(__dirname, '..','..', imagePath), (err) => {
            if (err) {
                console.error("Failed to delete the image:", err);
            }
        });

        return res.status(200).json({
            status:true,
            message:"Background banner deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export {createbgbanner, getBgBanner, getBgBannerById, updateBgBanner, deleteBgBanner}