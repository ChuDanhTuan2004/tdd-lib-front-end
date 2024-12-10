import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AiFillBook } from "react-icons/ai";
import { FaComputer } from "react-icons/fa6";
import { FaPhotoVideo } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdOutlineFindInPage } from "react-icons/md";
import {
    getDocumentStatistics,
    getMonthlyVisitStatistics,
    getRecentVisits
} from '../../../../service/AdminService';
import { getVisitorStats } from '../../../../service/VisitorService';

// Đăng ký các components Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Constants
const CONSTANTS = {
    CHART_HEIGHT: '400px',
    YEAR_RANGE: {
        START: new Date().getFullYear() - 10,
        END: new Date().getFullYear()
    }
};

// Utility functions
const formatNumber = (num) => num.toLocaleString('vi-VN');

// Fake Data
const FAKE_DATA = {
    // Dữ liệu thống kê tài liệu
    documentStats: {
        books: 1234,
        research: 567,
        thesis: 890,
        multimedia: 345
    },

    // Dữ liệu lượt truy cập gần đây
    recentVisits: [
        {
            session_id: "13186E1A733566418680A820FD3769A4",
            visit_time: "2024-11-11 23:17:39",
            last_active_time: "5 phút trước"
        },
        {
            session_id: "AB62F6277C9561511A30163AB30BB4CF",
            visit_time: "2024-11-11 23:18:37",
            last_active_time: "10 phút trước"
        },
        {
            session_id: "E44B9D536FF724CA204C63C897F354BB",
            visit_time: "2024-11-11 23:20:53",
            last_active_time: "15 phút trước"
        },
        {
            session_id: "6516C738C31F0B4B21AFF4A5918D4AE2",
            visit_time: "2024-11-11 23:21:07",
            last_active_time: "20 phút trước"
        },
        {
            session_id: "449F77C5AD81B26B21F9D623E25F554C",
            visit_time: "2024-11-11 23:21:12",
            last_active_time: "25 phút trước"
        }
    ],

    // Hàm tạo dữ liệu biểu đồ theo năm
    generateChartData: (year) => {
        const months = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

        // Tạo dữ liệu ngẫu nhiên nhưng có xu hướng tăng dần
        const baseVisits = 500; // Số lượt truy cập cơ bản
        const randomFactor = 200; // Độ biến động ngẫu nhiên
        const trendFactor = 50; // Hệ số tăng trưởng theo tháng

        return months.map((month, index) => ({
            month,
            visits: Math.floor(
                baseVisits +
                (Math.random() * randomFactor) +
                (index * trendFactor)
            )
        }));
    }
};

// Components
const StatCard = React.memo(({ title, value, icon: Icon }) => (
    <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
                <p className="text-sm md:text-base text-gray-600 line-clamp-1">{title}</p>
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">{value}</h3>
                <p className="text-xs md:text-sm text-gray-500">Tổng số tài liệu</p>
            </div>
            <div className="p-2.5 md:p-3 bg-blue-50 rounded-lg shrink-0">
                <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-500" />
            </div>
        </div>
    </div>
));

