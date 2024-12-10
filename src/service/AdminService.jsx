import axios from 'axios';
import { getCookie } from './CookieService';
import { saveAs } from 'file-saver';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với interceptor
const axiosInstance = axios.create({
    baseURL: API_URL
});

// Thêm interceptor để tự động gửi token trong header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Tìm kiếm sách, hiển thị sách
export const searchBooks = async (params) => {
    try {
        const queryParams = new URLSearchParams({
            page: params.page || 0,
            size: params.size || 12,
            sortBy: params.sortBy || 'publicationYear',
            sortDirection: params.sortDirection || 'DESC',
            ...(params.keyword && { keyword: params.keyword }),
            ...(params.subcategoryId && { subcategoryId: params.subcategoryId }),
            ...(params.publicationYear && { publicationYear: params.publicationYear })
        });

        const response = await axiosInstance.get(`/books?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
};

// Xóa sách
export const deleteBook = async (bookId) => {
    try {
        const response = await axiosInstance.delete(`/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

// Cập nhật sách
export const updateBook = async (bookId, bookData) => {
    try {
        const formData = new FormData();
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('publisher', bookData.publisher);
        formData.append('publicationYear', bookData.publicationYear);
        formData.append('isbn', bookData.isbn);
        formData.append('description', bookData.description);
        formData.append('filePath', bookData.filePath);
        formData.append('subcategoryId', bookData.subcategoryId);

        // Chỉ append thumbnail nếu có file mới
        if (bookData.thumbnail) {
            formData.append('thumbnail', bookData.thumbnail);
        }

        const response = await axiosInstance.put(`/books/${bookId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

// Thêm sách mới
export const createBook = async (bookData) => {
    try {
        const formData = new FormData();
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('publisher', bookData.publisher);
        formData.append('publicationYear', bookData.publicationYear);
        formData.append('isbn', bookData.isbn);
        formData.append('description', bookData.description);
        formData.append('filePath', bookData.filePath);
        formData.append('subcategoryId', bookData.subcategoryId);

        if (bookData.thumbnail) {
            formData.append('thumbnail', bookData.thumbnail);
        }

        const response = await axiosInstance.post('/books', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

// Lấy chi tiết một sách
export const getBookById = async (bookId) => {
    try {
        const response = await axios.get(`${API_URL}/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting book:', error);
        throw error;
    }
};

// Tải template excel để import sách
export const downloadBookTemplate = async () => {
    try {
        const response = await axiosInstance.get('/books/template', {
            responseType: 'blob'
        });

        // Sử dụng FileSaver để download
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, 'book_import_template.xlsx');

        return true;
    } catch (error) {
        console.error('Error downloading template:', error);
        throw error;
    }
};

// Import sách từ file excel
export const importBooksFromExcel = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/books/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // Thêm timeout để tránh request quá lâu
            timeout: 30000, // 30 giây
        });
        return response.data;
    } catch (error) {
        console.error('Error importing books:', error);
        throw error;
    }
};

// Lấy thống kê tài liệu
export const getDocumentStatistics = async () => {
    try {
        const response = await axiosInstance.get('/books/statistics/documents');
        // Chuyển đổi response về format mong muốn
        return {
            books: response.data["Cơ sở dữ liệu sách"] || 0,
            research: response.data["Nghiên cứu khoa học"] || 0,
            thesis: response.data["Luận văn luận án"] || 0,
            multimedia: response.data["Đa phương tiện"] || 0
        };
    } catch (error) {
        console.error('Error fetching document statistics:', error);
        throw error;
    }
};

// Lấy thống kê lượt truy cập theo tháng
export const getMonthlyVisitStatistics = async (year, limit = 12) => {
    try {
        const response = await axiosInstance.get('/visitors/statistics/monthly', {
            params: { year, limit }
        });
        return {
            total: response.data.total,
            data: response.data.data || [] // Trả về mảng data
        };
    } catch (error) {
        console.error('Error fetching monthly visit statistics:', error);
        throw error;
    }
};

// Lấy lượt truy cập gần đây
export const getRecentVisits = async (limit = 5) => {
    try {
        const response = await axiosInstance.get('/visitors/statistics/recent', {
            params: { limit }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching recent visits:', error);
        throw error;
    }
};

// Lấy danh sách tin tức/sự kiện
export const getNewsEvents = async (params) => {
    try {
        const queryParams = new URLSearchParams({
            page: params.page || 0,
            size: params.size || 10,
            sort: params.sort || 'startTime,desc',
            search: params.search || '',
            startDate: params.startDate || '',
            endDate: params.endDate || ''
        });

        const response = await axiosInstance.get(`/news-events?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news/events:', error);
        throw error;
    }
};

// Lấy chi tiết tin tức/sự kiện theo ID
export const getNewsEventById = async (id) => {
    try {
        const response = await axiosInstance.get(`/news-events/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news/event details:', error);
        throw error;
    }
};

// Tạo tin tức/sự kiện mới
export const createNewsEvent = async (newsEventData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsEventData.title);
        formData.append('startTime', newsEventData.startTime);
        formData.append('endTime', newsEventData.endTime);
        formData.append('content', newsEventData.content);
        
        if (newsEventData.image) {
            formData.append('image', newsEventData.image);
        }

        const response = await axiosInstance.post('/news-events', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating news/event:', error);
        throw error;
    }
};

// Cập nhật tin tức/sự kiện
export const updateNewsEvent = async (id, newsEventData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsEventData.title);
        formData.append('startTime', newsEventData.startTime);
        formData.append('endTime', newsEventData.endTime);
        formData.append('content', newsEventData.content);
        
        if (newsEventData.image) {
            formData.append('image', newsEventData.image);
        }

        const response = await axiosInstance.put(`/news-events/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating news/event:', error);
        throw error;
    }
};

// Xóa tin tức/sự kiện
export const deleteNewsEvent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/news-events/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting news/event:', error);
        throw error;
    }
};