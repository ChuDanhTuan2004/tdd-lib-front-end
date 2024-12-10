import React, { useState } from 'react';
import { FiMenu, FiX, FiSearch, FiSettings, FiFilter } from 'react-icons/fi';
import ResearchSidebar from './ResearchSidebar';
import ResearchContent from './ResearchContent';

export default function EBookReader() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('books');
    const [activeSubCategory, setActiveSubCategory] = useState(1);
    const [searchParams, setSearchParams] = useState({
        title: '',
        authors: '',
        publisher: '',
        publicationYear: '',
        isbn: '',
        subcategoryName: ''
    });

    const handleSubCategoryChange = (subCategoryId) => {
        setActiveSubCategory(subCategoryId);
        // Xác định tab dựa trên subCategoryId
        if ([1, 2, 3, 4, 5, 6, 7].includes(subCategoryId)) {
            setActiveTab('books');
        } else if ([12, 13].includes(subCategoryId)) {
            setActiveTab('research');
        } else if ([8, 9].includes(subCategoryId)) {
            setActiveTab('thesis');
        } else if ([10, 11].includes(subCategoryId)) {
            setActiveTab('multimedia');
        }
    };

    return (
        <div className="h-screen flex flex-col md:grid md:grid-cols-[280px_1fr]">
            {/* Mobile menu button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-[280px] 
                transform transition-transform duration-200 ease-in-out
                md:relative md:transform-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <ResearchSidebar 
                    activeTab={activeTab}
                    activeSubCategory={activeSubCategory}
                    onTabChange={setActiveTab}
                    onSubCategoryChange={handleSubCategoryChange}
                />
            </div>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex flex-col flex-1">
                <ResearchContent 
                    activeTab={activeTab}
                    activeSubCategory={activeSubCategory}
                />
            </div>
        </div>
    );
}