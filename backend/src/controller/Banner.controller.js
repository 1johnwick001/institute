import Banner from "../model/Banner.models.js";
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";

const uploadBanner = async (req, res) => {
    try {
      const { bannerName, category , mediaType , bannerImage, tab } = req.body;
  
      if (!bannerName) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Please upload a banner image or video",
        });
      }
  
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
        bannerImage,
        category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
        tab: tabExists ? tabExists._id : null, // Associate with tab if provided
      });
  
      await BannerData.save();
  
      // Respond with full URL
      res.status(201).json({
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
      const { bannerName, bannerImage, mediaType } = req.body;

      // Find the banner by ID
      const banner = await Banner.findById(id);

      if (!banner) {
          return res.status(404).json({
              code: 404,
              status: false,
              message: "Banner not found",
          });
      }

      // Update banner details if provided
      if (bannerName && bannerName !== banner.bannerName) {
          banner.bannerName = bannerName;
      }

      if (bannerImage && bannerImage !== banner.bannerImage) {
          banner.bannerImage = bannerImage;
      }

      if (mediaType && mediaType !== banner.mediaType) {
          banner.mediaType = mediaType;
      }

      // Save the updated banner
      await banner.save();

      return res.json({
          code: 200,
          status: true,
          message: 'Banner updated successfully',
          data:  banner ,
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


const deleteBanner = async (req,res) => {
    try {

        const {id} = req.params;

          // Find and delete the image by ID
          const image = await Banner.findByIdAndDelete(id);

          if (!image) {
            return res.json({
                code:404,
                status:false,
                message:"Banner Image not Found"
            });
        }

        return res.json({
            code:200,
            status:true,
            message:'Banner Image deleted successfully'
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

export  {uploadBanner , getBanner ,editBanner, deleteBanner}