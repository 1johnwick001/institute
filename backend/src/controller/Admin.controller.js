import Admin from "../model/Admin.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const saltRounds = 10

const registerAdmin = async(req,res) => {
    try {
        // Extract  email and password from the request body

        const {email, password} = req.body

        // Hash password using bcrypt
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // new admin instance
        const newAdmin = new Admin({
            email,
            password : hashPassword
        })

        // If a user with the same email  already exists then handling error
        const exisitingUser = await Admin.findOne({email})

        if (exisitingUser) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"EMAIL ALREADY REGISTERED!!!",
            })
        }
        else if (password.length < 4) {
            return res.status(209).json({
                code:209,
                status:false,
                message:"password must be 4 charaacter long",
                data:{}
            })
        }

        await newAdmin.save()

        return res.status(201).json({
            code:201,
            status:true,
            message:"Admin successfully registered",
        })

    } catch (error) {
        console.error("Error while registering admin",error);
        return res.status(500).json({
            code : 500,
            status:false,
            message:"Error wjile registering admin",
            data:{}
        })
    }
}

const loginAdmin = async(req,res) => {

    try {

        const {email , password} = req.body

        // find user by email to verify existance

        const admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"Admin with provided email does not exist"
            })
        }

        const matchPassword = await bcrypt.compare(password, admin.password)

        if (!matchPassword) {
            return res.status(404).json({
                code:404,
                status:false,
                message:"XXX INCORRECT PASSWORD XXX"
            })
        }

        // token generation
        const token = jwt.sign({
            email:admin.email,
            id : admin._id
        },process.env.JWT_SECRET_KEY)

        return res.status(200).json({
            code:200,
            status:true,
            message:"Admin logged in successfully",
            data:admin,
            token:token
        })
        
    } catch (error) {
        console.error("Error while logging in admin",error);
        return res.status(500).json({
            code:500,
            status:false,
            message:"Server side Error while logging  Admin",
        });
    };

}

export  {registerAdmin, loginAdmin}