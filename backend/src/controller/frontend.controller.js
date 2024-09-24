import InstituteBanner from "../model/instituteBanners.model.js";
import Banner from "../model/Banner.models.js";
import Category from "../model/category.model.js";
import Blog from "../model/Blogs.model.js";
import Gallery from "../model/gallery.model.js";
import FactData from "../model/factInfo.model.js";
import DocFiles from "../model/document.model.js";
import BOG from "../model/bog.model.js";
import TabsData from "../model/Tabs.models.js";

const landingPage = async(req,res) => {
    try {

        const aboutUsCategory = await Category.findOne({ name: 'About Us' }).exec()
        const placementCategory = await Category.findOne({ name: 'Placements' }).exec()
        const factsInfoCategory = await Category.findOne({name : 'Home'}).exec()
        
// ================img/vide part===========================
        const instituteBanners = await InstituteBanner.find().exec()

        // background banners for home page
        const homeCategory = await Category.findOne({name : 'Home'});
        const bgBanner = await Banner.find({ category: homeCategory._id }).sort({ createdAt : -1}).limit(5).exec()

        // gallery images related to "home" category
        const homeGalleryImages = await Gallery.find({ category: homeCategory._id, mediaType: 'image' }).limit(50).sort({ createdAt: -1 }).exec();

        // gallery images related to "Placement" category
        const placementGalleryImages = await Gallery.find({ category: placementCategory._id, mediaType: 'image' }).limit(50).sort({ createdAt: -1 }).exec();

// ================Blogs Partttt===========================

        // top 3 blogs from "About Us" category

        const aboutUsBlogs = await Blog.find({ category : aboutUsCategory._id }).limit(3).sort({createdAt:-1}).exec()

        // top 3 blogs from "placements" category
        const placementsBlogs = await Blog.find({ category : placementCategory._id}).limit(10).sort({createdAt:-1}).exec()

        // campus life blogs 
        const campusLifeBlogs = await Blog.find({ category: homeCategory._id }).sort({ createdAt : -1}).limit(5).exec()

        // numberInfos
        const factsInfo = await FactData.find({category : factsInfoCategory._id}).exec()

        // structuring response data

        const responseData = {
            instituteBanners,
            homeBanners : bgBanner,
            galleryImages : homeGalleryImages,
            placementGallery : placementGalleryImages,

            // blogs pt
            aboutUs : aboutUsBlogs,
            placementsBlogs,
            factsInfo,
            campusLife : campusLifeBlogs
        }

        return res.status(200).json({
            code:200,
            data:responseData
        })
        
    } catch (error) {
        console.error("Error fetching home page data:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const categoryData = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the ID corresponds to a category
    const category = await Category.findById(categoryId);
    
    // Check if the ID corresponds to a tab if no category found
    const tab = !category ? await TabsData.findById(categoryId) : null;

    // If neither a category nor a tab is found, return a 404 error
    if (!category && !tab) {
      return res.status(404).json({ message: 'Category or Tab not found' });
    }

    let associatedData = {};

    if (category) {
      // Fetch subcategories if a category is found
      const subcategories = await Category.find({ parent: categoryId });
      
      // Fetch tabs associated with this category
      const tabs = await TabsData.find({ category: categoryId });

      // Fetch other data associated with the category
      const blogs = await Blog.find({ category: categoryId });
      const banner = await Banner.find({ category: categoryId });
      const gallery = await Gallery.find({ category: categoryId });
      const docs = await DocFiles.find({ category: categoryId });
      const factInfo = await FactData.find({ category: categoryId });
      const bogData = await BOG.find({ category: categoryId });

      // Compile the associated data for the category
      associatedData = {
        subcategories,
        tabs,
        blogs,
        banner,
        gallery,
        docs,
        factInfo,
        BOG: bogData,
      };
    } else if (tab) {
      // If a tab is found, fetch data associated with the tab's ID
      const blogs = await Blog.find({ tab: tab._id });
      const banner = await Banner.find({ tab: tab._id });
      const gallery = await Gallery.find({ tab: tab._id });
      const docs = await DocFiles.find({ tab: tab._id });
      const factInfo = await FactData.find({ tab: tab._id });
      const bogData = await BOG.find({ tab: tab._id });

      // Compile the associated data for the tab
      associatedData = {
        tab,
        blogs,
        banner,
        gallery,
        docs,
        factInfo,
        BOG: bogData,
      };
    }

    // Return the associated data based on the ID type (category or tab)
    return res.status(200).json({
      message:"data fetched successfully",
      data:associatedData
    });
  } catch (error) {
    console.error('Error fetching category or tab data', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

const getPlacementData = async (req, res) => {
  try {
      // Find the category with name 'Placements Data'
      const placementCategData = await Category.findOne({ name: 'Excellent Placements' }).exec();

      if (!placementCategData) {
          return res.status(404).json({
              status: false,
              message: 'Placement category not found',
          });
      }

      // Fetch other data associated with the category
      const blogs = await Blog.find({ category: placementCategData });
      const banner = await Banner.find({ category: placementCategData });
      const gallery = await Gallery.find({ category: placementCategData });
      const docs = await DocFiles.find({ category: placementCategData });
      const factInfo = await FactData.find({ category: placementCategData });
      const bogData = await BOG.find({ category: placementCategData });

      const DATA = {
        blogs,
        banner,
        gallery,
        docs,
        factInfo,
        BOG: bogData,
      };

      // Send the response back to the client
      return res.status(200).json({
          status: true,
          message: 'Placement images retrieved successfully',
          data: DATA
      });
  } catch (error) {
      // Handle any errors that may occur
      res.status(500).json({
          status: false,
          message: 'Error retrieving placement images',
          error: error.message,
      });
  }
};

const getNewsandEvents = async (req, res) => {
  try {
      
      const EventsCateg = await Category.findOne({name : 'Events'}).exec()  

      if (!EventsCateg) {
        return res.status(404).json({
            status: false,
            message: 'News and Events category not found',
        });
    }
      
      // Fetch the images related to the "Excellent Placements" tab
      // Fetch other data associated with the category
      const blogs = await Blog.find({ category: EventsCateg });
      const banner = await Banner.find({ category: EventsCateg });
      const gallery = await Gallery.find({ category: EventsCateg });
      const docs = await DocFiles.find({ category: EventsCateg });
      const factInfo = await FactData.find({ category: EventsCateg });
      const bogData = await BOG.find({ category: EventsCateg });

      const Data = {
        blogs,
        banner,
        gallery,
        docs,
        factInfo,
        BOG: bogData,
      };

      // Send the response back to the client
      return res.status(200).json({
          status: true,
          message: 'Events  retrieved successfully',
          data: Data,
      });
  } catch (error) {
      // Handle any errors that may occur
      res.status(500).json({
          status: false,
          message: 'Error retrieving placement images',
          error: error.message,
      });
  }
};

const MouCards = async (req, res) => {
  try {
      // Find the category with the name 'MOU'
      const MouCard = await Category.findOne({ name: 'MOU' }).exec();

      // If the category is not found, return a 404 response
      if (!MouCard) {
        return res.status(404).json({
            status: false,
            message: 'MoU category not found',
        });
      }

      // Fetch related data associated with the category's _id
      const blogs = await Blog.find({ category: MouCard._id });
      const banner = await Banner.find({ category: MouCard._id });
      const gallery = await Gallery.find({ category: MouCard._id });
      const docs = await DocFiles.find({ category: MouCard._id });
      const factInfo = await FactData.find({ category: MouCard._id });
      const bogData = await BOG.find({ category: MouCard._id });

      // Combine the associated data
      const associatedData = {
        blogs,
        banner,
        gallery,
        docs,
        factInfo,
        BOG: bogData,
      };

      // Send the response back to the client
      return res.status(200).json({
          status: true,
          message: 'MoU Cards retrieved successfully',
          data: associatedData,
      });
  } catch (error) {
      // Handle any errors that may occur
      res.status(500).json({
          status: false,
          message: 'Error retrieving MoU data',
          error: error.message,
      });
  }
};

export  {landingPage , categoryData ,getPlacementData, getNewsandEvents ,MouCards}