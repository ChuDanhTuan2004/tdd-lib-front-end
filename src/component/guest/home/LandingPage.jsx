import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BiCheck, BiMenu, BiX } from 'react-icons/bi';
import {
  FaBook,
  FaCalendarAlt, FaCalendarDay,
  FaChartBar, FaChartLine, FaEnvelope,
  FaFacebookF,
  FaFlask,
  FaGoogle,
  FaMapMarkerAlt, FaPhone,
  FaPhotoVideo,
  FaScroll,
  FaUserClock,
  FaYoutube
} from 'react-icons/fa';
import { SiZalo } from "react-icons/si";
import { Link } from 'react-router-dom';
import LogoThanhDo from '../../../asset/image/logo-thanhdo.png';
import { getNewsEvents } from '../../../service/AdminService';
import { connectVisitorWebSocket, getVisitorStats } from '../../../service/VisitorService';
import { getLatestEvents } from '../../../service/GuestService';

// Thêm các animation variants
const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sử dụng React Query để fetch data
  const { 
    data: visitorStats = {
      activeVisitors: 0,
      visitorsToday: 0,
      visitorsThisMonth: 0,
      visitorsThisYear: 0
    }, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: getVisitorStats,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const disconnect = connectVisitorWebSocket((activeVisitors) => {
      queryClient.setQueryData(['visitorStats'], (oldData) => ({
        ...oldData,
        activeVisitors
      }));
    });

    return () => disconnect();
  }, [queryClient]);

  useEffect(() => {
    const fetchNewsEvents = async () => {
      try {
        setLoading(true);
        const data = await getLatestEvents();
        setNewsEvents(data);
      } catch (error) {
        console.error('Lỗi khi tải tin tức/sự kiện:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsEvents();
  }, []);

  const categories = [
    {
      title: "Cơ sở dữ liệu sách",
      desc: "Truy cập hàng nghìn sách điện tử đa dạng lĩnh vực từ các nhà xuất bản uy tín trong và ngoài nước",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      icon: "📚"
    },
    {
      title: "Nghiên cứu khoa học",
      desc: "Kho tài liệu nghiên cứu học thuật chất lượng cao từ các tạp chí khoa học hàng đầu thế giới",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      icon: "🔬"
    },
    {
      title: "Luận văn/ luận án",
      desc: "Bộ sưu tập luận văn, luận án đa ngành nghề từ các trường đại học và viện nghiên cứu",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      icon: "📝"
    },
    {
      title: "Tài liệu đa phương tiện",
      desc: "Video bài giảng, audio sách nói và các tài liệu số hóa phong phú khác",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      icon: "🎥"
    }
  ];

  // Hàm xác định loại badge dựa trên type của tin tức
  const getBadgeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'news':
        return 'bg-[#faa21a]';
      case 'event':
        return 'bg-[#1e439b]';
      case 'exhibition':
        return 'bg-[#1e439b]';
      case 'workshop':
        return 'bg-[#1e439b]';
      default:
        return 'bg-[#1e439b]';
    }
  };

  // Hàm chuyển đổi type sang tiếng Việt
  const getTypeText = (type) => {
    switch (type?.toLowerCase()) {
      case 'news':
        return 'Tin mới';
      case 'event':
        return 'Sự kiện';
      case 'exhibition':
        return 'Triển lãm';
      case 'workshop':
        return 'Hội thảo';
      default:
        return 'Tin tức';
    }
  };

  // Cập nhật phần hiển thị loading
  const renderLoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link className="flex items-center space-x-2" to="/">
              <motion.img
                src={LogoThanhDo}
                alt="Logo"
                className="h-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="font-bold text-[#1e439b] hidden sm:block"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Thư viện số Thành Đô
              </motion.span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <motion.div 
                className="flex items-center space-x-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { to: "/introduction", text: "Giới thiệu" },
                  { to: "/research", text: "Nghiên cứu" },
                  { to: "/categories", text: "Danh mục" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                  >
                    <Link 
                      className="text-sm font-medium text-gray-700 hover:text-[#1e439b] transition-colors"
                      to={item.to}
                    >
                      {item.text}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={fadeIn}>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 bg-[#1e439b] text-white rounded-lg hover:bg-[#1e439b]/90 
                      transition-colors shadow-sm text-sm font-medium"
                  >
                    Đăng Nhập
                  </Link>
                </motion.div>
              </motion.div>
            </nav>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <BiX className="h-6 w-6" /> : <BiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <motion.div
        className={`fixed inset-0 z-40 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <motion.div
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
                onClick={() => setIsMenuOpen(false)}
              >
                <BiX className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link className="block py-2 text-lg font-medium hover:text-[#1e439b] transition-colors" to="/introduction">
                Giới thiệu
              </Link>
              <Link className="block py-2 text-lg font-medium hover:text-[#1e439b] transition-colors" to="/research">
                Nghiên cứu
              </Link>
              <Link className="block py-2 text-lg font-medium hover:text-[#1e439b] transition-colors" to="/categories">
                Danh mục
              </Link>
              <Link className="block mt-4 px-4 py-2 bg-[#1e439b] text-white rounded-lg text-center" to="/login">
                Đăng Nhập
              </Link>
            </nav>
          </div>
        </motion.div>
      </motion.div>

      <main className="flex-1">
      <section className="w-full py-12 md:py-12 lg:py-12 xl:py-48 bg-gradient-to-r from-[#1e439b] to-[#faa21a]">
          <motion.div 
            className="container mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Thư viện số Thành Đô
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Khám phá kho tàng tri thức với hàng triệu tài liệu số hóa
                </p>
              </motion.div>
              <motion.div 
                className="w-full max-w-sm space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  to="/reader"
                  className="w-full px-6 py-3.5 bg-[#faa21a] text-[#1e439b] rounded-full hover:bg-[#f59305] transition-colors flex items-center justify-center font-medium text-lg"
                >
                  Khám phá ngay
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="py-16 sm:py-12 bg-white">
          <div className="container mx-auto px-4">
            {/* <h2 className="text-4xl font-bold text-center mb-16 text-[#0b328f]">Kho tàng tri thức</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {categories.map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-base text-gray-200 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
                      {item.desc}
                    </p>
                    <Link 
                      to="/reader"
                      className="block w-full bg-white/90 text-[#0b328f] py-3 rounded-xl font-semibold text-lg hover:bg-white transition-colors duration-300 mb-2 text-center"
                    >
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Library Services Section */}
        <section className="w-full py-16 md:py-12 bg-gray-50">
            <div className="container mx-auto px-6">
                <motion.h2 
                    className="text-3xl sm:text-4xl font-bold mb-12 text-center text-[#1e439b]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Dịch vụ Thư viện
                </motion.h2>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Hỗ trợ Nghiên cứu",
                            icon: "🔬",
                            features: [
                                "Tư vấn nghiên cứu chuyên sâu",
                                "Hướng dẫn tìm kiếm tài liệu",
                                "Hỗ trợ trích dẫn tài liệu"
                            ]
                        },
                        {
                            title: "Không gian Học tập",
                            icon: "📚",
                            features: [
                                "Phòng học nhóm hiện đại",
                                "Khu vực học tập yên tĩnh",
                                "Trang thiết bị đầy đủ"
                            ]
                        },
                        {
                            title: "Dịch vụ Số hóa",
                            icon: "💻",
                            features: [
                                "Số hóa tài liệu chất lượng cao",
                                "Chuyển đổi định dạng tài liệu",
                                "Lưu trữ và bảo quản số"
                            ]
                        }
                    ].map((service, index) => (
                        <motion.div
                            key={index}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{service.icon}</span>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {service.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                                            <BiCheck className="w-5 h-5 text-[#1e439b]" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <Link 
                                        to="/services"
                                        className="w-full px-4 py-2 text-sm font-medium text-[#1e439b] 
                                        bg-[#1e439b]/5 rounded-lg hover:bg-[#1e439b]/10 
                                        transition-colors duration-200">
                                        Tìm hiểu thêm
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-12 lg:py-12">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-12 text-center text-[#0b328f]"
            >
              Tin tức và Sự kiện
            </motion.h2>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                },
                hidden: {
                  opacity: 0
                }
              }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {loading ? (
                renderLoadingSkeleton()
              ) : newsEvents.length === 0 ? (
                <motion.div 
                  variants={fadeInUp}
                  className="col-span-4 text-center py-8 text-gray-500"
                >
                  Chưa có tin tức hoặc sự kiện nào
                </motion.div>
              ) : (
                newsEvents.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: 20 }
                    }}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={`absolute bottom-4 left-4 ${getBadgeStyle(item.type)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                        {getTypeText(item.type)}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-[#1e439b] group-hover:text-[#faa21a] transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#faa21a] font-medium">
                          {format(new Date(item.startTime), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        <div className="py-16 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-[#0b328f]">
              Thống kê Thư viện
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
              {[
                {
                  icon: FaChartBar,
                  number: "1,000+",
                  desc: "Lượt truy cập",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: FaBook,
                  number: "1,000+",
                  desc: "Cơ sở dữ liệu sách",
                  color: "from-yellow-500 to-yellow-600"
                },
                {
                  icon: FaFlask,
                  number: "1,000+",
                  desc: "Nghiên cứu khoa học",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: FaScroll,
                  number: "1,000+",
                  desc: "Luận văn và luận án",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: FaPhotoVideo,
                  number: "500+",
                  desc: "Tài liệu đa phương tiện",
                  color: "from-red-500 to-red-600"
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-[#f2a429]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-[#0b328f] group-hover:scale-105 transition-transform duration-300">
                      {stat.number}
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg font-medium">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Thư viện liên kết</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8" >
            {[...Array(6)].map((_, index) => (
              <img key={index} src={LogoThanhDo} alt={`Đối tác ${index + 1}`} className="mx-auto filter grayscale hover:filter-none transition-all duration-300" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#0b328f] to-[#1e439b] text-white">
        <div className="container mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 py-12">
            {/* Column 1 - Thông tin liên hệ */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img src={LogoThanhDo} alt="Logo" className="w-12 h-12 object-contain" />
                <h3 className="text-xl font-bold">Thư viện số Thành Đô</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="w-5 h-5 mt-1 text-[#faa21a]" />
                  <p>Kim Chung, Hoài Đức, Hà Nội, Việt Nam</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-5 h-5 text-[#faa21a]" />
                  <p>research@thanhdo.edu.vn</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="w-5 h-5 text-[#faa21a]" />
                  <p>0936078866</p>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <FaGoogle className="w-5 h-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                  <SiZalo className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2 - Bản đồ */}
            <div className="h-[300px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5109.788412740747!2d105.71876907641048!3d21.062219980595497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134544dba522d4b%3A0x5db1a51aaf3dd805!2zxJDhuqFpIEjhu41jIFRow6BuaCDEkMO0IC0gUXXhu5FjIEzhu5kgMzI!5e1!3m2!1svi!2sus!4v1727497587612!5m2!1svi!2sus"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              />
            </div>

            {/* Column 3 - Thống kê */}
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <FaChartBar className="w-5 h-5 mr-2 text-[#faa21a]" />
                Thống kê truy cập
              </h3>
              {isLoadingStats ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#faa21a]"></div>
                </div>
              ) : statsError ? (
                <div className="text-center text-red-400 py-4">
                  Không thể tải thống kê truy cập
                </div>
              ) : (
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FaUserClock className="w-4 h-4 mr-2 text-[#faa21a]" />
                      Đang truy cập:
                    </span>
                    <span className="font-semibold">
                      {(visitorStats?.activeVisitors || 0).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FaCalendarDay className="w-4 h-4 mr-2 text-[#faa21a]" />
                      Hôm nay:
                    </span>
                    <span className="font-semibold">
                      {(visitorStats?.visitorsToday || 0).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-2 text-[#faa21a]" />
                      Tháng này:
                    </span>
                    <span className="font-semibold">
                      {(visitorStats?.visitorsThisMonth || 0).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FaChartLine className="w-4 h-4 mr-2 text-[#faa21a]" />
                      Năm nay:
                    </span>
                    <span className="font-semibold">
                      {(visitorStats?.visitorsThisYear || 0).toLocaleString()}
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-white/80">
                  &copy; {new Date().getFullYear()} Thư viện Thành Đô. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <Link to="/privacy" className="text-sm text-white/80 hover:text-white">
                    Chính sách bảo mật
                  </Link>
                  <Link to="/terms" className="text-sm text-white/80 hover:text-white">
                    Điều khoản sử dụng
                  </Link>
                  <Link to="/contact" className="text-sm text-white/80 hover:text-white">
                    Liên hệ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}