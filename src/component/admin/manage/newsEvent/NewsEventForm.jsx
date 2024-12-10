import React, { useState, useEffect } from 'react';
import { createNewsEvent, updateNewsEvent } from '../../../../service/AdminService';
import { FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const NewsEventForm = ({ event, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        startTime: event?.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
        endTime: event?.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
        content: event?.content || '',
        image: null
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate dates whenever startTime or endTime changes
    useEffect(() => {
        if (formData.startTime && formData.endTime) {
            const startDate = new Date(formData.startTime);
            const endDate = new Date(formData.endTime);
            
            if (endDate <= startDate) {
                setError('Thời gian kết thúc phải sau thời gian bắt đầu');
            } else {
                setError('');
            }
        }
    }, [formData.startTime, formData.endTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const startDate = new Date(formData.startTime);
        const endDate = new Date(formData.endTime);
        
        if (endDate <= startDate) {
            setError('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        try {
            setIsSubmitting(true);
            
            if (event) {
                await updateNewsEvent(event.id, formData);
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật tin tức/sự kiện thành công.',
                    icon: 'success',
                    confirmButtonColor: '#1e439b',
                });
            } else {
                await createNewsEvent(formData);
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Thêm mới tin tức/sự kiện thành công.',
                    icon: 'success',
                    confirmButtonColor: '#1e439b',
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi lưu tin tức/sự kiện:', error);
            await Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi lưu tin tức/sự kiện.',
                icon: 'error',
                confirmButtonColor: '#1e439b',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {event ? 'Chỉnh sửa tin tức/sự kiện' : 'Thêm tin tức/sự kiện mới'}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Hiển thị thông báo lỗi */}
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian bắt đầu
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian kết thúc
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    min={formData.startTime} // Thêm thuộc tính min
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b] ${
                                        error ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e439b]"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={!!error || isSubmitting}
                                className={`px-4 py-2 text-white rounded-lg flex items-center gap-2
                                    ${error || isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#1e439b] hover:bg-[#1e439b]/90'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <span>{event ? 'Cập nhật' : 'Thêm mới'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsEventForm;