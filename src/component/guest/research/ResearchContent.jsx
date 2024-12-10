import React, { useEffect, useState } from 'react';
import { FiClock, FiDatabase, FiEye, FiGrid, FiList, FiPlay, FiSearch, FiUser } from 'react-icons/fi';
import { searchBooks } from '../../../service/GuestService';
import BookThumbnail from './BookThumbnail';

const getCategoryId = (activeTab) => {
    switch (activeTab) {
        case 'books': return 1;
        case 'research': return 2;
        case 'thesis': return 3;
        case 'multimedia': return 4;
        default: return 1;
    }
};

export default function ResearchContent({ activeTab, activeSubCategory }) {
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [filterGenre, setFilterGenre] = useState('all');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [searchParams, setSearchParams] = useState({
        title: '',
        authors: '',
        publisher: '',
        publicationYear: '',
        isbn: '',
        subcategoryName: ''
    });
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalElements: 0,
        totalPages: 0
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 0 }));
        await fetchBooks();
    };

    const handleSearchInputChange = (e) => {
        setSearchParams(prev => ({
            ...prev,
            title: e.target.value
        }));
    };

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const categoryId = getCategoryId(activeTab);

            const response = await searchBooks({
                title: searchParams.title,
                categoryId: categoryId,
                subcategoryId: activeSubCategory,
                page: pagination.page,
                size: pagination.size,
                sortBy: sortBy === 'newest' ? 'publicationYear' :
                    sortBy === 'rating' ? 'rating' : 'id',
                sortDirection: sortBy === 'oldest' ? 'ASC' : 'DESC'
            });

            setBooks(response.content);
            setPagination({
                page: response.number,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages
            });
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [activeTab, activeSubCategory, sortBy, pagination.page, pagination.size]);

    const renderBooksGrid = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loading ? (
                <div>Đang tải...</div>
            ) : books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className="w-full">
                        <BookThumbnail
                            url={book.thumbnail}
                            title={book.title}
                            className="w-full"
                        />
                        <div className="p-3">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-xs text-gray-600">by {book.author}</p>
                            <div className="mt-1 text-xs text-gray-500">
                                <p>Năm: {book.publicationYear}</p>
                                <p>NXB: {book.publisher}</p>
                                {book.rating && <p>Đánh giá: {book.rating}/5</p>}
                            </div>
                            <button
                                onClick={() => window.open(book.filePath, '_blank')}
                                className="mt-2 px-4 py-1.5 w-full bg-gray-900 text-white text-sm rounded-lg 
                                hover:bg-gray-800 active:bg-gray-950
                                shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!book.filePath}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div>Không tìm thấy kết quả</div>
            )}
        </div>
    );

    const renderBooksList = () => (
        <div className="space-y-4">
            {loading ? (
                <div>Đang tải...</div>
            ) : books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className="flex gap-6 bg-white p-4 rounded-lg shadow-sm">
                        <div className="w-32 h-48 flex-shrink-0 bg-gray-100">
                            <BookThumbnail
                                url={book.thumbnail}
                                title={book.title}
                                className="w-full h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-xl mb-2">{book.title}</h3>
                            <p className="text-gray-600">by {book.author}</p>
                            <div className="mt-3 text-sm text-gray-500">
                                <p>Năm: {book.publicationYear}</p>
                                <p>NXB: {book.publisher}</p>
                                {book.rating && <p>Đánh giá: {book.rating}/5</p>}
                            </div>
                            <button
                                onClick={() => window.open(book.filePath, '_blank')}
                                className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 active:bg-gray-950
              shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!book.filePath}
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div>Không tìm thấy kết quả</div>
            )}
        </div>
    );

    // Kiểm tra xem có phải là video bài giảng không
    const isVideoContent = activeTab === 'multimedia' && activeSubCategory === 10;

    const renderVideoGrid = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(video => (
                <div key={video.id} 
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 
                        hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <img
                            src={video.thumbnail || '/video-placeholder.jpg'}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 
                                group-hover:scale-105"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#1e439b]/90 flex items-center justify-center
                                transform transition-all duration-300 
                                group-hover:scale-110 group-hover:bg-[#1e439b]">
                                <FiPlay className="w-6 h-6 text-white ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 
                            group-hover:text-[#1e439b] transition-colors">
                            {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <FiUser className="h-4 w-4" />
                                <span>{video.author || ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FiClock className="h-4 w-4" />
                                <span>{video.publicationYear}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => window.open(video.filePath, '_blank')}
                            className="mt-4 w-full px-4 py-2.5 bg-[#1e439b] text-white rounded-lg
                                hover:bg-[#1e439b]/90 active:bg-[#1e439b]/95
                                transition-all duration-200 text-sm font-medium
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20"
                            disabled={!video.filePath}
                        >
                            Xem video
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMultimediaGrid = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {loading ? (
                <div>Đang tải...</div>
            ) : books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                            {book.thumbnail ? (
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <FiPlay className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-xs text-gray-600">{book.author}</p>
                            <div className="flex items-center text-xs text-gray-500 gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <FiEye className="h-3 w-3" />
                                    <span>{book.views || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiClock className="h-3 w-3" />
                                    <span>{book.publicationYear}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>Không tìm thấy kết quả</div>
            )}
        </div>
    );

    const renderMultimediaList = () => (
        <div className="space-y-4">
            {loading ? (
                <div>Đang tải...</div>
            ) : books.length > 0 ? (
                books.map(book => (
                    <div key={book.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                        <div className="relative w-[240px] aspect-video flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            {book.thumbnail ? (
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <FiPlay className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                            <div className="flex items-center text-sm text-gray-500 gap-4">
                                <div className="flex items-center gap-1">
                                    <FiEye className="h-4 w-4" />
                                    <span>{book.views || 0} lượt xem</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiClock className="h-4 w-4" />
                                    <span>{book.publicationYear}</span>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {book.description || 'Không có mô tả'}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div>Không tìm thấy kết quả</div>
            )}
        </div>
    );

    const renderPagination = () => {
        if (!books.length || loading) return null;

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 
                        disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Trước
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => {
                    // Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
                    if (
                        i === 0 || // Trang đầu
                        i === pagination.totalPages - 1 || // Trang cuối
                        (i >= pagination.page - 1 && i <= pagination.page + 1) // Các trang xung quanh
                    ) {
                        return (
                            <button
                                key={i}
                                onClick={() => setPagination(prev => ({ ...prev, page: i }))}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                                    ${pagination.page === i 
                                        ? 'bg-[#1e439b] text-white' 
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        );
                    }
                    // Hiển thị dấu ... nếu có khoảng cách
                    if (i === pagination.page - 2 || i === pagination.page + 2) {
                        return <span key={i} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                })}

                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900
                        disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Sau
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <main className="flex-1 overflow-auto bg-gray-50/50">
            <div className="max-w-[1920px] mx-auto p-4 md:p-6 space-y-6">
                <div className="max-w-3xl mx-auto mt-14 sm:mt-0">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchParams.title}
                            onChange={handleSearchInputChange}
                            placeholder={`Tìm kiếm ${isVideoContent ? 'video bài giảng' : 'tài liệu'}...`}
                            className="w-full h-12 pl-5 pr-32 rounded-full
                                bg-white border-none
                                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                                placeholder:text-gray-400
                                focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20
                                text-base"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 h-9 px-6
                                bg-[#1e439b] text-white rounded-full
                                hover:bg-[#1e439b]/90 
                                transition-colors duration-200 
                                text-sm font-medium
                                flex items-center gap-2"
                        >
                            <FiSearch className="h-4 w-4" />
                            <span>Tìm kiếm</span>
                        </button>
                    </form>
                </div>

                {/* Controls - Đơn giản hóa thanh điều khiển */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-3 shadow-sm">
                    {!isVideoContent && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors
                                    ${viewMode === 'grid' 
                                        ? 'bg-[#1e439b]/10 text-[#1e439b]' 
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FiGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors
                                    ${viewMode === 'list' 
                                        ? 'bg-[#1e439b]/10 text-[#1e439b]' 
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FiList className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-50
                            border border-gray-200
                            text-sm text-gray-700
                            focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>

                {/* Content */}
                {isVideoContent ? renderVideoGrid() : (
                    <div className={`grid gap-4 md:gap-6 
                        ${viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
                            : 'grid-cols-1'}`}
                    >
                        {books.map(book => (
                            <div key={book.id} 
                                className={`group bg-white rounded-xl border border-gray-100 overflow-hidden
                                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
                                    ${viewMode === 'list' ? 'flex gap-4' : 'flex flex-col'}`}
                            >
                                <BookThumbnail 
                                    url={book.thumbnail}
                                    title={book.title}
                                    className={viewMode === 'list' ? 'w-48' : 'w-full'}
                                />
                                
                                <div className="flex-1 p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 
                                        group-hover:text-[#1e439b] transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <FiClock className="h-4 w-4" />
                                            <span>{book.publicationYear}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.open(book.filePath, '_blank')}
                                        className={`mt-4 px-4 py-2 bg-[#1e439b] text-white rounded-lg
                                            hover:bg-[#1e439b]/90 active:bg-[#1e439b]/95
                                            transition-all duration-200 text-sm font-medium
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20
                                            ${viewMode === 'list' ? 'w-auto' : 'w-full'}`}
                                        disabled={!book.filePath}
                                    >
                                        Đọc ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && books.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <FiDatabase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                        <p className="text-gray-500 mt-1">Không tìm thấy tài liệu nào phù hợp.</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e439b]"></div>
                    </div>
                )}

                {/* Pagination */}
                {renderPagination()}
            </div>
        </main>
    );
}