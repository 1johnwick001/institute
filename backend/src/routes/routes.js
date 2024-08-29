import express from "express";
import multer from "multer"
import path from "path";

import {createCategory, deleteCategory, getCategories, updateCategory } from "../controller/category.controller.js";
import {uploadGallery,  deleteGalleryImage, editGallery, getGalleryImage } from "../controller/Gallery.controller.js";
import { deleteBanner, editBanner, getBanner, uploadBanner } from "../controller/Banner.controller.js";
import { createBlog, deleteBlog, editBlog, getBlogs } from "../controller/Blogs.controller.js";
import dashboard from "../controller/Dashboard.controller.js";


const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/media")
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
  })
  
  // File filter to accept only images and videos
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mkv|avi|wmv|mov/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only images and videos are allowed!');
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 5MB max file size
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

router.post('/api/gallery-upload',upload.single('galleryImage'), uploadGallery)
router.get('/api/gallery-images', getGalleryImage)
router.put('/api/edit-gallery/:id', upload.single('galleryImage'), editGallery);
router.delete('/api/delete-image/:id', deleteGalleryImage);

// =======Banner Images Crud ======

router.post('/api/banner-upload',upload.single('bannerImage'), uploadBanner)
router.get('/api/banner', getBanner)
router.put('/api/edit-banner/:id', upload.single('bannerImage'), editBanner);
router.delete('/api/delete-banner/:id', deleteBanner);

// =======Blogs Crud ======

router.post('/api/create-blog', upload.single('blogImage'), createBlog )
router.get(`/api/get-blogs/:id?`, getBlogs)
router.put('/api/edit-blog/:id', upload.single('blogImage') , editBlog)
router.delete('/api/delete-blog/:id', deleteBlog)

export default router