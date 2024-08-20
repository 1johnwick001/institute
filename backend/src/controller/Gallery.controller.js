import Image from "../model/Images.model.js";


const uploadGalleryImage = async (req,res) => {
    try {

        const {imageName} = req.body;

        if (!req.file) {
            return res.json({
                code:400,
                status:false,
                message:"please upload an imag",
            })
        }
    
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

        const galleryData = new Image ({
            imageName,
            image : fileUrl
        });

        galleryData.save()
        
    
        // Respond with full URL
        res.status(201).json({
            code: 201,
            status: true,
            message: 'Image uploaded successfully',
            data: {
               galleryData
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

const getGalleryImage = async (req, res) => {
    try {

        const images = await Image.find({}); //fetch all images from the database

        if (images.length === 0) {
            return res.json({
                code:404,
                status:false,
                message:"No images found"
            })
        }

        return res.json({
            code:200,
            status:false,
            message:"Images retrieved successfully",
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

const editGalleryImage = async(req,res) => {
    try {
        const { imageName } = req.body;
        const { id } = req.params;

        // find the image by id
        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Image not found",
            }); 
        }

        // update image details
        image.imageName = imageName || image.imageName

        // If a new file is uploaded
        if (req.file) {
            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            image.image = fileUrl;
        }

        await image.save()

        return res.json({
            code: 200,
            status: true,
            message: 'Image updated successfully',
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

const deleteGalleryImage = async (req,res) => {
    try {

        const {id} = req.params;

          // Find and delete the image by ID
          const image = await Image.findByIdAndDelete(id);

          if (!image) {
            return res.json({
                code:404,
                status:false,
                message:"Image not Found"
            });
        }

        return res.json({
            code:200,
            status:true,
            message:'Image deleted successfully'
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

export  {uploadGalleryImage , getGalleryImage ,editGalleryImage, deleteGalleryImage}