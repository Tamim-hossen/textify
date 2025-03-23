import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users,MessageSquareText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getSidebarFriends,sidebarList, selectedUser, setSelectedUser, isUserLoading,allfriends, setAllFriends } = useChatStore()
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { onlineUsers } = useAuthStore()
  const [newList,setNewList] = useState ([])
  const [filteredUsers,setFilteredUsers] = useState([])

  const currentOnlineFriends = onlineUsers.filter((user) => sidebarList.some((friend) => user=== friend._id ) )

  useEffect(() => {
    getSidebarFriends()
    setNewList(sidebarList)
  }, [getSidebarFriends])
  
  useEffect( () => {
    const intervalId = setInterval(async()=>{
      const list = await getSidebarFriends()
      setNewList(list)
      
    },1000)

    return () => clearInterval(intervalId)
  },[getSidebarFriends])

  useEffect(()=>{
    setFilteredUsers(showOnlineOnly
    ? newList.filter((user) => onlineUsers.includes(user._id))
    : newList)
  },[newList,showOnlineOnly])

  if (isUserLoading) return <SidebarSkeleton />
  return (
    <aside className="h-full w-16 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex flex-col lg:flex-row gap-4 justify-between md:justify-center lg:gap-12 border-b-2 border-base-200 p-2 w-full'
        >
          <div className='flex flex-col items-center gap-2 cursor-pointer' onClick={() => { setAllFriends(false) }}>
            <MessageSquareText className='size-6' />
            <span className='font-medium hidden lg:block'> Chats</span>
          </div>
          <div className='flex flex-col items-center gap-2 cursor-pointer' onClick={() => { setAllFriends(true); setSelectedUser(null) }}>
            <Users className='size-6' />
            <span className='font-medium hidden lg:block'> Friends</span>
          </div>
        </div>
        <div className="mt-3 flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className='hidden lg:flex lg:flex-col'>
            <span className="text-sm">Show online only</span>
            <span className="text-xs text-zinc-500">({currentOnlineFriends.length} online)</span>
          </div>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox hidden checkbox-xs rounded-lg"
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-gray-700 transition-colors relative">
              <div
                className={`absolute top-1 left-1 w-3 h-3  rounded-full shadow-md duration-300 transition-all ${showOnlineOnly === true ? "translate-x-5 bg-green-600" :  "bg-white"}`}
              />
            </div>

          </label>

        </div>
      </div>
      <div className='overflow-y-auto w-full'>
      {!filteredUsers && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
        {filteredUsers && filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {setSelectedUser(user); setAllFriends(false)}}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${allfriends ? "" : selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/image.png"}
                alt={user.name}
                className="size-10 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0  size-[0.6rem] bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        
      </div>
    </aside>
  )
}

export default Sidebar