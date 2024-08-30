import InstituteBanner from "../model/instituteBanners.model.js";

const createInstBanner = async (req, res) => {
    try {
      const { instituteName, instituteLink } = req.body;
  
      // Check if files are uploaded properly
      if (!req.files || !req.files.instituteImage || !req.files.instituteIcon) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Please upload both institute image and icon.",
        });
      }
  
      // Construct file URLs based on where your server serves static files
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const instituteIcon = `${baseUrl}/uploads/media/${req.files.instituteIcon[0].filename}`;
      const instituteImage = `${baseUrl}/uploads/media/${req.files.instituteImage[0].filename}`;
  
      // Create new instance of InstituteBanner
      const instBannerData = new InstituteBanner({
        instituteName,
        instituteImage,
        instituteIcon,
        instituteLink,
      });
  
      // Save to database
      await instBannerData.save();
  
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
      const { instituteName, instituteLink } = req.body;
  
      // Fetch the existing InstituteBanner document by ID
      const instBannerItem = await InstituteBanner.findById(id);
  
      if (!instBannerItem) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "Institute banner not found",
        });
      }
  
      // Update fields if they are present in the request
      if (instituteName) {
        instBannerItem.instituteName = instituteName;
      }
      if (instituteLink) {
        instBannerItem.instituteLink = instituteLink;
      }
  
      // Check if there are new files uploaded (images or icons)
      if (req.files && req.files.instituteImage) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        instBannerItem.instituteImage = `${baseUrl}/uploads/media/${req.files.instituteImage[0].filename}`;
      }
  
      if (req.files && req.files.instituteIcon) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        instBannerItem.instituteIcon = `${baseUrl}/uploads/media/${req.files.instituteIcon[0].filename}`;
      }
  
      // Save the updated document to the database
      await instBannerItem.save();
  
      return res.status(200).json({
        code: 200,
        status: true,
        message: "Institute banner updated successfully",
        data: instBannerItem,
      });
  
    } catch (error) {
      console.error("Server error", error.message);
      return res.status(500).json({
        code: 500,
        status: false,
        message: "Server-side error while editing institute banner",
      });
    }
};

const deleteInstBanner = async(req,res) => {
    try {
        const {id} = req.params;

        // find and delete the image by ID
        const instBanner = await InstituteBanner.findByIdAndDelete(id);

        if (!instBanner) {
            return res.json({
                code:404,
                status:false,
                message:'Inst banner not found'
            })
        }

        return res.json({
            code:200,
            status:true,
            message:'inst banner deleted successfully'
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

export  {createInstBanner , getInstBanner , editInstBanner, deleteInstBanner}