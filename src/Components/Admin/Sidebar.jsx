import { LuChevronFirst, LuChevronLast, LuMoreVertical } from "react-icons/lu";
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarContext = createContext();

export default function Sidebar({ children, userInfo }) {
    const [expanded, setExpanded] = useState(true);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getProfilePictureSrc = (profilePicture) => {
        // Check if the profile picture string already includes the data URL prefix
        if (profilePicture.startsWith('data:image')) {
            return profilePicture;
        }
        // Assume the profile picture is a base64 encoded string without the prefix
        return `data:image/png;base64,${profilePicture}`;
    };

    return (
        <aside className={`h-screen ${expanded ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-700`}>
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src='https://files.catbox.moe/vzv3w2.png' className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt='' />
                    <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                        {expanded ? <LuChevronFirst /> : <LuChevronLast />}
                    </button>
                </div>
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>
                <div className="relative border-t flex p-3">
                    {userInfo && (
                        <>
                            <img src={getProfilePictureSrc(userInfo.profilePicture)} alt={userInfo.username} className="w-10 h-10 rounded-md" />
                            <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                                <div className='leading-4'>
                                    <h4 className='font-semibold'>{userInfo.username}</h4>
                                    <span className="text-xs text-gray-300">{userInfo.email}</span>
                                </div>
                                <div className="relative">
                                    <button onClick={() => setShowLogout(!showLogout)}>
                                        <LuMoreVertical size={20} />
                                    </button>
                                    {showLogout && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </aside>
    );
}

export function SideBarItem({ onClick, icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <li onClick={onClick} className={`text-slate-100 relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
            {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}
            {!expanded && <div className='absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0'>{text}</div>}
        </li>
    );
}
