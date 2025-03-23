import bcrypt from "bcrypt"
import mongoose from "mongoose"
import User from "../models/User.model.js"
import generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password too short!!" })
        }
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields must be Provided!" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already Registered" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPass
        })

        if (newUser) {
            await newUser.save()
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            })

        }
        else {
            return res.status(400).json({ message: "Invalid User Data" })
        }
    } catch (error) {
        console.log("Error In Signup", error.message)
        return res.status(500).json({ message: "Internal Server Error" })

    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error Login", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ message: "Logged out Successfully" })
    } catch (error) {
        console.log("Error Logout", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Invalid Profile Pic" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        return res.status(200).json({ updatedUser })
    } catch (error) {
        console.log("Error updating Profile", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const addToFriendList = async (req, res) => {
    const { id:reqId} = req.params
    const objectId = new mongoose.Types.ObjectId(reqId)
    const userId = req.user._id

    const userData =await User.findById(userId)
    const requestData =await User.findById(objectId)

    if(!userData.receivedFriendRequests.map((id)=>id.toString()).includes(reqId)){
        return res.status(400).json({message:"User Not Found"})
    }

    const updatedUser1Friendlist = [...userData.friendsList,objectId]
    const updatedUser2Friendlist = [...requestData.friendsList,userId]
    const updatedUser1ReceivedRequst = userData.receivedFriendRequests.filter((id)=> !id.equals(objectId))
    const updatedUser2SentRequests =  requestData.sentFriendRequests.filter((id)=> !id.equals(userId))

    userData.friendsList = updatedUser1Friendlist;
    userData.receivedFriendRequests =updatedUser1ReceivedRequst;
    requestData.friendsList = updatedUser2Friendlist;
    requestData.sentFriendRequests = updatedUser2SentRequests;

    userData.save()
    requestData.save()

    return res.status(200).json({message: "Request Accepted"})
}
export const removeFromfriendList = async (req, res) => {
    const {id:friendId}  = req.params
    const objectId = new mongoose.Types.ObjectId(friendId);
    const userId = req.user._id;
    const user1 = await User.findById(userId)
    const user2 = await User.findById(objectId)
    const friendsList = user1.friendsList.map(id => id.toString());

    if (!friendsList.includes(friendId)) {
        return res.status(400).json({ message: "User not in Friends List" })
    }
    const updatedFriendsList = user1.friendsList.filter(id => !id.equals(objectId))
    const updatedFriendsList2 = user2.friendsList.filter(id => !id.equals(userId))
    user1.friendsList = updatedFriendsList
    user2.friendsList = updatedFriendsList2
    user1.save()
    user2.save()
    return res.status(200).json({ message: "User Removed from Friend List Successfully" })
}
export const addToBlockList = async (req, res) => {
    const {id:blockId}  = req.params
    const userId = req.user._id;
    const objectId = new mongoose.Types.ObjectId(blockId);
    const updatedUser = await User.findById(userId)
    const blockList = updatedUser.blockList.map((id) => id.toString())
    const friendsList = updatedUser.friendsList
    if (blockList.includes(blockId)) {
        return res.status(400).json({ message: "User Already Blocked" })
    }
    const updatedFriendsList = friendsList.filter(id => !id.equals(objectId))
    const updatedBlockList = [...updatedUser.blockList, objectId]
    updatedUser.blockList = updatedBlockList
    updatedUser.friendsList = updatedFriendsList
    updatedUser.save()
    return res.status(200).json({ message: "User Blocked Successfully" })
}
export const removeFromBlockList = async (req, res) => {
    const { id:blockUserId } = req.params;
    const userId = req.user._id
    const objectId = new mongoose.Types.ObjectId(blockUserId)
    const user = await User.findById(userId)
    const blockList = user.blockList.map((id) => id.toString() )
    if (!blockList.includes(blockUserId)) {
        return res.status(400).json({ message: "User not in BlockList" })
    }
    const updatedBlockList = user.blockList.filter(id => !id.equals(objectId))

    user.blockList = updatedBlockList
    user.save()
    return res.status(200).json({ message: "User Unblocked Successfully" })
}
export const sendFriendRequest = async (req, res) => {
    const { id:receiverId } = req.params
    const objectId = new mongoose.Types.ObjectId(receiverId);
    const senderId = req.user._id
    const data1 = await User.findById(senderId)
    const data2 = await User.findById(objectId)
    const senderList = data1.sentFriendRequests.map((id) => id.toString())
    const receivedlist = data1.receivedFriendRequests.map((id)=>id.toString())
    if(senderList.includes(receiverId)|| receivedlist.includes(receiverId)){
        return res.status(400).json({messgae:"Unable to Process request at the moment"})
    }
    const updatedSenderList = [...data1.sentFriendRequests,objectId]
    const updatedreceiverList = [...data2.receivedFriendRequests,senderId]
    data1.sentFriendRequests = updatedSenderList
    data2.receivedFriendRequests = updatedreceiverList
    
    data1.save()
    data2.save()
    return res.status(200).json({mesage:"Sent Request Successfully"})
    
}
export const removeFriendRequest = async (req, res) => {
    const { id:reqId } = req.params
    const objectId = new mongoose.Types.ObjectId(reqId);
    const myId = req.user._id
    const me = await User.findById(myId)
    const request = await User.findById(reqId)

    const mySentRequset = me.sentFriendRequests
    const myReceivedRequset = me.receivedFriendRequests
    const othersSentRequset = request.sentFriendRequests
    const othersReceivedRequset = request.receivedFriendRequests


    if (mySentRequset.map(id => id.toString()).includes(reqId)) {
        const myupdate = mySentRequset.filter(id => !id.equals(objectId))
        me.sentFriendRequests = myupdate
        const otherUpdate = othersReceivedRequset.filter(id => !id.equals(myId))
        request.receivedFriendRequests = otherUpdate

    }
    else if (myReceivedRequset.map(id => id.toString()).includes(reqId)) {
        const myupdate = myReceivedRequset.filter(id => !id.equals(objectId))
        me.receivedFriendRequests = myupdate
        const otherUpdate = othersSentRequset.filter(id => !id.equals(myId))
        request.sentFriendRequests = otherUpdate
    }
    else {
        return res.status(400).json({ message: "Unable to process the request at this moment" })
    }
    me.save()
    request.save()

    return res.status(200).json({ message: 'Request Removed' })
}
export const getFriendsList = async (req,res)=>{
    const userId = req.user._id
    const userProfile =await User.findById(userId)
    const friendList = userProfile.friendsList
    if(friendList.length < 1){
        return res.status(400).json({message: "No Friends Found"})
    }
    return res.status(200).json(friendList)
    
}
export const getBlockedUsers = async(req,res) =>{
    const userId = req.user._id
    const user =  await User.findById(userId)
    const blockList = user.blockList
    if(user.blockList.length < 1) {
        return res.status(400).json({message: "No blocked User"})
    }
    return res.status(200).json(blockList)
}
export const getRequests = async (req,res) =>{
    const userId = req.user._id
    const data= await User.findById(userId)
    if(!data){
        return res.status(400).json({message:"Unable to Proceed at the moment"})
    }
    const requsets= data.receivedFriendRequests
    return res.status(200).json(requsets)

}
export const getSentRequests = async(req,res)=>{
    const userId = req.user._id
    const data = await User.findById(userId)
    if(!data){
        return res.status(400).json({message:"Unable to Proceed at the moment"})
    }
    const response = data.sentFriendRequests
    return res.status(200).json(response)
}
export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("Error checking Authenticity", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}