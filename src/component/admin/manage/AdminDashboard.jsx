import React, { useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import StatisticsPage from './statistics/StatisticsPage';
import BooksManagement from './books/BooksManagement';
import NewsEventsManagement from './newsEvent/NewsEventsManagement';

// Mock data cho categories
const categories = [
    {
        id: 1,
        name: "Cơ sở dữ liệu sách",
        subcategories: [
            { id: 1, name: "Chăm sóc sức khỏe" },
            { id: 2, name: "Ngoại ngữ" },
            { id: 3, name: "Kinh tế" },
            { id: 4, name: "Du lịch" },
            { id: 5, name: "Luật" },
            { id: 6, name: "Giáo dục" },
            { id: 7, name: "Công nghệ Kỹ thuật" },
            { id: 14, name: "Khác" }
        ]
    },
    {
        id: 2,
        name: "Nghiên cứu khoa học",
        subcategories: [
            { id: 12, name: "Đề tài khoa học" },
            { id: 13, name: "Bài báo khoa học" }
        ]
    },
    {
        id: 3,
        name: "Luận văn",
        subcategories: [
            { id: 8, name: "Luận án tiến sĩ" },
            { id: 9, name: "Luận văn Thạc sĩ" }
        ]
    },
    {
        id: 4,
        name: "Tài liệu đa phương tiện",
        subcategories: [
            { id: 10, name: "Video bài giảng" },
            { id: 11, name: "Slides bài giảng" }
        ]
    }
];

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar 
                categories={categories}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    onMenuClick={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
                        <Routes>
                            <Route path="/" element={<Navigate to="/admin/statistics" replace />} />
                            <Route path="/statistics" element={<StatisticsPage />} />
                            <Route path="/books" element={<BooksManagement categories={categories} />} />
                            <Route 
                                path="/category/:categoryId/subcategory/:subcategoryId" 
                                element={<BooksManagement categories={categories} />} 
                            />
                            <Route path="/news-events" element={<NewsEventsManagement />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;