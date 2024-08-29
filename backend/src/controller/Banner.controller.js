import Banner from "../model/Banner.models.js";
import Category from "../model/category.model.js";


const uploadBanner = async (req, res) => {
    try {
      const { bannerName, category } = req.body;
  
      if (!req.file) {
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
  
      // Determine if the file is an image or video
      let mediaType;
      if (req.file.mimetype.startsWith('image/')) {
        mediaType = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      } else {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Invalid file type. Only images and videos are allowed.",
        });
      }
  
      // Create the URL for the uploaded file
      const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  
      // Save the banner data to the database
      const BannerData = new Banner({
        bannerName,
        mediaType,
        [mediaType === 'image' ? 'bannerImage' : 'bannerVideo']: fileUrl,
        category: categoryExists._id
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
        const { bannerName, category } = req.body;
        const { id } = req.params;

        // Find the banner by ID
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Banner Image not found",
            });
        }

        // Update banner name if provided
        banner.bannerName = bannerName || banner.bannerName;

        // If a new category is provided, validate it
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: "Category not found",
                });
            }
            banner.category = category; // Update the category reference
        }

        // If a new file is uploaded
        if (req.file) {
            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
            banner.bannerImage = fileUrl; // Update the file URL (either image or video)
        }

        await banner.save();

        return res.json({
            code: 200,
            status: true,
            message: 'Banner updated successfully',
            data: {
                banner,
            },
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