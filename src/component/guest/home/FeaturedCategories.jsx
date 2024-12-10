import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaChevronRight,
  FaStar
} from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { searchBooks } from '../../../service/GuestService';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([
    {
      name: "Cơ sở dữ liệu sách",
      icon: "📖",
      subcategoryId: 1,
      books: []
    },
    {
      name: "Nghiên cứu khoa học",
      icon: "🔬",
      subcategoryId: 12,
      books: []
    },
    {
      name: "Luận văn/ luận án",
      icon: "🎓",
      subcategoryId: 8,
      books: []
    },
    {
      name: "Tài liệu đa phương tiện",
      icon: "🎬",
      subcategoryId: 10,
      books: []
    },
  ]);

  useEffect(() => {
    const fetchBooksForCategories = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            const response = await searchBooks({
              subcategoryId: category.subcategoryId,
              size: 3,
              sortBy: 'id',
              sortDirection: 'DESC'
            });
            return {
              ...category,
              books: response.content.map(book => ({
                title: book.title,
                author: book.author,
                rating: book.rating,
                thumbnail: book.thumbnail || 'đường_dẫn_ảnh_mặc_định'
              }))
            };
          })
        );
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooksForCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const categoryVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0b328f] to-[#f2a429] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="container mx-auto px-4 py-2 fixed top-0 left-0 z-50"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-start items-center">
          <Link
            to="/"
            className="bg-orange-400 hover:bg-orange-500 text-white rounded-full p-2 border-2 border-yellow-300 transition duration-300 ease-in-out"
          >
            <IoArrowBackOutline className="text-xl" />
          </Link>
        </div>
      </motion.div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Danh mục Sách Nổi bật</h1>
          <p className="text-xl text-white mb-12 text-center">
            Khám phá bộ sưu tập đa dạng của Thư viện Đại học Thành Đô với các danh mục sách phong phú
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={categoryVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <motion.span
                      className="mr-2 text-3xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {category.icon}
                    </motion.span>
                    {category.name}
                  </h2>
                </motion.div>

                <div className="space-y-4">
                  {category.books.map((book, bookIndex) => (
                    <motion.div
                      key={bookIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: bookIndex * 0.2 }}
                      whileHover={{ x: 10 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 mr-4">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={book.thumbnail}
                          alt={book.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                        <div className="flex items-center mt-1">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <FaStar className="w-5 h-5 text-yellow-400" />
                          </motion.div>
                          <span className="ml-1 text-gray-600">
                            {book.rating ? book.rating.toFixed(1) : '5.0'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="bg-gray-50 px-6 py-4 mt-auto"
                whileHover={{ backgroundColor: "#f3f4f6" }}
              >
                <Link
                  to="/reader"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center"
                  >
                    Khám phá thêm sách {category.name}
                    <FaChevronRight className="w-5 h-5 ml-1" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Khám phá Thêm</h2>
          <p className="text-xl text-white mb-8">
            Thư viện Đại học Thành Đô có nhiều danh mục sách khác đang chờ bạn khám phá
          </p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              to="/reader"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Xem Tất cả Danh mục
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
