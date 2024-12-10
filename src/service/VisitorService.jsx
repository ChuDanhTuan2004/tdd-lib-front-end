import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const API_URL = 'http://localhost:8080/api';

// Tạo instance axios với interceptor
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Lấy thống kê tổng quan về visitor
export const getVisitorStats = async () => {
    try {
        // Gọi cả 2 API để lấy đầy đủ thông tin
        const [activeResponse, statsResponse] = await Promise.all([
            axiosInstance.get('/visitors/active'),
            axiosInstance.post('/visitors/record-visit')
        ]);

        // Kết hợp dữ liệu từ cả 2 API
        return {
            activeVisitors: activeResponse.data.activeVisitors,
            visitorsToday: statsResponse.data.visitorsToday,
            visitorsThisMonth: statsResponse.data.visitorsThisMonth,
            visitorsThisYear: statsResponse.data.visitorsThisYear
        };
    } catch (error) {
        console.error('Error getting visitor stats:', error);
        throw error;
    }
};

// Kết thúc phiên truy cập
export const endVisitorSession = async () => {
    try {
        await axiosInstance.post('/visitors/end-session');
    } catch (error) {
        console.error('Error ending visitor session:', error);
        throw error;
    }
};

// Lấy thống kê lượt truy cập theo tháng
export const getMonthlyVisitStats = async (year, limit = 12) => {
    try {
        const response = await axiosInstance.get('/visitors/statistics/monthly', {
            params: {
                year,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting monthly visit statistics:', error);
        throw error;
    }
};

// Lấy thống kê các lượt truy cập gần đây
export const getRecentVisitStats = async (limit = 5) => {
    try {
        const response = await axiosInstance.get('/visitors/statistics/recent', {
            params: {
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting recent visit statistics:', error);
        throw error;
    }
};

// Kết nối WebSocket để lắng nghe cập nhật số lượng visitor active
export function connectVisitorWebSocket(onMessage) {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log('WebSocket connection established');
        stompClient.subscribe('/topic/active-visitors', (message) => {
            const activeVisitors = JSON.parse(message.body);
            onMessage(activeVisitors);
        });
    }, (error) => {
        console.error('STOMP error:', error);
    });

    return () => {
        if (stompClient.connected) {
            stompClient.disconnect();
        }
    };
}