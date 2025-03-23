import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Search, MessageSquareText, CircleCheckBig, UserPlus, UserX, CirclePlus, CircleMinus, Loader2 } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import UserSkeleton from "../components/skeletons/UserSkeleton.jsx"
import { useAuthStore } from '../store/useAuthStore'
function FindFriends() {
  const { users, getUsers, friends, isUsersLoading, sendRequest, isLoading, rejectRequests, getSentRequests, sentFriendRequests, blockUser, acceptRequests, setSelectedUser } = useChatStore()
  const { authUser, checkAuth } = useAuthStore()
  const [searchUser, setSearchUser] = useState('')
  const [featuredUsers, setFeaturedUsers] = useState([])
  const [currentUser, setUser] = useState()
  const[userfunc,setUserFunction] = useState()
  const nav = useNavigate()

  useEffect(() => {
    getUsers();
    checkAuth();
  }, [getUsers, checkAuth])

  useEffect(() => { setUser(authUser) }, [authUser])

  const tsrue = users.filter(user =>
    !user.blockList.includes(authUser._id)
  );
  const final = tsrue.filter(user =>
    !authUser.blockList.includes(user._id)
  );

  async function handleRemoveRequest(user) {
    setUserFunction(user._id)
    const res = await rejectRequests(user._id)
    if (res.status === 200) {
      if (currentUser.sentFriendRequests.includes(user._id)) {
        setUser((prev) => {
          const update = prev.sentFriendRequests.filter((id) => id !== user._id)
          return { ...prev, sentFriendRequests: update }
        })
      }
      else {
        setUser((prev) => {
          const update = prev.receivedFriendRequests.filter((id) => id !== user._id)
          return { ...prev, receivedFriendRequests: update }
        })
      }
    }
  }

  async function handleBlockUser(user) {
    const res = await blockUser(user._id)
    if (res.status === 200) {
      setFeaturedUsers((prev)=> {
        return prev.filter((last) => last._id !== user._id)
      })
    }
  }

  async function handleAddtoFriendlist(user) {
    setUserFunction(user._id)
    const res = await acceptRequests(user._id)
    if (res.status === 200) {
      setUser((prev) => {
        const update = [...prev.friendsList, user._id]
        const update2= prev.receivedFriendRequests.filter((id) => id!== (user.id))
        return { ...prev, friendsList: update, receivedFriendRequests:update2 }
      })
    }
  }
  async function handleSendRequest(user) {
    setUserFunction(user._id)
    const res = await sendRequest(user._id)
    if (res.status === 200) {
      setUser((prev) => {
        const update = [...prev.sentFriendRequests, user._id]
        return { ...prev, sentFriendRequests: update }
      })
    }

  }



  useEffect(() => {
    setFeaturedUsers(searchUser.trim() === "" ? final : final.filter((user) => user.fullName.toLowerCase().includes(searchUser)))
  }, [users, searchUser])

  if (isUsersLoading) {
    return (
      <div className='w-full h-[calc(100vh-2rem)] flex flex-col justify-center items-center'>
        <div className='flex flex-1 flex-col overflow-auto items-center mt-20 w-[80%] h-full bg-base-200 rounded-lg'>
          <div className='flex flex-col overflow-y-auto p-4 space-y-1 w-[90%] mb-6'>
            <form className="flex items-center pt-6 gap-2">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  className="w-full input input-bordered rounded-lg input-md"
                  placeholder="Search User"
                />

              </div>
              <button
                type="submit"
                className="btn btn-sm btn-circle"
              >
                <Search size={22} />
              </button>
            </form>
            <UserSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center'>
      <div className='w-[80%] mt-20 bg-base-200 h-full rounded-lg flex flex-col items-center overflow-auto'>
        <div className='p-4 w-full flex flex-col justify-center items-center'>
          <div className='flex flex-col justify-center gap-4 h-full w-[90%]'>
            <form className="flex items-center pt-6 gap-2 w-">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  className="w-full input input-bordered rounded-lg input-md"
                  placeholder="Search User"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value.toLowerCase())}
                />
              </div>
              <button
                type="submit"
                className="btn btn-sm btn-circle"
              >
                <Search size={22} />
              </button>
            </form>
            <div className=' mt-4 flex flex-col gap-4'>
            
            {featuredUsers.length === 0 && searchUser.trim() === "" && (
          <div className="text-center text-zinc-500 py-4">No Users !!</div>
        )}
        {featuredUsers.length === 0 && searchUser.trim() !== "" && (
          <div className="text-center text-zinc-500 py-4">No users found by that Name</div>
        )}
              {
                featuredUsers.map((user) => {
                  return (
                    <div
                      key={user._id}
                      className={`
                        w-full p-3 flex items-center justify-between gap-3 mb-2 rounded-xl
                        hover:bg-base-300 transition-colors
                        bg-base-300 ring-1 ring-base-300 border-b-[1px]
                      `}
                    >
                      <div className='flex flex-row gap-2 items-center justify-start'>
                        <div className="">
                          <img
                            src={user.profilePic || "/image.png"}
                            alt={user.name}
                            className="size-10 object-cover rounded-full"
                          />
                        </div>
                        <div className=" text-left min-w-0 cursor-default font-medium truncate">{user.fullName}</div>
                        {currentUser.friendsList.includes(user._id) ? <CircleCheckBig size={14} /> : ""}
                      </div>
                      <div className='flex flex-row gap-4 items-center justify-end'>
                        {
                          currentUser.friendsList.includes(user._id) ?
                            <button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]'
                              onClick={() => { setSelectedUser(user); nav("/") }}
                              title='Send Text'>
                              <MessageSquareText size={22} />
                              <p className='text-xs hidden md:flex'>Chat</p>
                            </button> :
                            <div className='flex flex-row gap-2'>

                              {isLoading && user._id === userfunc ? <div>
                                <span className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]'>
                                  <Loader2 size={22} className='animate-spin'/>
                                </span>
                              </div> :
                              
                              currentUser.sentFriendRequests.includes(user._id) ?
                                <button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]'
                                  onClick={() => {
                                    if(window.confirm("Are you sure you want to cencel the request?"))
                                      {handleRemoveRequest(user)}}}
                                  title='Cancle Request'>
                                  <CircleMinus size={22}  />
                                  <p className='text-xs hidden md:flex'>Cancle Request</p>
                                </button> :
                                currentUser.receivedFriendRequests.includes(user._id) ?
                                  <div className='flex flex-row gap-2'>
                                    <button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]'
                                      onClick={() => {
                                        if(window.confirm("Accept this Request?")){
                                          handleAddtoFriendlist(user)}}}
                                      title='Accepnt Request'>
                                      <CirclePlus size={22} />
                                      <p className='text-xs hidden md:flex'>Accepnt Request</p>
                                    </button>
                                    <button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]'
                                      onClick={() => { if(window.confirm("Are you sure you want to Reject the request?"))
                                        {handleRemoveRequest(user)} }}
                                      title='Reject Request'>
                                      <CircleMinus size={22} />
                                      <p className='text-xs hidden md:flex'>Reject Request</p>
                                    </button>
                                  </div> :
                                  <button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]' title='Add friendt'
                                    onClick={() => {
                                      if(window.confirm(`Sent a friend Request to ${user.fullName}?`))
                                        {handleSendRequest(user)}}}
                                  >
                                    <UserPlus size={22} />
                                    <p className='text-xs hidden md:flex'>Add friend</p>
                                  </button>}
                              {isLoading && user._id === userfunc ? "":<button className='flex flex-row justify-center items-center gap-1 bg-base-100 p-2 shadow-xl rounded-md hover:scale-[1.02] active:scale-[0.98]' title='Block'
                                onClick={() => { 
                                  if(window.confirm(`Block ${user.fullName}?`))
                                    {handleBlockUser(user)} }}
                              >
                                <UserX size={22} />
                                <p className='text-xs hidden md:flex'>Block</p>
                              </button>}</div>
                        }
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindFriends