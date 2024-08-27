import Category from "../model/category.model.js";
import Image from "../model/Images.model.js";
import Blog from "../model/Blogs.model.js";
import BannerImage from "../model/Banner.models.js";

const dashboard = async (req,res) => {
    try {

        // fetching counts from the database
        const totalCategories = await Category.countDocuments({ parent: null });
        const totalImages = await Image.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalBannerImages = await BannerImage.countDocuments();

        const data = {
            totalCategories,
            totalImages,
            totalBlogs,
            totalBannerImages
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