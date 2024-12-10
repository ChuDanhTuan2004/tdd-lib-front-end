import React, { useState, useEffect } from 'react';
import { getNewsEvents, deleteNewsEvent } from '../../../../service/AdminService';
import { format } from 'date-fns';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiGrid, FiList, FiImage, FiDatabase } from 'react-icons/fi';
import NewsEventForm from './NewsEventForm';
import Swal from 'sweetalert2';

const NewsEventsManagement = () => {
    const [newsEvents, setNewsEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState({
        search: '',
        startDate: '',
        endDate: ''
    });
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'list' hoặc 'grid'
    const [searchTerm, setSearchTerm] = useState('');
    const [allNewsEvents, setAllNewsEvents] = useState([]);

    const fetchNewsEvents = async () => {
        try {
            setLoading(true);
            const response = await getNewsEvents({
                page: currentPage,
                size: 10,
                sort: 'startTime,desc',
                ...searchParams
            });
            setAllNewsEvents(response.content);
            setNewsEvents(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải tin tức/sự kiện:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsEvents();
    }, [currentPage, searchParams]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: 'Bạn có chắc chắn muốn xóa tin tức/sự kiện này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e439b',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteNewsEvent(id);
                await Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Tin tức/sự kiện đã được xóa thành công.',
                    icon: 'success',
                    confirmButtonColor: '#1e439b',
                });
                fetchNewsEvents();
            } catch (error) {
                console.error('Lỗi khi xóa tin tức/sự kiện:', error);
                await Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi xóa tin tức/sự kiện.',
                    icon: 'error',
                    confirmButtonColor: '#1e439b',
                });
            }
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setShowForm(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        if (searchParams.startDate && searchParams.endDate) {
            const startDate = new Date(searchParams.startDate);
            const endDate = new Date(searchParams.endDate);
            
            if (endDate < startDate) {
                setSearchError('Ngày kết thúc phải sau ngày bắt đầu');
                return;
            }
        }

        const filteredEvents = filterEvents();
        setNewsEvents(filteredEvents);
        setIsSearching(
            searchTerm.trim() !== '' || 
            searchParams.startDate !== '' || 
            searchParams.endDate !== ''
        );
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        setSearchParams({
            search: '',
            startDate: '',
            endDate: ''
        });
        setNewsEvents(allNewsEvents);
        setIsSearching(false);
        setSearchError('');
    };

    // Hàm lọc sự kiện dựa trên tất cả điều kiện tìm kiếm
    const filterEvents = () => {
        let filteredEvents = [...allNewsEvents];

        // Lọc theo tiêu đề
        if (searchTerm.trim() !== '') {
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo khoảng thời gian
        if (searchParams.startDate && searchParams.endDate) {
            const startDate = new Date(searchParams.startDate);
            const endDate = new Date(searchParams.endDate);
            endDate.setHours(23, 59, 59); // Đặt thời gian kết thúc là cuối ngày

            filteredEvents = filteredEvents.filter(event => {
                const eventStartTime = new Date(event.startTime);
                const eventEndTime = new Date(event.endTime);
                return eventStartTime >= startDate && eventEndTime <= endDate;
            });
        } else if (searchParams.startDate) {
            const startDate = new Date(searchParams.startDate);
            filteredEvents = filteredEvents.filter(event => {
                const eventStartTime = new Date(event.startTime);
                return eventStartTime >= startDate;
            });
        } else if (searchParams.endDate) {
            const endDate = new Date(searchParams.endDate);
            endDate.setHours(23, 59, 59);
            filteredEvents = filteredEvents.filter(event => {
                const eventEndTime = new Date(event.endTime);
                return eventEndTime <= endDate;
            });
        }

        return filteredEvents;
    };

    // Cập nhật useEffect để xử lý cả tìm kiếm theo tiêu đề và thời gian
    useEffect(() => {
        const filteredEvents = filterEvents();
        setNewsEvents(filteredEvents);
        setIsSearching(
            searchTerm.trim() !== '' || 
            searchParams.startDate !== '' || 
            searchParams.endDate !== ''
        );
    }, [searchTerm, searchParams.startDate, searchParams.endDate, allNewsEvents]);

    // Thêm hàm tính toán phân trang
    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 3; // Số trang hiển thị tối đa
        
        // Nút Previous
        items.push(
            <button
                key="prev"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className={`flex items-center px-3 py-1 rounded border ${
                    currentPage === 0
                        ? 'text-gray-400 border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                ‹ Trước
            </button>
        );

        // Các nút số trang
        for (let i = 0; i < totalPages; i++) {
            if (
                i === 0 || // Luôn hiển thị trang đầu
                i === totalPages - 1 || // Luôn hiển thị trang cuối
                (i >= currentPage - 1 && i <= currentPage + 1) // Hiển thị trang hiện tại và 2 trang xung quanh
            ) {
                items.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 rounded border ${
                            currentPage === i
                                ? 'bg-[#1e439b] text-white border-[#1e439b]'
                                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {i + 1}
                    </button>
                );
            } else if (
                i === currentPage - 2 ||
                i === currentPage + 2
            ) {
                // Thêm dấu ... nếu có khoảng cách
                items.push(
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Nút Next
        items.push(
            <button
                key="next"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center px-3 py-1 rounded border ${
                    currentPage === totalPages - 1
                        ? 'text-gray-400 border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                Sau ›
            </button>
        );

        return items;
    };

    // Validate dates whenever search params change
    useEffect(() => {
        if (searchParams.startDate && searchParams.endDate) {
            const startDate = new Date(searchParams.startDate);
            const endDate = new Date(searchParams.endDate);
            
            if (endDate < startDate) {
                setSearchError('Ngày kết thúc phải sau ngày bắt đầu');
            } else {
                setSearchError('');
            }
        }
    }, [searchParams.startDate, searchParams.endDate]);

    // Thêm component để hiển thị placeholder image khi không có ảnh
    const PlaceholderImage = () => (
        <div className="bg-gray-200 w-full h-48 rounded-t-lg flex items-center justify-center">
            <FiImage className="w-12 h-12 text-gray-400" />
        </div>
    );

    return (
        <div className="container mx-auto p-4 lg:p-6">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                {/* View Mode Buttons */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                            ${viewMode === 'grid' 
                                ? 'bg-[#1e439b] text-white shadow-sm' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        <FiGrid className="h-4 w-4 mr-2" />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                            ${viewMode === 'list' 
                                ? 'bg-[#1e439b] text-white shadow-sm' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        <FiList className="h-4 w-4 mr-2" />
                        List
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-1 items-center justify-end gap-4 w-full lg:w-auto">
                    <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 lg:flex-initial">
                        <div className="relative flex-1 lg:w-64">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e439b] focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#1e439b] text-white rounded-md hover:bg-[#1e439b]/90 transition-colors"
                            >
                                Tìm kiếm
                            </button>
                            {isSearching && (
                                <button
                                    type="button"
                                    onClick={handleResetSearch}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <FiX className="w-4 h-4" />
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedEvent(null);
                                setShowForm(true);
                            }}
                            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[#1e439b] text-white hover:bg-[#1e439b]/90 transition-colors shadow-sm"
                        >
                            <FiPlus className="h-4 w-4 mr-2" />
                            Thêm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Date Filters */}
            <div className="mt-4 bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Từ ngày
                        </label>
                        <input
                            type="date"
                            value={searchParams.startDate}
                            onChange={(e) => {
                                setSearchParams(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }));
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b] ${
                                searchError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đến ngày
                        </label>
                        <input
                            type="date"
                            value={searchParams.endDate}
                            onChange={(e) => {
                                setSearchParams(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }));
                            }}
                            min={searchParams.startDate}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b] ${
                                searchError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    </div>
                </div>
                {searchError && (
                    <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded">
                        {searchError}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e439b]"></div>
                </div>
            )}

            {/* Content */}
            {!loading && (
                <>
                    {newsEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <FiDatabase className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                            <p className="text-gray-500 mt-1">
                                {isSearching ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có tin tức/sự kiện nào'}
                            </p>
                        </div>
                    ) : (
                        // Grid/List View Content (giữ nguyên code cũ)
                        <>
                            {viewMode === 'list' ? (
                                // Hiển thị dạng bảng (giữ nguyên code cũ)
                                <div className="bg-white rounded-lg shadow overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tiêu đề
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thời gian bắt đầu
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thời gian kết thúc
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {newsEvents.map((event) => (
                                                <tr key={event.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {format(new Date(event.endTime), 'dd/MM/yyyy HH:mm')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEdit(event)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            <FiEdit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Hiển thị dạng lưới
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {newsEvents.map((event) => (
                                        <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                                            {event.imageUrl ? (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <PlaceholderImage />
                                            )}
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {event.content}
                                                </p>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <div>
                                                        <span className="font-medium">Bắt đầu:</span>{' '}
                                                        {format(new Date(event.startTime), 'dd/MM/yyyy HH:mm')}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Kết thúc:</span>{' '}
                                                        {format(new Date(event.endTime), 'dd/MM/yyyy HH:mm')}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50"
                                                    >
                                                        <FiEdit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    {newsEvents.length > 0 && (
                        <div className="mt-6 flex justify-center items-center gap-2">
                            {renderPaginationItems()}
                        </div>
                    )}
                </>
            )}

            {/* Modal Form */}
            {showForm && (
                <NewsEventForm
                    event={selectedEvent}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedEvent(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setSelectedEvent(null);
                        fetchNewsEvents();
                    }}
                />
            )}
        </div>
    );
};

export default NewsEventsManagement;