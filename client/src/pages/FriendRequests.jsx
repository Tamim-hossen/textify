import React, { useState } from 'react'
import { Search, MessageSquareText, UserRoundMinus, UserRoundX,UserPlus2 } from 'lucide-react'
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import BlockSkeleton from '../components/skeletons/BlockSkeleton'


function FriendRequests() {
  const { setReceivedRequest,rejectRequests, isUsersLoading,getRequests,receivedFriendRequests,acceptRequests } = useChatStore()

  const [searchUsers, setSeaechUser] = useState("")
  const[filteredUsers,setFilteredUsers] = useState([])

  useEffect(() => {
    getRequests()
  }, [getRequests])

  useEffect(()=>{setFilteredUsers(searchUsers.trim() === "" ? receivedFriendRequests:receivedFriendRequests.filter((user) => user.fullName.toLowerCase().includes(searchUsers)))},[searchUsers,receivedFriendRequests])
  

  const handleAcceptRequests = async (user) => {
    const res = await acceptRequests(user._id)
     if (res.status === 200) {
      const newList = receivedFriendRequests.filter((current) => current._id !== user._id)
      setReceivedRequest(newList)
    }
  }

  const handleRejectRequests = async (user) => {
    const res = await rejectRequests(user._id)
     if (res.status === 200) {
      const newList = receivedFriendRequests.filter((current) => current._id !== user._id)
      setReceivedRequest(newList)
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
                placeholder="Search Request List"
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
              placeholder="Search Request List"
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
            <button title='Accept Request' className='flex flex-row gap-2 justify-center items-center bg-base-100 p-2 shadow-md rounded-md hover:scale-[1.02] active:scale-[0.98]' onClick={() => {
                if ((window.confirm(`Are You Sure You Want to Accept ${user.fullName}?`))) {
                  (handleAcceptRequests(user))
                }
              }}><UserPlus2 /><p className='text-xs hidden md:flex'>Accept Request</p></button>
              
              <button title='Reject Request' className='flex flex-row gap-2 justify-center items-center bg-base-100 p-2 shadow-md rounded-md hover:scale-[1.02] active:scale-[0.98]' onClick={() => {
                if ((window.confirm(`Are You Sure You Want to Reject This Request?`))) {
                  (handleRejectRequests(user))
                }
              }}><UserRoundX /><p className='text-xs hidden md:flex'>Cancel Request</p></button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default FriendRequests

export const update = () => {

}