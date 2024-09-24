import Category from "../model/category.model.js";
import Gallery from "../model/gallery.model.js";
import Blog from "../model/Blogs.model.js";
import BannerImage from "../model/Banner.models.js";
import Application from "../model/applicationForm.model.js";
import Feedback from "../model/feedbackForms.model.js";
import ContactUs from "../model/contactUs.model.js";

const dashboard = async (req,res) => {
    try {

        // fetching counts from the database
        const totalCategories = await Category.countDocuments({ parent: null });
        const totalImages = await Gallery.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalBannerImages = await BannerImage.countDocuments();
        const totalApplicationForms = await Application.countDocuments();
        const totalFeedbackForms = await Feedback.countDocuments();
        const totalContactUsForms = await ContactUs.countDocuments();

        const data = {
            totalCategories,
            totalImages,
            totalBlogs,
            totalBannerImages,
            totalApplicationForms,
            totalFeedbackForms,
            totalContactUsForms
        }

        // send the counts as a response
        return res.json({
            code:200,
            status:true,
            message:'dashboard data fetched successfully',
            data:data
        });
        
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
         error: 'Failed to fetch dashboard statistics' });
    }
}


export default dashboard