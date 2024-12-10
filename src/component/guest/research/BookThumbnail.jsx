import React, { useState } from 'react';
import { FiBook } from 'react-icons/fi';

const BookThumbnail = ({ url, title, className = "" }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleImageError = () => {
        setError(true);
        setLoading(false);
    };

    const handleImageLoad = () => {
        setLoading(false);
    };

    return (
        <div className={`relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden ${className}`}>
            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1e439b] border-t-transparent"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-4">
                    <FiBook className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center">{title || 'Không tải được ảnh'}</span>
                </div>
            )}

            {/* Image */}
            <img
                src={error ? '/placeholder-book.jpg' : url}
                alt={title}
                className={`
                    w-full h-full object-cover
                    transition-all duration-300
                    group-hover:scale-105
                    ${loading ? 'opacity-0' : 'opacity-100'}
                `}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};

export default BookThumbnail;