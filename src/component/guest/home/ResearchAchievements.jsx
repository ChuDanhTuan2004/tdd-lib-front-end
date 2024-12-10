"use client"

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { IoArrowBackOutline } from "react-icons/io5";
import { GiChemicalDrop, GiMicroscope } from 'react-icons/gi'
import { IoMdPeople } from 'react-icons/io'
import { ImBooks } from 'react-icons/im'
import { AiOutlineTrophy } from 'react-icons/ai'
import { motion } from 'framer-motion';

export default function ResearchAchievements() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const researchCategories = [
        {
            icon: <GiChemicalDrop className="w-8 h-8" />,
            title: "Khoa học Tự nhiên",
            description: "Các nghiên cứu đột phá trong lĩnh vực vật lý, hóa học và sinh học.",
            achievements: [
                "Phát hiện mới về cấu trúc phân tử của vật liệu nano",
                "Nghiên cứu về ứng dụng của trí tuệ nhân tạo trong dự đoán biến đổi khí hậu",
            ],
            image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
            icon: <IoMdPeople className="w-8 h-8" />,
            title: "Khoa học Xã hội",
            description: "Nghiên cứu về các vấn đề xã hội và nhân văn.",
            achievements: [
                "Đánh giá tác động của mạng xã hội đối với hành vi của giới trẻ Việt Nam",
                "Nghiên cứu về bảo tồn và phát huy giá trị văn hóa truyền thống",
            ],
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        },
        {
            icon: <GiMicroscope className="w-8 h-8" />,
            title: "Y học và Sức khỏe",
            description: "Các tiến bộ trong nghiên cứu y học và chăm sóc sức khỏe.",
            achievements: [
                "Phát triển phương pháp điều trị mới cho bệnh ung thư gan",
                "Nghiên cứu về ảnh hưởng của chế độ ăn đến sức khỏe tim mạch",
            ],
            image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        },
        {
            icon: <ImBooks className="w-8 h-8" />,
            title: "Giáo dục",
            description: "Nghiên cứu về phương pháp giảng dạy và học tập hiệu quả.",
            achievements: [
                "Phát triển mô hình giáo dục kết hợp trực tuyến và truyền thống",
                "Nghiên cứu về tác động của học tập dựa trên dự án đối với kết quả học tập",
            ],
            image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % researchCategories.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % researchCategories.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + researchCategories.length) % researchCategories.length)
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-r from-[#0b328f] to-[#f2a429] py-12 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="container mx-auto px-4 py-2 fixed top-0 left-0 z-50">
                <div className="flex justify-start items-center">
                    <Link
                        to="/"
                        className="bg-orange-400 hover:bg-orange-500 text-white rounded-full p-2 border-2 border-yellow-300 transition duration-300 ease-in-out"
                    >
                        <IoArrowBackOutline className="text-xl" />
                    </Link>
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Thành Tựu Nghiên Cứu Khoa Học</h1>
                    <p className="text-xl text-white">
                        Trường Đại học Thành Đô tự hào giới thiệu những thành tựu nghiên cứu khoa học nổi bật,
                        đóng góp vào sự phát triển của khoa học và xã hội.
                    </p>
                </motion.div>

                <div className="mb-12 relative">
                    <div className="overflow-hidden rounded-lg h-64 md:h-96">
                        {researchCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img
                                    src={category.image}
                                    alt={`Hình ảnh minh họa cho ${category.title}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                                    <h3 className="text-2xl font-bold">{category.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-20"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <FaChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-20"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <FaChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {researchCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-blue-100 rounded-full p-3">
                                        {category.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">{category.title}</h3>
                                <p className="text-gray-600 text-center mb-4">{category.description}</p>
                                <ul className="list-disc list-inside space-y-2">
                                    {category.achievements.map((achievement, achievementIndex) => (
                                        <li key={achievementIndex} className="text-gray-700">
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-16"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white rounded-full p-2 mr-3">
                                <AiOutlineTrophy className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold">Giải thưởng và Công nhận</h3>
                        </div>
                        <p className="text-lg text-center">
                            Các nghiên cứu của Đại học Thành Đô đã được công nhận rộng rãi trong cộng đồng học thuật
                            và đã nhận được nhiều giải thưởng quốc gia và quốc tế.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
