import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import { User, Settings, LogOut,UserRoundX } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { authUser, logout } = useAuthStore()
  const { setSelectedUser } = useChatStore()
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
const nav =useNavigate()
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      {authUser && (<div>
        <Link to={"/profile"} className=" mt-10 flex flex-row shadow-lg items-center border border-base-300 justify-between p-6 mb-8 bg-base-200 rounded-lg">
          <p>Profile Settings</p>
          <span className=" text-sm"><Settings className="size-5" /> </span>
        </Link>
        <Link to={"/blocklist"} className=" mt-8 flex flex-row shadow-lg items-center border border-base-300 justify-between p-6 mb-8 bg-base-200 rounded-lg">
          <p>Blocked Users</p>
          <span className=" text-sm"><UserRoundX className="size-5" /> </span>
        </Link>
      </div>)}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">

        </div>

        <div className="flex flex-row shadow-lg border border-base-300 justify-between p-6 bg-base-200 rounded-lg">
          <p>Dark Mode:</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-gray-700 transition-colors relative">
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md duration-300 transition-all ${theme === 'dark' ? "translate-x-7" : "bg-gray-700"}`}
              />
            </div>
          </label>
        </div>


        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {authUser && (<div className="pb-8 pt-8">

        <div className="flex flex-row shadow-lg items-center border border-base-300 justify-between p-6 bg-base-200 rounded-lg cursor-pointer" onClick={() => { setSelectedUser(null); logout(); nav("/")  }}>
          <p>Logout</p>
          <LogOut className="size-5" />
        </div>
      </div>)}

    </div>
  );
};
export default SettingsPage;