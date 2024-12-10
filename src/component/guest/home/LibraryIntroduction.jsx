import React, { useState, useEffect } from 'react';
import {
    FaBook,
    FaCalendarAlt,
    FaClock,
    FaFacebookF,
    FaGoogle,
    FaLaptop,
    FaSearch,
    FaUsers,
    FaYoutube
} from 'react-icons/fa';
import { FiBook, FiMonitor, FiUsers, FiVideo } from 'react-icons/fi';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLatestEvents } from '../../../service/GuestService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function LibraryIntroduction() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getLatestEvents();
                const formattedEvents = data.map(event => ({
                    title: event.title,
                    date: formatEventDate(event.startTime, event.endTime),
                    time: formatEventTime(event.startTime, event.endTime),
                    content: event.content
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Lỗi khi tải sự kiện:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Hàm format ngày
    const formatEventDate = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start.toDateString() === end.toDateString()) {
            // Cùng ngày
            return format(start, 'dd/MM/yyyy', { locale: vi });
        } else {
            // Khác ngày
            return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
        }
    };

    // Hàm format thời gian
    const formatEventTime = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start.getHours() === 0 && end.getHours() === 23) {
            return 'Cả ngày';
        } else {
            return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
        }
    };

    const features = [
        { icon: <FaBook className="w-6 h-6" />, title: 'Bộ sưu tập đa dạng', description: 'Hơn 5,000 đầu sách, tạp chí, và tài liệu học thuật trong nhiều lĩnh vực' },
        { icon: <FaSearch className="w-6 h-6" />, title: 'Tìm kiếm nâng cao', description: 'Công cụ tìm kiếm thông minh với bộ lọc chi tiết và gợi ý tương tự' },
        { icon: <FaCalendarAlt className="w-6 h-6" />, title: 'Không gian học tập', description: 'Không gian học tập đa dạng với nhiều khu vực học tập và các dịch vụ hỗ trợ học tập' },
        { icon: <FaLaptop className="w-6 h-6" />, title: 'Tài nguyên điện tử', description: 'Truy cập hàng triệu sách điện tử, tạp chí và cơ sở dữ liệu học thuật trực tuyến' },
        { icon: <FaClock className="w-6 h-6" />, title: 'Giờ mở cửa', description: 'Mở cửa từ 8:00 đến 17:00 từ Thứ 2 đến Thứ 6' },
        { icon: <FaUsers className="w-6 h-6" />, title: 'Hỗ trợ chuyên nghiệp', description: 'Đội ngũ thủ thư và chuyên gia thông tin luôn sẵn sàng hỗ trợ trực tiếp' },
    ]

    const collections = [
        { title: 'Sách giáo trình', count: '1,000+' },
        { title: 'Sách tham khảo', count: '1,000+' },
        { title: 'Tạp chí học thuật', count: '1,000+' },
        { title: 'Luận văn và luận án', count: '1,000+' },
        { title: 'Tài liệu đa phương tiện', count: '1,000+' },
        { title: 'Cơ sở dữ liệu trực tuyến', count: '1,000+' },
    ]

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-2 fixed top-0 left-0 z-50">
                <div className="flex justify-start items-center">
                    <Link
                        to="/"
                        className="bg-[#faa21a] hover:bg-[#fb8c00] text-white rounded-full p-2 border-2 border-yellow-300 transition duration-300 ease-in-out"
                    >
                        <IoArrowBackOutline className="text-xl" />
                    </Link>
                </div>
            </div>

            {/* Introduction Section */}
            <section className="py-16 bg-gradient-to-b from-blue-700 to-yellow-500">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-center text-white"
                    >
                        <h2 className="text-3xl font-bold mb-6">Chào mừng đến với Thư viện Đại học Thành Đô</h2>
                        <p className="text-lg mb-8">
                            Thư viện Đại học Thành Đô là trung tâm học thuật hiện đại, cung cấp không gian học tập đa dạng và nguồn tài nguyên phong phú.
                            Chúng tôi cam kết hỗ trợ sinh viên, giảng viên và nhà nghiên cứu trong hành trình khám phá tri thức và sáng tạo học thuật.
                        </p>
                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-4 gap-4"
                        >
                            {[1, 2, 3, 4].map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={scaleIn}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/20 p-4 rounded"
                                >
                                    {item === 1 && <FiBook className="w-8 h-8 text-[#faa21a] mx-auto mb-2" />}
                                    {item === 2 && <FiUsers className="w-8 h-8 text-[#faa21a] mx-auto mb-2" />}
                                    {item === 3 && <FiMonitor className="w-8 h-8 text-[#faa21a] mx-auto mb-2" />}
                                    {item === 4 && <FiVideo className="w-8 h-8 text-[#faa21a] mx-auto mb-2" />}
                                    <p className="font-semibold">{item === 1 ? '1,000+' : item === 2 ? '1,000+' : item === 3 ? '1.000+' : '500+'}</p>
                                    <p className="text-sm">{item === 1 ? 'Cơ sở dữ liệu sách' : item === 2 ? 'Nghiên cứu khoa học' : item === 3 ? 'Luận văn/ luận án' : 'Tài liệu đa phương tiện'}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12 text-blue-700"
                    >
                        Dịch vụ và Tiện ích
                    </motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.03 }}
                                className="p-6 rounded shadow border-l-4 border-blue-700 hover:border-yellow-500"
                            >
                                <div className="text-yellow-500 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Collections Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-6 gap-6"
                    >
                        {collections.map((collection, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                whileHover={{ scale: 1.1 }}
                                className="text-center"
                            >
                                <div className="bg-blue-700 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-lg font-bold">{collection.count}</span>
                                </div>
                                <h3 className="font-semibold text-blue-700">{collection.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12 text-blue-700"
                    >
                        Sự kiện sắp diễn ra
                    </motion.h2>
                    
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        {loading ? (
                            // Loading skeleton
                            [...Array(4)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-gray-50 p-6 rounded shadow animate-pulse"
                                >
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </motion.div>
                            ))
                        ) : events.length > 0 ? (
                            // Hiển thị sự kiện
                            events.map((event, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gray-50 p-6 rounded shadow"
                                >
                                    <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                        {event.title}
                                    </h3>
                                    <div className="text-gray-600">
                                        <p className="mb-1">
                                            <span className="font-medium">Ngày: </span>
                                            {event.date}
                                        </p>
                                        <p>
                                            <span className="font-medium">Thời gian: </span>
                                            {event.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // Không có sự kiện
                            <div className="col-span-2 text-center text-gray-500">
                                Hiện tại chưa có sự kiện nào được lên lịch
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-100 text-gray-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded shadow"
                        >
                            <p className="mb-4">"Thư viện Đại học Thành Đô là ngôi nhà thứ hai của em. Không gian học tập tuyệt vời và nguồn tài liệu phong phú đã giúp em rất nhiều trong quá trình học tập."</p>
                            <p className="font-semibold">Nguyễn Quân Bảo - Sinh viên năm 3</p>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded shadow"
                        >
                            <p className="mb-4">"Tôi rất ấn tượng với sự chuyên nghiệp của đội ngũ thủ thư. Họ luôn sẵn sàng hỗ trợ và tư vấn tận tình mỗi khi tôi cần giúp đỡ."</p>
                            <p className="font-semibold">Bùi Thị Thúy Hằng - Giảng viên</p>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded shadow"
                        >
                            <p className="mb-4">"Cơ sở dữ liệu trực tuyến của thư viện là một kho tàng vô giá cho nghiên cứu của em. Em có thể truy cập mọi lúc, mọi nơi, thật tiện lợi."</p>
                            <p className="font-semibold">Nguyễn Hoàng Gia Minh - Nghiên cứu sinh</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
