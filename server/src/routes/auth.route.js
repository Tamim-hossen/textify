import express from "express"
import { login, logout, signup,removeFromBlockList,getFriendsList,removeFromfriendList,getRequests, updateProfile,addToFriendList, checkAuth,getBlockedUsers,getSentRequests, addToBlockList,sendFriendRequest,removeFriendRequest } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile",protectRoute, updateProfile)
router.put("/reject-request/:id",protectRoute, removeFriendRequest)
router.put("/accept-request/:id",protectRoute, addToFriendList)
router.put("/remove-from-friendList/:id",protectRoute, removeFromfriendList)
router.put("/add-to-blockList/:id",protectRoute, addToBlockList)
router.put("/remove-from-blockList/:id",protectRoute, removeFromBlockList)
router.put("/send-friendRequest/:id",protectRoute, sendFriendRequest)
router.put("/remove-friendRequest",protectRoute, removeFriendRequest)

router.get("/friendsList",protectRoute,getFriendsList)
router.get("/blockedList", protectRoute,getBlockedUsers)
router.get("/friendRequests", protectRoute, getRequests)
router.get("/sent_requests", protectRoute,getSentRequests)



router.get("/check",protectRoute,checkAuth)

export default router