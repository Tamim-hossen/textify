import bcrypt from "bcrypt"
import User from "../models/User.model.js"
import  generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup =async (req,res)=>{
    const {fullName,email,password}= req.body
    try {
        if(password.length < 6) {
            return res.status(400).json({message :"Password too short!!"})
        }
        if(!fullName||!email||!password){
            return res.status(400).json({message : "All fields must be Provided!"})
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message : "Email already Registered"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass =await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName : fullName,
            email : email,
            password: hashedPass
        })

        if (newUser){
            await newUser.save()
            return res.status(201).json({
                _id: newUser._id,
                fullName : newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            })
            
        }
        else{
           return res.status(400).json({message:"Invalid User Data"})
        }
    } catch (error) {
        console.log("Error In Signup", error.message)
        return res.status(500).json({message:"Internal Server Error"})
        
    }
}
export const login =async (req,res)=>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        generateToken(user._id,res)

        res.status(200).json({
            _id: user._id,
                fullName : user.fullName,
                email: user.email,
                profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error Login", error.message)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        return res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
         console.log("Error Logout", error.message)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const updateProfile =async (req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Invalid Profile Pic"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
        return res.status(200).json({updatedUser})
    } catch (error) {
        console.log("Error updating Profile", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const checkAuth = async(req,res)=>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("Error checking Authenticity", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}