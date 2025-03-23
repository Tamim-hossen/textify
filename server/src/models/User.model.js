import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true,
    },
    fullName : {
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type: String,
        default: "",
    },
    sentFriendRequests:{
        type: Array,
        default: [],
    },
    receivedFriendRequests:{
        type: Array,
        default: [],
    },
    friendsList : {
        type: Array,
        default: []
    },
    blockList :{
        type: Array,
        default: [],
    }
}, {timestamps:true})

const User = mongoose.model.User || mongoose.model('User', UserSchema);

export default User;