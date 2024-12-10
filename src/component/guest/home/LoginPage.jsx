import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCookie } from '../../../service/CookieService';
import LogoThanhDo from '../../../asset/image/logo-thanhdo.png';
import { IoArrowBackOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password
            });
            const { accessToken, roles } = response.data;
            setCookie('token', `${accessToken}`);
            if (roles && Array.isArray(roles)) {
                const hasAdminRole = roles.some(role => role.authority === 'ROLE_ADMIN');
                
                if (hasAdminRole) {
                    navigate('/admin', { replace: true });
                    return;
                }
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            
        } catch (error) {
            let errorMessage = 'Đã có lỗi xảy ra khi đăng nhập';
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
                        break;
                    case 403:
                        errorMessage = 'Tài khoản không tồn tại';
                        break;
                    default:
                        errorMessage = error.response.data?.message || errorMessage;
                }
            }
            Swal.fire({
                icon: 'error',
                title: 'Lỗi đăng nhập',
                text: errorMessage,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#1e439b'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e439b] to-[#faa21a] flex flex-col justify-center items-center p-4">
            <div className="absolute top-4 left-4">
            <div className="flex justify-start items-center">
                    <Link
                        to="/"
                        className="bg-orange-400 hover:bg-orange-500 text-white rounded-full p-2 border-2 border-yellow-300 transition duration-300 ease-in-out"
                    >
                        <IoArrowBackOutline  className="text-xl" />
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <img
                            src={LogoThanhDo}
                            alt="Thư viện Thành Đô Logo"
                            className="w-20 h-16 mx-auto"
                        />
                    </Link>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-[#1e439b] mb-6">Đăng nhập</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tài khoản
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Nhập tài khoản của bạn"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e439b] focus:border-[#1e439b]"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e439b] focus:border-[#1e439b]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1e439b] hover:bg-[#15337d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e439b] transition-colors"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}