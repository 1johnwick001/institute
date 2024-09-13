import FactData from "../model/factInfo.model.js";
import Category from "../model/category.model.js";
import TabsData from "../model/Tabs.models.js";


const createFactInfo = async (req,res) => {
    try {
        const {factName , factNumber , category ,tab} = req.body;

        if (!factName) {
            return res.status(400).json({
                code:400,
                status:false,
                message:'Fact name is missing'
            })
        }

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

        const factsData = new FactData({
            factName,
            factNumber,
            category: tabExists ? null : categoryExists._id, // Only associate with category if no tab is provided
            tab: tabExists ? tabExists._id : null, // Associate with tab if provided
        })

        await factsData.save()

        // Respond with full URL
      res.status(201).json({
        code: 201,
        status: true,
        message: 'facts data uploaded successfully',
        data: factsData,
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

const getFactsInfo = async (req,res) => {
    try {
        const getfacts = await FactData.find() 

        if (getfacts.length === 0) {
            return res.json({
                code: 404,
                status: false,
                message: "No facts name and number found"
            })
        }

        return res.json({
            code: 200,
            status: true,
            message: "facts name and number retrieved successfully",
            data: getfacts
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

const editFactsInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { factName, factNumber } = req.body;

        const facts = await FactData.findById(id);

        if (!facts) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Facts not found",
            });
        }

        // Merge the existing facts document with the updated fields
        const updatedFacts = await FactData.findByIdAndUpdate(
            id,
            {
                factName: factName || facts.factName, // Update factName if provided
                factNumber: factNumber || facts.factNumber, // Update factNumber if provided
            },
            { new: true } // Return the updated document
        );

        res.status(200).json({
            code: 200,
            status: true,
            message: "Facts updated successfully",
            data: updatedFacts,
        });

    } catch (error) {
        console.error('Error updating facts:', error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: 'An error occurred while updating the facts.',
        });
    }
}

const deleteFactInfo = async (req,res) => {
    try {
        const {id} = req.params;

        const facts = await FactData.findByIdAndDelete(id);

        if (!facts) {
            return res.json({
                code:404,
                status:false,
                message:"facts  not Found"
            });
        }

        return res.json({
            code:200,
            status:true,
            message:'facts  deleted successfully'
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


export  {createFactInfo , getFactsInfo , editFactsInfo , deleteFactInfo}