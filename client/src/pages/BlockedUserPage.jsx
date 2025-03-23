import React, { useState } from 'react'
import { Search, MessageSquareText, UserRoundMinus, UserRoundX } from 'lucide-react'
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import BlockSkeleton from '../components/skeletons/BlockSkeleton'
function FriendsPage() {
  const { blockedUsers,setBlockedUsers, unblockUser, getBlockedUser, isUsersLoading } = useChatStore()
  const [searchUsers, setSeaechUser] = useState("")
  const[filteredUsers,setFilteredUsers] = useState([])

  useEffect(() => {
    getBlockedUser()
  }, [getBlockedUser])

  useEffect(()=>{setFilteredUsers(searchUsers.trim() === "" ? blockedUsers:blockedUsers.filter((user) => user.fullName.toLowerCase().includes(searchUsers)))},[searchUsers,blockedUsers])
  
   

  const handleUnblockUser = async (user) => {
    const res = await unblockUser(user)
     if (res.status === 200) {
      const newList = blockedUsers.filter((current) => current._id !== user._id)
      setBlockedUsers(newList)
    }
  }

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
                placeholder="Search Block List"
                value={searchUsers}
                onChange={(e) => setSeaechUser(e.target.value.toLowerCase())}
              />

            </div>
            <button
              type="submit"
              className="btn btn-sm btn-circle"
            >
              <Search size={22} />
            </button>
          </form>
          <BlockSkeleton />
        </div>
      </div>
      </div>
    )
  }



  return (
    <div className='w-full h-[calc(100vh-2rem)] flex flex-col justify-center items-center'>
    <div className='flex flex-1 flex-col overflow-auto items-center mt-20 w-[80%] h-full bg-base-200 rounded-lg'>
      <div className='flex flex-col overflow-y-auto p-4 space-y-1 w-[90%] mb-6'>
        <form className="flex items-center gap-2 pt-6">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-md"
              placeholder="Search Block List"
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
      <div className='overflow-y-auto w-[90%]'>
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No Users Here!!</div>
        )}
        {filteredUsers.map((user) => (
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
            </div>
            <div className='flex flex-row gap-4 items-center justify-end'>
              
              <button title='Unblock User' className='flex flex-row gap-2 justify-center items-center bg-base-100 p-2 shadow-md rounded-md hover:scale-[1.02] active:scale-[0.98]' onClick={() => {
                if ((window.confirm(`Are You Sure You Want to Unblock ${user.fullName}?`))) {
                  (handleUnblockUser(user))
                }
              }}><UserRoundX /><p className='text-xs hidden md:flex'>Unblock</p></button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default FriendsPage

export const update = () => {

}