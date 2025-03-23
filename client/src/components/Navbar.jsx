import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Search, MessageCircleMore, Settings, Users,Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { authUser } = useAuthStore();
 const {getRequests,receivedFriendRequests,isUsersLoading,setSelectedUser} = useChatStore()

 
 useEffect(()=>{
  getRequests()
 },[])

  return (
    <header
      className="border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircleMore className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Textify</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
          {authUser && (
              <div className="flex flex-row gap-1">
                <Link
              to={"/FriendRequests"}
              className={`btn btn-sm gap-2 transition-colors`}
              onClick={()=>{setSelectedUser(null)}}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
              {isUsersLoading ? <span> <Loader2 size = {14}className="animate-spin"/></span>:<span>{receivedFriendRequests.length}</span>}

            </Link>
            <Link
              to={"/explore"}
              className={`btn btn-sm gap-2 transition-colors`}
              onClick={()=>{setSelectedUser(null)}}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
              </div>
            )}


            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors `}
              onClick={()=>{setSelectedUser(null)}}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Options</span>
            </Link>

            
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;