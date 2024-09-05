import BOG from "../model/bog.model.js";

const createBog = async (req,res) => {
    try {
        const {name , designation , companyName , imageLink } = req.body;

        if (!name) {
            return res.status(400).json({
                code:400,
                status:false,
                message:' name is missing'
            })
        }

        const bogData = new BOG({
            name,
            designation,
            companyName,
            imageLink
        })

        await bogData.save()

         // Respond with full URL
      res.status(201).json({
        code: 201,
        status: true,
        message: 'bog data uploaded successfully',
        data: bogData,
      });

    } catch (error) {
        console.error('Error while creating category', error);
    return res.status(500).json({
        code: 500,
        status: false,
        message: 'Error while creating category',
        data: error.message,
        });
    }
}

const getBog = async (req,res) => {
    try {
        const getbog = await BOG.find() 

        if (getBog.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No bog name and number found"
            })
        }

        return res.json({
            code: 200,
            status: true,
            message: "bog retrieved successfully",
            data: getbog
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

const getBogById = async (req, res) => {
    try {
        const { id } = req.params;
        const bog = await BOG.findById(id);

        if (!bog) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "BOG not found",
            });
        }

        return res.json({
            code: 200,
            status: true,
            message: "BOG retrieved successfully",
            data: bog,
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
 
const editBog = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, designation, companyName, imageLink } = req.body;
  
      const bogdata = await BOG.findById(id);
  
      if (!bogdata) {
        return res.status(404).json({
          code: 404,
          status: false,
          message: "BOG not found",
        });
      }
  
      // Update the existing bog document
      bogdata.name = name || bogdata.name;
      bogdata.designation = designation || bogdata.designation;
      bogdata.companyName = companyName || bogdata.companyName;
      bogdata.imageLink = imageLink || bogdata.imageLink;
  
      const updatedBog = await bogdata.save();
  
      res.status(200).json({
        code: 200,
        status: true,
        message: "BOG updated successfully",
        data: updatedBog,
      });
  
    } catch (error) {
      console.error('Error updating BOG:', error);
      return res.status(500).json({
        code: 500,
        status: false,
        message: 'An error occurred while updating the BOG.',
      });
    }
}

const deleteBog = async (req,res) => {
    try {
        const {id} = req.params;

        const bogdata = await BOG.findByIdAndDelete(id);

        if (!bogdata) {
            return res.json({
                code:404,
                status:false,
                message:"bogdata  not Found"
            });
        }

        return res.json({
            code:200,
            status:true,
            message:'bogdata  deleted successfully'
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

export {createBog ,getBog, getBogById , editBog , deleteBog}