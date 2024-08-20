import BannerImage from "../model/Banner.models.js";


const uploadBannerImage = async (req,res) => {
    try {

        const {bannerName} = req.body;

        if (!req.file) {
            return res.json({
                code:400,
                status:false,
                message:"please upload an banner image",
            })
        }
    
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

        const BannerData = new BannerImage ({
            bannerName,
            bannerImage : fileUrl
        });

        BannerData.save()
        
    
        // Respond with full URL
        res.status(201).json({
            code: 201,
            status: true,
            message: 'Banner Image uploaded successfully',
            data: {
               BannerData
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code:500,
            status:false,
            message:error.message,
        })
    }
}

const getBannerImage = async (req, res) => {
    try {

        const images = await BannerImage.find({}); //fetch all images from the database

        if (images.length === 0) {
            return res.json({
                code:404,
                status:false,
                message:"No Banner images found"
            })
        }

        return res.json({
            code:200,
            status:false,
            message:"Banner Images retrieved successfully",
            data: images
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

const editBannerImage = async(req,res) => {
    try {
        const { bannerName } = req.body;
        const { id } = req.params;

        // find the image by id
        const image = await BannerImage.findById(id);

        if (!image) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "BAnner Image not found",
            }); 
        }

        // update image details
        image.bannerName = bannerName || image.bannerName

        // If a new file is uploaded
        if (req.file) {
            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            image.bannerImage = fileUrl;
        }

        await image.save()

        return res.json({
            code: 200,
            status: true,
            message: 'Banner Image updated successfully',
            data: {
                image
            }
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

const deleteBannerImage = async (req,res) => {
    try {

        const {id} = req.params;

          // Find and delete the image by ID
          const image = await BannerImage.findByIdAndDelete(id);

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

export  {uploadBannerImage , getBannerImage ,editBannerImage, deleteBannerImage}