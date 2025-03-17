import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import dotenv from "dotenv"

dotenv.config()

export const protectRoute= async (req,res,next) =>{
    try {
        
        const token = req.cookies.jwt
        if(!token) {
            return res.status(401).json({message: "Not Authenticated"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Token Invalid"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        req.user = user;
        next()

    } catch (error) {
        console.log("Error", error.message)
        return res.status(500).json({message:"Internal Server Error"})
    }
}