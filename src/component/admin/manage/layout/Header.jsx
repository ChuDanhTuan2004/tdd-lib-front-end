import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiLogOut, FiUser, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Header = ({ onMenuClick, isSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        removeCookie('token', { path: '/' });
        navigate('/', { replace: true });
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isSidebarOpen ? (
                            <FiX className="w-6 h-6 text-gray-700" />
                        ) : (
                            <FiMenu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                    <h1 className="text-xl font-semibold text-[#1e439b]">
                        Quản lý thư viện số
                    </h1>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1e439b] flex items-center justify-center">
                            <FiUser className="text-white" />
                        </div>
                        {/* <span className="text-sm font-medium text-gray-700">Admin User</span> */}
                        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
                            {/* <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <FiUser className="w-4 h-4" />
                                Tài khoản của tôi
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <FiSettings className="w-4 h-4" />
                                Cài đặt
                            </button> */}
                            {/* <div className="my-1 border-t border-gray-200"></div> */}
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <FiLogOut className="w-4 h-4" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;