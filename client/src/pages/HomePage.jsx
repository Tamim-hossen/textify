import React from 'react'
import  {useChatStore} from '../store/useChatStore'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import NoChatSelected from '../components/NoChatSelected'
import FriendsPage from '../components/FriendsPage'
function HomePage() {
  const {selectedUser,allfriends} = useChatStore()
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
        <div className='flex h-full shadow-lg border border-base-200 rounded-lg'>
          <Sidebar/>

          { allfriends ? <FriendsPage/>: !selectedUser ? <NoChatSelected/> : <ChatContainer/>}
        </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage