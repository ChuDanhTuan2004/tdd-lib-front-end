import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiFileText, FiVideo, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import LogoThanhDo from '../../../asset/image/logo-thanhdo.png';

const MENU_ITEMS = [
    {
        id: 'books',
        label: 'Cơ sở dữ liệu sách',
        icon: FiBook,
        subCategories: [
            { id: 1, label: 'Chăm sóc sức khỏe' },
            { id: 2, label: 'Ngoại ngữ' },
            { id: 3, label: 'Kinh tế' },
            { id: 4, label: 'Du lịch' },
            { id: 5, label: 'Luật' },
            { id: 6, label: 'Giáo dục' },
            { id: 7, label: 'Công nghệ Kỹ thuật' },
            { id: 14, label: 'Khác' }
        ]
    },
    {
        id: 'research',
        label: 'Nghiên cứu khoa học',
        icon: FiFileText,
        subCategories: [
            { id: 12, label: 'Đề tài khoa học' },
            { id: 13, label: 'Bài báo khoa học' }
        ]
    },
    {
        id: 'thesis',
        label: 'Luận văn',
        icon: FiFileText,
        subCategories: [
            { id: 8, label: 'Luận án tiến sĩ' },
            { id: 9, label: 'Luận văn Thạc sĩ' }
        ]
    },
    {
        id: 'multimedia',
        label: 'Tài liệu đa phương tiện',
        icon: FiVideo,
        subCategories: [
            { id: 10, label: 'Video bài giảng' },
            { id: 11, label: 'Slides bài giảng' }
        ]
    }
];

const SidebarHeader = () => (
    <Link to="/" className="flex items-center gap-3 px-2 py-2 hover:opacity-90 transition-opacity">
        <img src={LogoThanhDo} alt="Logo Thành Đô" className="h-10 w-10 object-contain" />
        <div className="flex flex-col">
            <span className="text-lg font-semibold text-[#1e439b] truncate">Thư viện số Thành Đô</span>
            <span className="text-xs text-gray-500">Thành Đô University</span>
        </div>
    </Link>
);

const MenuItem = ({ item, isActive, activeSubCategory, onTabChange, onSubCategoryChange }) => {
    const [isExpanded, setIsExpanded] = useState(isActive);

    const handleMainClick = () => {
        setIsExpanded(!isExpanded);
        onTabChange(item.id);
    };

    return (
        <div className="space-y-1">
            <button 
                onClick={handleMainClick}
                className={`
                    group flex items-center justify-between w-full px-4 py-2.5 
                    rounded-lg text-left
                    transition-all duration-200
                    hover:shadow-sm
                    ${isActive 
                        ? 'bg-[#1e439b] text-white font-medium shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <item.icon className={`
                        h-5 w-5 flex-shrink-0 transition-colors
                        ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#1e439b]'}
                    `} />
                    <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className={`
                    transition-transform duration-200
                    ${isExpanded ? 'rotate-180' : ''}
                `}>
                    <FiChevronDown className={`
                        h-5 w-5
                        ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#1e439b]'}
                    `} />
                </div>
            </button>

            {isExpanded && (
                <div className="ml-4 space-y-1 pt-1">
                    {item.subCategories.map(subCategory => (
                        <button
                            key={subCategory.id}
                            onClick={() => onSubCategoryChange(subCategory.id)}
                            className={`
                                group w-full flex items-center px-4 py-2 
                                rounded-lg text-sm
                                transition-all duration-200
                                ${activeSubCategory === subCategory.id
                                    ? 'bg-[#faa219] text-white font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e439b]'
                                }
                            `}
                        >
                            <span className="relative pl-4">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full
                                    ${activeSubCategory === subCategory.id
                                        ? 'bg-white'
                                        : 'bg-gray-300 group-hover:bg-[#1e439b]'
                                    }"
                                />
                                {subCategory.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ResearchSidebar({ activeTab, onTabChange, onSubCategoryChange, activeSubCategory }) {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 mt-12 sm:mt-0">
                <SidebarHeader />
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
                {MENU_ITEMS.map(item => (
                    <MenuItem 
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        activeSubCategory={activeSubCategory}
                        onTabChange={onTabChange}
                        onSubCategoryChange={onSubCategoryChange}
                    />
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                    © 2024 Thành Đô University
                </div>
            </div>
        </div>
    );
}