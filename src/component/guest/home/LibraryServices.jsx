import React from 'react';
import { FiBook, FiCheck, FiClock, FiDatabase, FiHeadphones, FiLayers, FiMonitor, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const LibraryServices = () => {
    const services = [
        {
            id: 1,
            title: 'Hỗ trợ Nghiên cứu',
            icon: FiDatabase,
            description: 'Dịch vụ hỗ trợ toàn diện cho hoạt động nghiên cứu khoa học',
            features: [
                'Tư vấn nghiên cứu chuyên sâu theo chuyên ngành',
                'Hướng dẫn tìm kiếm và trích dẫn tài liệu',
                'Hỗ trợ công cụ nghiên cứu và phân tích dữ liệu',
                'Tư vấn xuất bản và công bố khoa học',
                'Workshop định kỳ về phương pháp nghiên cứu'
            ],
            contactInfo: {
                email: 'research@thanhdo.edu.vn',
                phone: '024.xxxx.xxxx (ext: 123)'
            }
        },
        {
            id: 2,
            title: 'Không gian Học tập',
            icon: FiUsers,
            description: 'Môi trường học tập hiện đại, tiện nghi và chuyên nghiệp',
            features: [
                'Phòng học nhóm được trang bị đầy đủ thiết bị',
                'Khu vực học tập yên tĩnh cá nhân',
                'Phòng multimedia và thuyết trình',
                'Khu vực thảo luận mở',
                'WiFi tốc độ cao và ổ cắm điện tại mọi vị trí'
            ],
            contactInfo: {
                email: 'facilities@thanhdo.edu.vn',
                phone: '024.xxxx.xxxx (ext: 124)'
            }
        },
        {
            id: 3,
            title: 'Dịch vụ Số hóa',
            icon: FiMonitor,
            description: 'Chuyển đổi tài liệu sang định dạng số chuyên nghiệp',
            features: [
                'Số hóa tài liệu với chất lượng cao',
                'Chuyển đổi đa dạng định dạng tài liệu',
                'Tối ưu hóa cho tìm kiếm và truy cập',
                'Lưu trữ và bảo quản số dài hạn',
                'Hỗ trợ xuất bản điện tử'
            ],
            contactInfo: {
                email: 'digital@thanhdo.edu.vn',
                phone: '024.xxxx.xxxx (ext: 125)'
            }
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto px-4 py-2 fixed top-0 left-0 z-50"
            >
                <div className="flex justify-start items-center">
                    <Link
                        to="/"
                        className="bg-[#faa21a] hover:bg-[#faa21a]/80 text-white rounded-full p-2 border-2 border-white/30 transition duration-300 ease-in-out shadow-lg"
                    >
                        <IoArrowBackOutline className="text-xl" />
                    </Link>
                </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-[#1e439b] to-[#faa21a] text-white py-16"
            >
                <div className="container mx-auto px-4">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Dịch vụ Thư viện
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-100 max-w-2xl"
                    >
                        Khám phá các dịch vụ chất lượng cao tại Thư viện Thành Đô, 
                        nơi chúng tôi cam kết hỗ trợ tối đa cho việc học tập và nghiên cứu của bạn.
                    </motion.p>
                </div>
            </motion.div>

            {/* Services Section */}
            <div className="container mx-auto px-4 py-16">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 group hover:border-[#faa21a]/30 border-2 border-transparent"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gradient-to-r from-[#1e439b]/10 to-[#faa21a]/10 rounded-lg group-hover:from-[#1e439b]/20 group-hover:to-[#faa21a]/20 transition-all duration-300">
                                    <service.icon className="w-6 h-6 text-[#1e439b] group-hover:text-[#faa21a] transition-colors duration-300" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#1e439b]">{service.title}</h2>
                            </div>
                            
                            <p className="text-gray-600 mb-6">{service.description}</p>
                            
                            <div className="space-y-3 mb-8">
                                {service.features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <FiCheck className="w-5 h-5 text-[#faa21a] mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-3">
                                <h3 className="font-semibold text-gray-900">Thông tin liên hệ:</h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiClock className="w-4 h-4 text-[#faa21a]" />
                                    <span>Thời gian: 8:00 - 17:00 (Thứ 2 - Thứ 6)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiLayers className="w-4 h-4 text-[#faa21a]" />
                                    <span>Email: {service.contactInfo.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiHeadphones className="w-4 h-4 text-[#faa21a]" />
                                    <span>Hotline: {service.contactInfo.phone}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LibraryServices;