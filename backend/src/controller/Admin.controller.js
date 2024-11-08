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
            return res.status(409).json({
                code:209,
                status:false,
                message:"EMAIL ALREADY REGISTERED!!!",
            })
        }
        else if (password.length < 4) {
            return res.status(409).json({
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
            message:"Error while registering admin",
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
                message:"XXX---XXX INCORRECT PASSWORD XXX---XXX"
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

const updateAdmin = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const adminId = req.userId; //   middleware that sets req.adminId from the login token

        // Find the admin by ID
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                code: 404,
                status: false,
                message: "Admin not found"
            });
        }

        // Update email if provided
        if (email) {
            // Check if the new email is already in use
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: "Email is already in use"
                });
            }
            admin.email = email;
        }

        // Update password if provided
        if (newPassword) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedPassword;
        }

        // Save the updated admin
        await admin.save();

        return res.status(200).json({
            code: 200,
            status: true,
            message: "Admin updated successfully",
            data: {
                email: admin.email,
                // You can include other fields if necessary
            }
        });

    } catch (error) {
        console.error("Error while updating admin", error);
        return res.status(500).json({
            code: 500,
            status: false,
            message: "Server side error while updating admin",
        });
    }
};

export  {registerAdmin, loginAdmin, updateAdmin}