import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:5001" : "/"
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data })
            get().connectSocket()
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/auth/signup", data)
            if (response) return true
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data) => {
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in")

            get().connectSocket()
        } catch (error) {
            toast.error(error.message)
        } finally{
            set({isLoggingIn:false})
        }
    },
    logout: async () => {
        try {
            const res = await axiosInstance.post('/auth/logout')
            set({ authUser: null })
            toast.success("Logged Out Successfully")
            get().disconnectSocket()
        } catch (error) {
            console.log(error.message)
            toast.error("Something went Worng!!")
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message)
        } finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
    
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
      setAuthUser: (response) => set({authUser:response}),
}))