import React from 'react';
import { FiEdit2, FiTrash2, FiPlay, FiEye, FiClock } from 'react-icons/fi';

const VideoCard = ({ video, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="relative">
            {/* Thumbnail với overlay play icon */}
            <div className="aspect-video relative bg-gray-100">
                {video.thumbnailUrl ? (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiPlay className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
        
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{video.author}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                    <FiEye className="w-4 h-4" />
                    <span>{video.views || 0} lượt xem</span>
                </div>
                <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{video.uploadDate || 'Unknown'}</span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
                <button 
                    onClick={() => onEdit(video)}
                    className="px-3 py-1 text-sm border rounded hover:bg-blue-50 text-blue-600 border-blue-600 flex items-center gap-1"
                >
                    <FiEdit2 className="w-4 h-4" />
                    Sửa
                </button>
                <button 
                    onClick={() => onDelete(video)}
                    className="px-3 py-1 text-sm border rounded hover:bg-red-50 text-red-600 border-red-600 flex items-center gap-1"
                >
                    <FiTrash2 className="w-4 h-4" />
                    Xóa
                </button>
            </div>
        </div>
    </div>
);

export default VideoCard;