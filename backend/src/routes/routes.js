import express from "express";
import multer from "multer";
import path from "path";

import {createCategory, deleteCategory, getCategories, updateCategory } from "../controller/category.controller.js";
import {uploadGalleryImage,  deleteGalleryImage, editGalleryImage, getGalleryImage } from "../controller/Gallery.controller.js";


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

router.post('/api/create-category',createCategory)
router.get('/api/get-categories',getCategories)
router.put('/api/update-category/:id',updateCategory)
router.delete('/api/delete-category/:id',deleteCategory)

// =======Gallery Crud ======

router.post('/api/gallery-upload',upload.single('image'), uploadGalleryImage)

router.get('/api/gallery-images', getGalleryImage)

router.put('/api/edit-image/:id', upload.single('image'), editGalleryImage);

router.delete('/api/delete-image/:id', deleteGalleryImage);

export default router