import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('token');
        setUserId(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setUserId(null);
        navigate('/');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-user')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
            <div className="flex items-center justify-between md:justify-around p-4">
                <div className="text-2xl font-bold text-green-600 cursor-pointer md:w-auto w-full">
                    <span>BAKE</span><span className="text-black"> HOUSE</span>
                </div>

                <ul
                    className="hidden md:flex font-light items-center gap-8"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    <li><Link to="/adminhome" className="py-7 px-3 inline-block">Home</Link></li>
                    <li><Link to="/employees" className="py-7 px-3 inline-block">Product</Link></li>
                    <li><Link to="/users" className="py-7 px-3 inline-block">Users</Link></li>
                    <li><Link to="/orders" className="py-7 px-3 inline-block">Orders</Link></li>

                    {userId ? (
                        <li className="relative dropdown-user">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center text-green-600 hover:text-black gap-1 focus:outline-none"
                            >
                                <FaUserCircle size={20} />
                                <span>Profile</span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="px-4 py-4 font-bold bg-green-500 text-white rounded hover:bg-green-600">
                                    Login/Register
                                </Link>
                            </li>
                            
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};
