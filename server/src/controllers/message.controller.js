import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/Message.model.js"
import User from "../models/User.model.js"

export const getusersForSidebar = async (req,res) =>{
    try {
        const myuserId = req.user._id
        const fiterUser = await User.find({_id:{$ne:myuserId}}).select("-password")
        return res.status(200).json(fiterUser)
    } catch (error) {
        console.log("error fetching data", error )
        return res.status(500).json({message:"Internal server Error"})
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
        const messages= await Message.find({
            $or: [{
                senderId: myId, receiverId: userToChatId
            },{
                senderId: userToChatId, receiverId: myId
            }
        ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error getting Messages", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}
export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id
        let imageurl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageurl
        })

        await newMessage.save()
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error sending Messages", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}