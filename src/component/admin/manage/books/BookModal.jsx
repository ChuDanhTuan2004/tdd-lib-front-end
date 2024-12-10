import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import Swal from 'sweetalert2';

const FormInput = ({ label, id, required, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={id}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20 focus:border-[#1e439b]
                placeholder:text-gray-400 transition duration-200"
            {...props}
        />
    </div>
);

const ImagePreview = ({ src, title, subtitle, onRemove }) => (
    <div className="relative group">
        <div className="relative rounded-lg overflow-hidden shadow-md aspect-[3/4]">
            <img
                src={src}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-200 
                    group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 
                group-hover:bg-opacity-40 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                from-black to-transparent text-white p-4">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs opacity-75">{subtitle}</p>
            </div>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                        hover:bg-red-600"
                >
                    <FiX className="w-4 h-4" />
                </button>
            )}
        </div>
    </div>
);

const BookModal = ({ isOpen, onClose, initialData, onSave, categories }) => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        publisher: '',
        publicationYear: '',
        description: '',
        filePath: '',
        subcategoryId: '',
        thumbnail: null,
        ...initialData
    });

    const [isLoading, setIsLoading] = useState(false);
    const [newThumbnailPreview, setNewThumbnailPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setBook({
                    ...initialData,
                    thumbnail: null,
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);

    const resetForm = () => {
        setBook({
            title: '',
            author: '',
            publisher: '',
            publicationYear: '',
            description: '',
            filePath: '',
            subcategoryId: '',
            thumbnail: null,
            thumbnailUrl: '',
        });
        setNewThumbnailPreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'publicationYear') {
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            
            if (value && (year < 0 || year > currentYear)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: `Năm xuất bản phải từ 0 đến ${currentYear}`,
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
        }

        setBook(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBook(prev => ({ ...prev, thumbnail: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const requiredFields = ['title', 'author', 'filePath', 'subcategoryId'];
        const missingFields = requiredFields.filter(field => !book[field]);
        
        if (missingFields.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Thiếu thông tin',
                text: 'Vui lòng điền đầy đủ các trường bắt buộc',
                showConfirmButton: false,
                timer: 1500
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await onSave(book);
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể lưu tài liệu',
                showConfirmButton: false,
                timer: 1500
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleImageSelect(files[0]);
        }
    };

    const handleImageSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setBook(prev => ({ ...prev, thumbnail: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng chọn file hình ảnh hợp lệ',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleRemoveImage = (type) => {
        if (type === 'new') {
            setNewThumbnailPreview(null);
            setBook(prev => ({ ...prev, thumbnail: null }));
        }
    };

    // Tạo danh sách tất cả subcategories
    const allSubcategories = categories?.flatMap(category => 
        category.subcategories.map(sub => ({
            ...sub,
            categoryName: category.name
        }))
    ) || [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {initialData?.bookId ? 'Chỉnh sửa Tài liệu' : 'Thêm Tài liệu Mới'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {initialData?.bookId ? 'Cập nhật thông tin tài liệu.' : 'Nhập thông tin cho tài liệu mới.'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full 
                                hover:bg-gray-100 transition-all duration-200"
                        >
                            <IoClose className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Tiêu đề"
                                    id="title"
                                    name="title"
                                    value={book.title}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tiêu đề sách"
                                    required
                                />
                                <FormInput
                                    label="Tác giả"
                                    id="author"
                                    name="author"
                                    value={book.author}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên tác giả"
                                    required
                                />
                                <FormInput
                                    label="Nhà xuất bản"
                                    id="publisher"
                                    name="publisher"
                                    value={book.publisher}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên nhà xuất bản"
                                />
                                <FormInput
                                    label="Năm xuất bản"
                                    id="publicationYear"
                                    name="publicationYear"
                                    type="number"
                                    value={book.publicationYear}
                                    onChange={handleInputChange}
                                    placeholder="Nhập năm xuất bản"
                                />

                                {/* Select cho subcategory */}
                                <div className="space-y-2">
                                    <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="subcategoryId"
                                        name="subcategoryId"
                                        value={book.subcategoryId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200
                                            focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20 
                                            focus:border-[#1e439b] transition duration-200"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories?.map(category => (
                                            <optgroup key={category.id} label={category.name}>
                                                {category.subcategories.map(sub => (
                                                    <option key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* File Path */}
                            <div className="my-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Đường dẫn file <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        name="filePath"
                                        value={book.filePath}
                                        onChange={handleInputChange}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
                                            focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20 
                                            focus:border-[#1e439b] placeholder:text-gray-400 
                                            transition duration-200"
                                        placeholder="Nhập đường dẫn đến file PDF hoặc video"
                                        required
                                    />
                                    {book.filePath && (
                                        <a
                                            href={book.filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2.5 rounded-lg
                                                text-sm font-medium text-[#1e439b] bg-[#1e439b]/5
                                                hover:bg-[#1e439b]/10 transition-colors duration-200"
                                        >
                                            Kiểm tra
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={book.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-1 rounded-lg border border-gray-200
                                        focus:outline-none focus:ring-2 focus:ring-[#1e439b]/20 
                                        focus:border-[#1e439b] placeholder:text-gray-400 
                                        transition duration-200 resize-none"
                                    placeholder="Nhập mô tả sách"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Ảnh bìa
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6
                                        ${isDragging 
                                            ? 'border-[#1e439b] bg-[#1e439b]/5' 
                                            : 'border-gray-300 hover:border-[#1e439b]/30'
                                        } transition-all duration-200`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="text-center">
                                        <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="inline-flex items-center px-4 py-2 rounded-lg
                                                    text-sm font-medium text-[#1e439b] bg-[#1e439b]/5
                                                    hover:bg-[#1e439b]/10 transition-colors duration-200"
                                            >
                                                <FiImage className="mr-2 h-4 w-4" />
                                                Chọn ảnh
                                            </button>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            hoặc kéo và thả file vào đây
                                        </p>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {book.thumbnailUrl && (
                                        <ImagePreview
                                            src={book.thumbnailUrl}
                                            title="Ảnh hiện tại"
                                            subtitle="Được tải lên trước đó"
                                        />
                                    )}
                                    {newThumbnailPreview && (
                                        <ImagePreview
                                            src={newThumbnailPreview}
                                            title="Ảnh mới"
                                            subtitle="Sẽ thay thế ảnh hiện tại"
                                            onRemove={() => handleRemoveImage('new')}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300
                                    hover:bg-gray-50 font-medium transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-[#1e439b] text-white
                                    hover:bg-[#1e439b]/90 font-medium
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    initialData?.bookId ? 'Lưu thay đổi' : 'Thêm mới'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;