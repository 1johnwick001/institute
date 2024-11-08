import express from "express";
import { loginAdmin, registerAdmin, updateAdmin } from "../controller/Admin.controller.js";
import Auth from "../middleware/Auth.js";



const router = express.Router()



// admin auth apis
router.post('/api/admin/register', registerAdmin)
router.post('/api/admin/login', loginAdmin)
router.put('/api/admin/update',Auth ,updateAdmin)

export default router