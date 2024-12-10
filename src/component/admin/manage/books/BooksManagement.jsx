import React, { useEffect, useRef, useState } from 'react';
import { FiDatabase, FiDownload, FiGrid, FiList, FiPlus, FiSearch, FiSliders, FiUpload } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createBook, deleteBook, downloadBookTemplate, importBooksFromExcel, searchBooks, updateBook } from '../../../../service/AdminService';
import { categories } from '../data/mockData';
import BookCard from './BookCard';
import BookModal from './BookModal';
import FiltersPanel from './FiltersPanel';

const Pagination = ({ pagination, setPagination }) => {
    const { page, totalPages } = pagination;

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="mt-6 flex justify-center items-center gap-2">
            <button
                onClick={() => handlePageChange(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded ${
                        page === i
                            ? 'bg-[#1e439b] text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
                Sau
            </button>
        </div>
    );
};

const BooksManagement = ({ categories }) => {
    const { categoryId, subcategoryId } = useParams();
    const [viewMode, setViewMode] = useState('grid');
    const [keyword, setKeyword] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalPages: 0,
        totalElements: 0
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);
    const [sortOrder, setSortOrder] = useState('newest');

    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 1900 + 1 }, 
        (_, i) => currentYear - i
    );

    // Tạo ref để kiểm soát mounted state
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Thêm useEffect để theo dõi sự thay đổi của subcategoryId
    useEffect(() => {
        // Reset về trang đầu khi thay đổi subcategory
        setPagination(prev => ({ ...prev, page: 0 }));
    }, [subcategoryId]);

    // Fetch items khi các params thay đổi
    useEffect(() => {
        fetchItems();
    }, [sortOrder, subcategoryId, keyword, publicationYear, pagination.page, pagination.size]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await searchBooks({
                keyword,
                subcategoryId: subcategoryId || '',
                publicationYear,
                page: pagination.page,
                size: pagination.size,
                sortBy: 'publicationYear',
                sortDirection: sortOrder === 'newest' ? 'DESC' : 'ASC'
            });

            setItems(response.content);
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
                totalElements: response.totalElements
            }));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách tài liệu',
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa "${item.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteBook(item.bookId);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa tài liệu thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchItems();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi khi xóa tài liệu',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 0 })); // Reset về trang đầu
        fetchItems();
    };

    const handleSave = async (editedBook) => {
        try {
            await updateBook(editedBook.bookId, editedBook);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật sách thành công',
                showConfirmButton: false,
                timer: 1500
            });
            fetchItems();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi cập nhật sách',
                showConfirmButton: false,
                timer: 1500
            });
            console.error('Error updating book:', error);
        }
    };

    const filterProps = {
        showFilters,
        subcategoryId,
        publicationYear,
        years,
        categories,
        setPublicationYear
    };

    const handleOpenCreateModal = () => {
        setSelectedBook(null); // Reset selected book
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
        setIsModalOpen(false);
    };

    const handleSaveBook = async (bookData) => {
        try {
            if (selectedBook) {
                await updateBook(selectedBook.bookId, bookData);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật sách thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await createBook(bookData);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm sách mới thành công',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            handleCloseModal();
            fetchItems();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: selectedBook ? 'Lỗi khi cập nhật sách' : 'Lỗi khi thêm sách mới',
                showConfirmButton: false,
                timer: 1500
            });
            console.error('Error saving book:', error);
        }
    };

    const handleDownloadTemplate = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        
        try {
            await downloadBookTemplate();
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Tải template thành công',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi tải template',
                timer: 1500,
                showConfirmButton: false
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleImportBooks = async (event) => {
        const file = event.target.files?.[0];
        if (!file || isImporting) return;

        const fileType = file.type;
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (!validTypes.includes(fileType)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng chọn file Excel (.xlsx hoặc .xls)',
                timer: 1500,
                showConfirmButton: false
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setIsImporting(true);
        try {
            await importBooksFromExcel(file);
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Import sách thành công',
                timer: 1500,
                showConfirmButton: false
            });
            await fetchItems();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Lỗi khi import sách',
                timer: 1500,
                showConfirmButton: false
            });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handlePublicationYearChange = (e) => {
        const value = parseInt(e.target.value);
        if (value < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Năm xuất bản không được nhỏ hơn 0',
                showConfirmButton: false,
                timer: 1500
            });
            setPublicationYear('');
            return;
        }
        if (value > currentYear) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Năm xuất bản không được lớn hơn năm hiện tại',
                showConfirmButton: false,
                timer: 1500
            });
            setPublicationYear('');
            return;
        }
        setPublicationYear(value.toString());
    };

    return (
        <div className="container mx-auto p-4 lg:p-6">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                {/* View Mode và Sort Order Buttons */}
                <div className="flex items-center gap-4">
                    {/* View Mode Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${viewMode === 'grid' 
                                    ? 'bg-[#1e439b] text-white shadow-sm' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            <FiGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${viewMode === 'list'
                                    ? 'bg-[#1e439b] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            <FiList className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Sort Order Select */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="appearance-none cursor-pointer
                            px-4 py-2.5 pr-10 rounded-lg
                            border border-gray-200 
                            text-sm font-medium text-gray-700 
                            bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] 
                            bg-[length:20px] bg-[right_8px_center] bg-no-repeat
                            hover:bg-gray-50 hover:border-gray-300
                            focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20 focus:border-[#1e439b]
                            transition-all duration-200 ease-in-out
                            min-w-[140px]
                            [&>option]:py-3 [&>option]:px-4 [&>option]:cursor-pointer 
                            [&>option]:text-gray-700 [&>option]:bg-white
                            [&>option:hover]:bg-gray-50"
                    >
                        <option value="newest" className="py-2">Mới nhất</option>
                        <option value="oldest" className="py-2">Cũ nhất</option>
                    </select>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-1 items-center justify-end gap-4 w-full lg:w-auto mb-3">
                    <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 lg:flex-initial">
                        <div className="relative flex-1 lg:w-64">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài liệu..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e439b] focus:border-transparent"
                            />
                        </div>
                        {/* <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-md border transition-colors
                                ${showFilters 
                                    ? 'border-[#1e439b] text-[#1e439b] bg-[#1e439b]/10' 
                                    : 'border-gray-200 hover:bg-gray-100'}`}
                        >
                            <FiSliders className="h-4 w-4" />
                        </button> */}
                    </form>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadTemplate}
                            disabled={isDownloading}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium 
                                ${isDownloading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'} 
                                text-white transition-colors shadow-sm`}
                        >
                            <FiDownload className="h-4 w-4 mr-2" />
                            {isDownloading ? 'Đang tải...' : 'Tải mẫu Excel'}
                        </button>

                        <label className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium 
                            ${isImporting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-orange-600 hover:bg-orange-700'} 
                            text-white transition-colors shadow-sm cursor-pointer`}
                        >
                            <FiUpload className="h-4 w-4 mr-2" />
                            {isImporting ? 'Đang import...' : 'Nhập file Excel'}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleImportBooks}
                                disabled={isImporting}
                                className="hidden"
                            />
                        </label>

                        <button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[#1e439b] text-white hover:bg-[#1e439b]/90 transition-colors shadow-sm"
                        >
                            <FiPlus className="h-4 w-4 mr-2" />
                            Thêm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {/* <FiltersPanel 
                {...filterProps} 
                years={years}
                onPublicationYearChange={handlePublicationYearChange}
            /> */}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e439b]"></div>
                </div>
            )}

            {/* Content Grid */}
            {!loading && (
                <>
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                            : 'space-y-4'
                    }`}>
                        {items.map((item) => (
                            <BookCard
                                key={item.id}
                                book={item}
                                viewMode={viewMode}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                    
                    {/* Thêm phân trang */}
                    {items.length > 0 && <Pagination pagination={pagination} setPagination={setPagination} />}
                </>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                        <FiDatabase className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                    <p className="text-gray-500 mt-1">Không tìm thấy tài liệu nào phù hợp.</p>
                </div>
            )}

            {/* Book Modal */}
            <BookModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={selectedBook}
                onSave={handleSaveBook}
                categories={categories}
            />
        </div>
    );
};

export default BooksManagement;