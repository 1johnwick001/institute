import InstituteBanner from "../model/instituteBanners.model.js";
import path from "path";
import fs from "fs"



const createInstBanner = async (req, res) => {
  try {
    const { instituteName, instituteLink } = req.body;

    // Check if the institute name is provided
    if (!instituteName) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Please provide the institute name.",
      });
    }

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Please upload a banner image.",
      });
    }

    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    const instituteIconUrl = `${req.protocol}://${req.get('host')}/${req.files.instituteIcon[0].path.replace(/\\/g, '/')}`;

    // Create new instance of InstituteBanner
    const instBannerData = new InstituteBanner({
      instituteName,
      instituteLink,
      instituteImage: fileUrl, // Store the image URL
      instituteIcon: instituteIconUrl
    });

    // Save to database
    await instBannerData.save();

    // Respond with success
    res.status(201).json({
      code: 201,
      status: true,
      message: "Institute banner created successfully",
      data: instBannerData,
    });
  } catch (error) {
    console.error("Server error", error.message);
    return res.status(500).json({
      code: 500,
      status: false,
      message: "Server-side error while creating institute banners",
    });
  }
};
 
const getInstBanner = async (req,res) => {
    try {
        const instBannners = await InstituteBanner.find({});

        if (instBannners.length === 0) {
            return res.json({
                code:404,
                status:false,
                message:"No images found"
            })
        }

        return res.json({
            code:200,
            status:false,
            message:"inst banners retrieved successfully",
            data: instBannners
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

const editInstBanner = async (req, res) => {
  try {
    const { id } = req.params; // Institute banner ID from request parameters
    const { instituteName, instituteLink } = req.body; // Extract fields from request body

    // Fetch the existing InstituteBanner document by ID
    const instBannerItem = await InstituteBanner.findById(id);

    if (!instBannerItem) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Institute banner not found",
      });
    }

    const updatedFields = {}; // To hold the updated fields

    // Update institute name and link if provided and different
    if (instituteName && instituteName !== instBannerItem.instituteName) {
      updatedFields.instituteName = instituteName;
    }
    if (instituteLink && instituteLink !== instBannerItem.instituteLink) {
      updatedFields.instituteLink = instituteLink;
    }

    // Handle instituteImage (banner image)
    if (req.files && req.files['instituteImage']) {
      const file = req.files['instituteImage'][0];
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/media/${file.filename}`;
      updatedFields.instituteImage = fileUrl;
    }

    // Handle instituteIcon (logo)
    if (req.files && req.files['instituteIcon']) {
      const iconFile = req.files['instituteIcon'][0];
      const iconUrl = `${req.protocol}://${req.get("host")}/uploads/media/${iconFile.filename}`;
      updatedFields.instituteIcon = iconUrl;
    }

    // Only update if there are changes
    if (Object.keys(updatedFields).length > 0) {
      const updatedInstBanner = await InstituteBanner.findByIdAndUpdate(id, updatedFields, { new: true });

      return res.json({
        code: 200,
        status: true,
        message: 'Institute banner updated successfully',
        data: updatedInstBanner,
      });
    }

    // If no changes were made, return a message
    return res.json({
      code: 200,
      status: true,
      message: 'No changes were made to the institute banner',
      data: instBannerItem,
    });

  } catch (error) {
    console.error("Error updating institute banner:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'An error occurred while updating the institute banner.',
    });
  }
};

const deleteInstBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the InstituteBanner by ID
    const instBanner = await InstituteBanner.findById(id);

    if (!instBanner) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: 'Institute banner not found',
      });
    }

    // Extract the old file path from the instituteImage
    const oldFilePath = path.join('uploads/media', instBanner.instituteImage.split('/uploads/media/')[1]);

    // Delete the old file if it exists
    if (fs.existsSync(oldFilePath)) {
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting old file:", err);
        }
      });
    }

    // Now delete the InstituteBanner document
    await InstituteBanner.findByIdAndDelete(id);

    return res.json({
      code: 200,
      status: true,
      message: 'Institute banner deleted successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: error.message,
    });
  }
};

export  {createInstBanner , getInstBanner , editInstBanner, deleteInstBanner}