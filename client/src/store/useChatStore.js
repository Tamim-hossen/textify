import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    blockedUsers: [],
    sentFriendRequests: [],
    receivedFriendRequests: [],
    sidebarList:[],
    friends: [],
    selectedUser: null,
    allfriends: false,
    isUsersLoading: false,
    isRequestsLoading: false,
    isMessagesLoading: false,
    isLoading:false,
    isSidebarLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getFriends: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/auth/friendsList")
            const res2 = await axiosInstance.get("/messages/users");
            const data = res.data
            const data2 = res2.data
            const frinedsList = data2.filter((user) => data.includes(user._id))
            set({ friends: frinedsList })
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getSidebarFriends: async () => {
        set({ isSidebarLoading: true })
        try {
            const res = await axiosInstance.get("/auth/friendsList")
            const res2 = await axiosInstance.get("/messages/users");
            const data = res.data
            const data2 = res2.data
            const frinedsList = data2.filter((user) => data.includes(user._id))
            set({sidebarList:frinedsList})
            return frinedsList
            
        } catch (error) {
            console.log("hmm")
        } finally {
            set({ isSidebarLoading: false })
        }
    },
    acceptRequests: async (userId) => {
        set({ isLoading: true })
        try {
            const res=await axiosInstance.put(`auth/accept-request/${userId}`)

            if(res.status===200){
                toast.success("Request Accepted")
            }
            return res;
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoading: false })
        }
    },
    rejectRequests: async (userId) => {
        set({ isLoading: true })
        try {
            const res =await axiosInstance.put(`/auth/reject-request/${userId}`)
            if(res.status ===200){
                toast.success("Request Removed")
                
            }
            return res
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoading: false })
        }
    },
    getBlockedUser: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/auth/blockedList")
            const res2 = await axiosInstance.get("/messages/users")
            const data1 = res.data
            const data2 = res2.data
            const blockList = data2.filter((user) => data1.includes(user._id))
            set({ blockedUsers: blockList })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {

            set({ isUsersLoading: false })
        }
    },
    getRequests: async () => {
        set({ isRequestsLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            const res2 = await axiosInstance.get("/auth/friendRequests")
            const response = res2.data
            const reqdata = res.data.filter((user) => response.includes(user._id))
            set({ receivedFriendRequests: reqdata })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isRequestsLoading: false })
        }
    },
    getSentRequests : async ()=>{
        set({isUsersLoading:true})
        try {
            const users = await axiosInstance.get("/messages/users")
            const requests = await axiosInstance.get("/auth/sent_requests")
            const data1 = users.data
            const data2 = requests.data
            const response = data1.filter((user)=> data2.includes(user._id))
            set({sentFriendRequests:response})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUsersLoading:false})
        }
    },
    sendRequest: async (userId) => {
        set({isLoading:true})
        try {
            const res = await axiosInstance.put(`/auth/send-friendRequest/${userId}`)
            if(res.status===200){
                toast.success("Friend Request sent")
            }
            return res
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoading:false})
        }
    },
    removeFriends: async (userId) => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.put(`/auth/remove-from-friendList/${userId}`)
            if (res.status === 200) {
                toast.success("Removed From FriendList")
            }
            return res;

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {

            if (newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] })
        })
    },
    unsubscribeTFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },
    blockUser: async (userId) => {
        set({ isLoading: true })
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.put(`auth//add-to-blockList/${userId}`)
            if (res.status === 200) {
                toast.success("User Blocked")
            }
            return res;

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
            set({ isLoading: false })
        }
    },
    unblockUser: async (user) => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.put(`/auth//remove-from-blockList/${user._id}`)
            if (res.status === 200) {
                toast.success("User Unblocked")
            }
            return res
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    setAllFriends: (response) => { set({ allfriends: response }) },
    setBlockedUsers: (response) => { set({ blockedUsers: response }) },
    setReceivedRequest: (response) => { set({ receivedFriendRequests: response }) },
    setSentRequests: (response) => {set({sentFriendRequests: response})}
}))