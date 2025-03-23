import React, { useState } from 'react'
import { Search, MessageSquareText, UserRoundMinus, UserRoundX } from 'lucide-react'
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UserSkeleton from './skeletons/UserSkeleton'
function FriendsPage() {
  const { friends, setAllFriends, getFriends, blockUser, setSelectedUser, removeFriends, isUsersLoading } = useChatStore()
  const [searchUsers, setSeaechUser] = useState("")
  const [filteredUsers,setFilteredUsers] = useState([])

  useEffect(() => {
    getFriends()
  }, [])

useEffect(()=>{
  setFilteredUsers(searchUsers.trim() === "" ? friends : friends.filter((user) => user.fullName.toLowerCase().includes(searchUsers)))
},[friends,searchUsers])
  
  
  
  

  const handleRemoveFriend = async (user) => {
    const res = await removeFriends(user._id)
    if (res.status === 200) {
      const newfriends = friends.filter((friend) => friend._id !== user._id)
      setFilteredUsers(newfriends)
      setAllFriends(newfriends)
    }
  }
  const handleBlockUser = async (user) => {
    const res = await blockUser(user._id)
    if (res.status === 200) {
      const newfriends = friends.filter((friend) => friend._id !== user._id)
      setFilteredUsers(newfriends)
      setAllFriends(newfriends)
    }
  }

  if (isUsersLoading) {
    return (
      <div className='flex flex-1 flex-col overflow-auto items-center'>
        <div className='flex flex-col overflow-y-auto p-4 space-y-1 w-full'>
          <form className="flex items-center gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                className="w-full input input-bordered rounded-lg input-md"
                placeholder="Search your Friends List"
                value={searchUsers}
                onChange={(e) => setSeaechUser(e.target.value.toLowerCase())}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
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
    )
  }

  
  

  return (
    <div className='flex flex-1 flex-col overflow-auto items-center'>
      <div className='flex flex-col overflow-y-auto p-4 space-y-1 w-full'>
        <form className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-md"
              placeholder="Search your Friends List"
              value={searchUsers}
              onChange={(e) => setSeaechUser(e.target.value.toLowerCase())}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
            />

          </div>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
          >
            <Search size={22} />
          </button>
        </form>
      </div>
      <div className='overflow-y-auto w-[95%]'>
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No friends to show</div>
        )}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className={`
              w-full p-3 flex items-center justify-between gap-3 mb-2 rounded-xl
              hover:bg-base-300 transition-colors
              bg-base-300 ring-1 ring-base-300
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
            </div>
            <div className='flex flex-row gap-4 items-center justify-end'>
              <button title='Send Message' onClick={() => { setAllFriends(false); setSelectedUser(user) }}><MessageSquareText /></button>
              <button title='Unfriend' onClick={() => {
                if ((window.confirm(`Are You Sure You Want to Unfriend ${user.fullName}?`))) {
                  (handleRemoveFriend(user))
                }
              }}><UserRoundMinus /></button>
              <button title='Block User' onClick={() => {
                if ((window.confirm(`Are You Sure You Want to Block ${user.fullName}?`))) {
                  (handleBlockUser(user))
                }
              }}><UserRoundX /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsPage