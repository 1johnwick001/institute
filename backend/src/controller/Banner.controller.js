import Banner from "../model/Banner.models.js";
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";
import path from "path";
import fs from "fs"


const uploadBanner = async (req, res) => {
    try {
      const { bannerName, category , mediaType , tab } = req.body;
  
      if (!bannerName) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Please upload a banner image or video",
        });
      }

      if (!req.file) {
        return res.json({
            code:400,
            status:false,
            message:"please upload an banner image",
        })
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  
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
  
  
      // Save the banner data to the database
      const BannerData = new Banner({
        bannerName,
        mediaType,
        bannerImage:fileUrl,
        category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
        tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      });
  
      await BannerData.save();
  
      
      return res.status(201).json({
        code: 201,
        status: true,
        message: 'Banner media uploaded successfully',
        data: BannerData,
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

const getBanner = async (req, res) => {
    try {
        const banners = await Banner.find({}); // Fetch all banners from the database

        if (banners.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No Banner images or videos found"
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: "Banner images and videos retrieved successfully",
            data: banners
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

const editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { bannerName, mediaType } = req.body;

    // Find the banner by ID
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Banner not found",
      });
    }

    const updatedFields = {};

    // If a new file is uploaded, delete the previous file and update the file URL
    if (req.file) {
      // Extract old file path
      const oldFilePath = path.join('uploads/media', banner.bannerImage.split('/uploads/media/')[1]);

      // Delete the old file if it exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old file:", err);
          }
        });
      }

      // Update with the new file URL
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/media/${req.file.filename}`;
      updatedFields.bannerImage = fileUrl;
    }

    // Update banner name if provided
    if (bannerName && bannerName !== banner.bannerName) {
      updatedFields.bannerName = bannerName;
    }

    // Update mediaType if provided
    if (mediaType && mediaType !== banner.mediaType) {
      updatedFields.mediaType = mediaType;
    }

    // Update the banner in the database
    const updatedBanner = await Banner.findByIdAndUpdate(id, updatedFields, { new: true });

    return res.json({
      code: 200,
      status: true,
      message: 'Banner updated successfully',
      data: updatedBanner,
    });

  } catch (error) {
    console.error('Error updating banner:', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: 'An error occurred while updating the banner.',
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the banner by ID
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Banner not found",
      });
    }

    // Get the image file path from the banner's image URL
    const oldFilePath = path.join('uploads/media', banner.bannerImage.split('/uploads/media/')[1]);

    // Delete the old image file from the server
    if (fs.existsSync(oldFilePath)) {
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting banner image:", err);
        } else {
          console.log("Old banner image deleted successfully");
        }
      });
    }

    // Delete the banner from the database
    await Banner.findByIdAndDelete(id);

    return res.json({
      code: 200,
      status: true,
      message: "Banner deleted successfully and image unlinked from server",
    });

  } catch (error) {
    console.error('Error deleting banner:', error);
    return res.status(500).json({
      code: 500,
      status: false,
      message: "An error occurred while deleting the banner.",
    });
  }
};

export  {uploadBanner , getBanner ,editBanner, deleteBanner}