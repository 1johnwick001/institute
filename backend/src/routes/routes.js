import express from "express";
import multer from "multer"
import path from "path";

import {createCategory, deleteCategory, getCategories, updateCategory } from "../controller/category.controller.js";
import {uploadGalleryImage,  deleteGalleryImage, editGalleryImage, getGalleryImage } from "../controller/Gallery.controller.js";
import { deleteBannerImage, editBannerImage, getBannerImage, uploadBannerImage } from "../controller/Banner.controller.js";
import { createBlog, deleteBlog, editBlog, getBlogs } from "../controller/Blogs.controller.js";
import dashboard from "../controller/Dashboard.controller.js";


const router = express.Router()

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"uploads/images")
    },filename:(req,file,cb) => {
        cb(null,file.fieldname + "-" + Date.now() + path.extname (file.originalname))
    }
})

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
};

const upload = multer({
    storage:storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
    fileFilter: fileFilter
})

// dashboard route
router.get('/api/get-dashboard',dashboard)

// category routes

router.post('/api/create-category',createCategory)
router.get('/api/get-categories',getCategories)
router.put('/api/update-category/:id',updateCategory)
router.delete('/api/delete-category/:id',deleteCategory)

// =======Gallery Crud ======

router.post('/api/gallery-upload',upload.single('image'), uploadGalleryImage)
router.get('/api/gallery-images', getGalleryImage)
router.put('/api/edit-image/:id', upload.single('image'), editGalleryImage);
router.delete('/api/delete-image/:id', deleteGalleryImage);

// =======Banner Images Crud ======

router.post('/api/banner-upload',upload.single('bannerImage'), uploadBannerImage)
router.get('/api/banner-images', getBannerImage)
router.put('/api/edit-bannerImage/:id', upload.single('bannerImage'), editBannerImage);
router.delete('/api/delete-bannerImage/:id', deleteBannerImage);

// =======Blogs Crud ======

router.post('/api/create-blog', upload.single('blogImage'), createBlog )
router.get(`/api/get-blogs/:id?`, getBlogs)
router.put('/api/edit-blog/:id', upload.single('blogImage') , editBlog)
router.delete('/api/delete-blog/:id', deleteBlog)

export default router