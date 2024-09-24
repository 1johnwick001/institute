import express from "express";
import multer from "multer"
import path from "path";

import {createCategory, deleteCategory, getCategories, getCategoriesLevel2AndAbove, updateCategory } from "../controller/category.controller.js";
import {uploadGallery,  deleteGalleryImage, editGallery, getGalleryImage } from "../controller/Gallery.controller.js";
import { deleteBanner, editBanner, getBanner, uploadBanner } from "../controller/Banner.controller.js";
import { createBlog, deleteBlog, editBlog, getBlogs } from "../controller/Blogs.controller.js";
import dashboard from "../controller/Dashboard.controller.js";
import  {createInstBanner, deleteInstBanner, editInstBanner, getInstBanner } from "../controller/InstituteBanner.controller.js";
import { createDoc, deleteDoc, editDoc, getDoc } from "../controller/document.controller.js";
import {landingPage, categoryData, getPlacementData, getNewsandEvents, MouCards } from "../controller/frontend.controller.js";
import { createFactInfo, deleteFactInfo, editFactsInfo, getFactsInfo } from "../controller/factInfo.controller.js";
import { createBog, deleteBog, editBog, getBog, getBogById } from "../controller/bog.controller.js";
import { createApplicationForm,getApplicationForm ,viewApplicationById, deleteApplicationForm} from "../controller/ApplicationForm.controller.js";
import { createContactUs, viewContactUs, deleteContactUs, getContacts } from "../controller/ContactUs.controller.js";
import { createTab, deleteTab, getTabs, getTabsByCategory, updateTab } from "../controller/tabs.controller.js";
import { createFeedback, deleteFeedback, getFeedBackForm, viewFeedbackById } from "../controller/feedback.controller.js";


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
    const fileTypes = /jpeg|jpg|png|gif|mp4|mkv|avi|wmv|mov|pdf|doc|docx|xls|xlsx|ppt|pptx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only pdf and docs are allowed!');
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 500 }, // 500MB max file size
    fileFilter: fileFilter
  })

  // -----------------------------------------------multer config for docs ----------------------------------------------------
  const docStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/docs");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const docUpload = multer({
    storage: docStorage,
    limits: { fileSize: 1024 * 1024 * 500 }, // 50MB max file size
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only documents are allowed!');
        }
    }
});

// dashboard route
router.get('/api/get-dashboard',dashboard)

// docfile routes
router.post('/api/upload-doc',docUpload.single('file'),createDoc)
router.get('/api/get-doc',getDoc)
router.put('/api/edit-doc/:id',docUpload.single('file'),editDoc);
router.delete('/api/delete-doc/:id',deleteDoc)

// category routes

router.post('/api/create-category',createCategory)
router.get('/api/get-categories',getCategories)
router.get('/api/get-categories-level',getCategoriesLevel2AndAbove)
router.put('/api/update-category/:id',updateCategory)
router.delete('/api/delete-category/:id',deleteCategory)

// tabs routes

router.post('/api/create-tabs',createTab)
router.get('/api/get-tabs',getTabs)
router.get('/api/get-tabs-by-category/:categoryId',getTabsByCategory)
router.put('/api/update-tabs/:id',updateTab)
router.delete('/api/delete-tab/:id',deleteTab)

// =======Gallery Crud ======

router.post('/api/gallery-upload',upload.single('galleryImage'), uploadGallery)
router.get('/api/gallery-images', getGalleryImage)
router.put('/api/edit-gallery/:id', upload.single('galleryImage'),editGallery);
router.delete('/api/delete-image/:id', deleteGalleryImage);

// =======Banner Images Crud ======

router.post('/api/banner-upload',upload.single('bannerImage') , uploadBanner)
router.get('/api/banner', getBanner)
router.put('/api/edit-banner/:id',upload.single('bannerImage'), editBanner);
router.delete('/api/delete-banner/:id', deleteBanner);

// =======Blogs Crud ======

router.post('/api/create-blog',upload.single('images'), createBlog )
router.get(`/api/get-blogs/:id?`, getBlogs)
router.put('/api/edit-blog/:id', upload.single('blogImage'), editBlog)
router.delete('/api/delete-blog/:id', deleteBlog)

// =======facts info Crud ======
router.post('/api/create-factsInfo', createFactInfo)
router.get('/api/get-factsInfo', getFactsInfo)
router.put('/api/edit-factsInfo/:id', editFactsInfo)
router.delete('/api/delete-factsInfo/:id', deleteFactInfo)

// =======BOG Crud ======
router.post('/api/create-bog',upload.single('image'),createBog)
router.get('/api/get-bog',getBog)
router.get('/api/get-bog/:id',getBogById)
router.put('/api/edit-bog/:id',upload.single('image'),editBog)
router.delete('/api/delete-bog/:id',deleteBog)

// =======instittue banner Crud ======
router.post('/api/create-inst-banner',upload.single('instituteImage'), createInstBanner);
router.get('/api/get-inst-banners', getInstBanner);
router.put('/api/edit-inst-banner/:id',upload.single('instituteImage'), editInstBanner);
router.delete('/api/delete-inst-banner/:id',deleteInstBanner)

// for application form
router.post('/api/apply',upload.single('resume'), createApplicationForm)
router.get('/api/getApplicationForm', getApplicationForm)
router.get('/api/getApplicationById/:id', viewApplicationById)
router.delete('/api/deleteApplicationForm/:id', deleteApplicationForm)

// for contactUs forms
router.post('/api/contact-us',createContactUs)
router.get('/api/getContactUsForm', getContacts)
router.get('/api/getContactUsById/:id', viewContactUs)
router.delete('/api/deleteContactForm/:id', deleteContactUs)

// feedback forms
router.post('/api/create-feedback',createFeedback)
router.get('/api/get-feedback',getFeedBackForm)
router.get('/api/getFeedbackById/:id',viewFeedbackById)
router.delete('/api/delete-feedback/:id',deleteFeedback)

// routes to send data to frontend
router.get('/api/get-landingPage',landingPage)
router.get('/api/get-placementData',getPlacementData)
router.get('/api/get-eventsAndNews',getNewsandEvents)
router.get('/api/get-MoU',MouCards)
router.post('/api/get-data/:id',categoryData)

export default router