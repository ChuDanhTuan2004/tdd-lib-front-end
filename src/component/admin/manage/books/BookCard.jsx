import React from 'react';
import { FiEdit2, FiTrash2, FiBook, FiCalendar, FiUser, FiPlay, FiClock } from 'react-icons/fi';

const BookCard = ({ book, viewMode, onEdit, onDelete }) => {
    const isVideo = book.subcategoryId === 10; // ID 10 là "Video bài giảng"
    const displayYear = book.publicationYear || 'Chưa cập nhật';
    const displayAuthor = book.author || 'Chưa cập nhật';
    
    // Component cho placeholder image
    const PlaceholderImage = () => (
        <div className={`flex-shrink-0 ${viewMode === 'list' ? 'w-16 h-20' : 'w-full aspect-video'} 
            bg-gray-100 rounded-lg flex items-center justify-center`}>
            {isVideo ? (
                <FiPlay className="w-8 h-8 text-gray-400" />
            ) : (
                <FiBook className="w-8 h-8 text-gray-400" />
            )}
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm 
                hover:shadow-md hover:border-gray-300/80 transition-all duration-200">
                <div className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden shadow-sm">
                        {book.thumbnail ? (
                            <img
                                src={book.thumbnail}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder.png';
                                }}
                            />
                        ) : (
                            <PlaceholderImage />
                        )}
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate 
                            hover:text-[#1e439b] transition-colors">
                            {book.title}
                        </h3>
                        <div className="mt-2 space-y-1.5">
                            <div className="flex items-center text-sm text-gray-600">
                                {isVideo ? (
                                    <>
                                        <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{book.author || ''}</span>
                                    </>
                                ) : (
                                    <>
                                        <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{displayAuthor}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{displayYear}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(book)}
                            className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 
                                text-sm font-medium text-[#1e439b] bg-[#1e439b]/5
                                hover:bg-[#1e439b]/10 active:bg-[#1e439b]/15
                                transition-colors duration-200"
                        >
                            <FiEdit2 className="w-4 h-4 mr-1.5" />
                            Sửa
                        </button>
                        <button
                            onClick={() => onDelete(book)}
                            className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 
                                text-sm font-medium text-red-600 bg-red-50
                                hover:bg-red-100 active:bg-red-200
                                transition-colors duration-200"
                        >
                            <FiTrash2 className="w-4 h-4 mr-1.5" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-white rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <div className={`aspect-[3/4] relative`}>
                {book.thumbnail ? (
                    <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                            e.target.src = '/placeholder.png';
                        }}
                    />
                ) : (
                    <PlaceholderImage />
                )}
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                            <FiPlay className="w-6 h-6 text-white" />
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-end gap-1.5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(book);
                            }}
                            className="rounded-full p-2 bg-white/90 text-[#1e439b] hover:bg-[#1e439b] 
                                hover:text-white shadow-lg backdrop-blur-sm transition-all duration-200"
                        >
                            <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(book);
                            }}
                            className="rounded-full p-2 bg-white/90 text-red-600 hover:bg-red-600 
                                hover:text-white shadow-lg backdrop-blur-sm transition-all duration-200"
                        >
                            <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#1e439b] transition-colors">
                    {book.title}
                </h3>
                <div className="mt-2 space-y-1">
                    {isVideo ? (
                        <div className="flex items-center text-xs text-gray-600">
                            <FiUser className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            <span> {book.author || ''}</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-xs text-gray-600">
                            <FiUser className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            <span className="truncate">{displayAuthor}</span>
                        </div>
                    )}
                    <div className="flex items-center text-xs text-gray-600">
                        <FiCalendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        <span>{displayYear}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;