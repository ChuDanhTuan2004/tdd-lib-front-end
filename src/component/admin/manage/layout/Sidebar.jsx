import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoThanhDo from '../../../../asset/image/logo-thanhdo.png';
import { FiChevronDown, FiChevronRight, FiDatabase, FiBook, FiBarChart2, FiCalendar, FiX } from 'react-icons/fi';

const Sidebar = ({ categories, isOpen, onClose }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const categoryId = location.pathname.split('/')[3];
        if (categoryId) {
            setExpandedCategory(Number(categoryId));
        }
    }, [location.pathname]);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const isActiveLink = (path) => location.pathname === path;
    const isActiveCategory = (categoryId) => 
        location.pathname.includes(`/category/${categoryId}`);

    return (
        <>
            {/* Overlay cho mobile */}
            <div 
                className={`fixed inset-0 bg-black/50 transition-opacity lg:hidden
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-40
                    w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0`}
            >
                {/* Logo section */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-[#1e439b] to-[#1e439b]/90">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={LogoThanhDo} alt="Logo Thanh Do" className="h-8" />
                        <span className="font-semibold text-white truncate">Thư viện số Thành Đô</span>
                    </Link>
                    
                    {/* Nút đóng cho mobile */}
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <Link
                        to="/admin/statistics"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActiveLink('/admin/statistics')
                                ? 'bg-[#1e439b] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <FiBarChart2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Thống kê</span>
                    </Link>

                    <Link
                        to="/admin/news-events"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActiveLink('/admin/news-events')
                                ? 'bg-[#1e439b] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <FiCalendar className="w-5 h-5" />
                        <span className="text-sm font-medium">Tin tức & Sự kiện</span>
                    </Link>

                    {/* Categories */}
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <div key={category.id} className="space-y-1">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                                        isActiveCategory(category.id)
                                            ? 'bg-[#1e439b]/10 text-[#1e439b]'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FiDatabase className="w-5 h-5" />
                                        <span className="text-sm font-medium">{category.name}</span>
                                    </div>
                                    {expandedCategory === category.id ? (
                                        <FiChevronDown className="w-4 h-4" />
                                    ) : (
                                        <FiChevronRight className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Subcategories */}
                                {expandedCategory === category.id && (
                                    <div className="ml-4 space-y-1">
                                        {category.subcategories.map((subcategory) => (
                                            <Link
                                                key={subcategory.id}
                                                to={`/admin/category/${category.id}/subcategory/${subcategory.id}`}
                                                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                                                    isActiveLink(`/admin/category/${category.id}/subcategory/${subcategory.id}`)
                                                        ? 'bg-[#faa219] text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {subcategory.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;