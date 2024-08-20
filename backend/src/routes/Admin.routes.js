import express from "express";
import { loginAdmin, registerAdmin } from "../controller/Admin.controller.js";



const router = express.Router()



// admin auth apis
router.post('/api/admin/register', registerAdmin)
router.post('/api/admin/login', loginAdmin)

export default router