const VisitsChart = React.memo(({ data = [], totalVisits = 0, selectedYear, onYearChange }) => {
    const chartData = useMemo(() => ({
        labels: data.map(item => item.month),
        datasets: [{
            label: 'Lượt truy cập',
            data: data.map(item => item.visits),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            borderRadius: 5,
            maxBarThickness: 50,
        }],
    }), [data]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y.toLocaleString()} lượt truy cập`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();
                    },
                    font: {
                        size: window.innerWidth < 640 ? 8 : 12
                    }
                },
                grid: {
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: window.innerWidth < 640 ? 8 : 12
                    }
                }
            }
        }
    }), []);

    const yearOptions = useMemo(() =>
        Array.from(
            { length: CONSTANTS.YEAR_RANGE.END - CONSTANTS.YEAR_RANGE.START + 1 },
            (_, i) => CONSTANTS.YEAR_RANGE.START + i
        ),
        []);

    return (
        <div className="bg-white p-4 md:p-5 lg:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
                <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold">Biểu đồ lượt truy cập theo tháng</h3>
                    <p className="text-sm text-gray-600">
                        Tổng lượt truy cập: {totalVisits.toLocaleString()}
                    </p>
                </div>
                <select
                    value={selectedYear}
                    onChange={onYearChange}
                    className="w-full md:w-auto px-3 py-2 border rounded text-sm"
                >
                    {yearOptions.map(year => (
                        <option key={year} value={year}>Năm {year}</option>
                    ))}
                </select>
            </div>
            <div className="h-[300px] md:h-[400px] lg:h-[500px]">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
});

// const RecentVisits = React.memo(({ visits }) => (
//     <div className="bg-white p-2.5 sm:p-3 lg:p-4 rounded-lg shadow-sm">
//         <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3">Lượt truy cập gần đây</h3>
//         <div className="space-y-2 sm:space-y-3">
//             {visits.map((visit, index) => (
//                 <div key={index} className="flex items-center justify-between gap-1.5 sm:gap-2">
//                     <div className="flex items-center gap-1.5 sm:gap-2">
//                         <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gray-100 rounded-full flex items-center justify-center">
//                             <FaComputer className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
//                         </div>
//                         <div className="min-w-0 max-w-[150px] sm:max-w-[200px] lg:max-w-none">
//                             <p className="font-medium text-[10px] sm:text-xs lg:text-sm truncate">
//                                 {visit.session_id}
//                             </p>
//                             <p className="text-[10px] sm:text-xs text-gray-600 truncate">
//                                 {new Date(visit.visit_time).toLocaleString('vi-VN')}
//                             </p>
//                         </div>
//                     </div>
//                     <span className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
//                         {visit.last_active_time}
//                     </span>
//                 </div>
//             ))}
//         </div>
//     </div>
// ));

// Main Component
export default function StatisticsPage() {
    // Tối ưu state management
    const [state, setState] = useState({
        selectedYear: CONSTANTS.YEAR_RANGE.END,
        chartData: { total: 0, data: [] },
        documentStats: {
            books: 0,
            research: 0,
            thesis: 0,
            multimedia: 0
        },
        recentVisits: [],
        loading: {
            documents: false,
            visits: false,
            recent: false
        },
        error: {
            documents: null,
            visits: null,
            recent: null
        }
    });

    // Tối ưu fetch functions
    const fetchData = useCallback(async (type, fetchFn, dataKey) => {
        setState(prev => ({
            ...prev,
            loading: { ...prev.loading, [type]: true },
            error: { ...prev.error, [type]: null }
        }));

        try {
            const data = await fetchFn();
            setState(prev => ({
                ...prev,
                [dataKey]: data,
                loading: { ...prev.loading, [type]: false }
            }));
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            setState(prev => ({
                ...prev,
                error: { ...prev.error, [type]: `Không thể tải ${type}` },
                loading: { ...prev.loading, [type]: false },
                [dataKey]: FAKE_DATA[dataKey] // Fallback to fake data
            }));
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchData('documents', getDocumentStatistics, 'documentStats');
        fetchData('visits', () => getMonthlyVisitStatistics(state.selectedYear), 'chartData');
        // fetchData('recent', getRecentVisits, 'recentVisits');
    }, []);

    // Year change handler
    const handleYearChange = useCallback((event) => {
        const year = parseInt(event.target.value);
        setState(prev => ({ ...prev, selectedYear: year }));
        fetchData('visits', () => getMonthlyVisitStatistics(year), 'chartData');
    }, [fetchData]);

    // Render loading/error components
    const renderWithLoadingAndError = (type, component) => {
        if (state.loading[type]) return (
            <div className="flex items-center justify-center h-full min-h-[100px]">
                <div className="text-xs sm:text-sm text-gray-500">Đang tải...</div>
            </div>
        );
        if (state.error[type]) return (
            <div className="flex items-center justify-center h-full min-h-[100px]">
                <div className="text-xs sm:text-sm text-red-500">{state.error[type]}</div>
            </div>
        );
        return component;
    };

    // Trong hàm fetchData, thêm xử lý cho visitor stats
    useEffect(() => {
        const fetchVisitorStats = async () => {
            try {
                const stats = await getVisitorStats();
                setState(prev => ({
                    ...prev,
                    visitorStats: stats,
                    loading: { ...prev.loading, visitors: false }
                }));
            } catch (err) {
                console.error('Error fetching visitor stats:', err);
                setState(prev => ({
                    ...prev,
                    error: { ...prev.error, visitors: 'Không thể tải thống kê truy cập' },
                    loading: { ...prev.loading, visitors: false }
                }));
            }
        };

        fetchVisitorStats();
        // Thiết lập interval để cập nhật định kỳ
        const interval = setInterval(fetchVisitorStats, 5 * 60 * 1000); // 5 phút

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4 md:space-y-6 lg:space-y-8 p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {renderWithLoadingAndError('documents', (
                    <>
                        <StatCard
                            title="Cơ sở dữ liệu sách"
                            value={formatNumber(state.documentStats.books)}
                            icon={GiBookshelf}
                        />
                        <StatCard
                            title="Nghiên cứu khoa học"
                            value={formatNumber(state.documentStats.research)}
                            icon={MdOutlineFindInPage}
                        />
                        <StatCard
                            title="Luận văn luận án"
                            value={formatNumber(state.documentStats.thesis)}
                            icon={AiFillBook}
                        />
                        <StatCard
                            title="Đa phương tiện"
                            value={formatNumber(state.documentStats.multimedia)}
                            icon={FaPhotoVideo}
                        />
                    </>
                ))}
            </div>

            <div>
                {renderWithLoadingAndError('visits', (
                    <VisitsChart
                        data={state.chartData.data}
                        totalVisits={state.chartData.total}
                        selectedYear={state.selectedYear}
                        onYearChange={handleYearChange}
                    />
                ))}
            </div>
        </div>
    );
}