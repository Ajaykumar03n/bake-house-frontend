import { animate, motion } from 'framer-motion';
import biometric from '../../assets/biometric.jpg';
import cctv from '../../assets/CCTV.jpg';
import sensor from '../../assets/SENSOR.jpg';
import security from '../../assets/security.jpg';
import { useNavigate } from 'react-router-dom';
import { EmployeeNavbar } from '../../components/EmployeeNavbar';

const welcomeText = "Welcome!!";

export const Homeemployee = () => {
    const navigate = useNavigate();

    return (
        <>
            <EmployeeNavbar />
            <div className='h-screen bg-black bg-opacity-60 bg-blend-overlay bg-[url("/background1.jpg")] bg-no-repeat bg-cover bg-center'>

                <div className='z-10 flex flex-col justify-center h-full gap-8 p-12 pt-24'>
                    <div className='text-4xl font-bold text-green-400 flex gap-1 mt-16'>
                        {welcomeText.split("").map((char, index) => (
                            <motion.span
                                //key={index}
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                    ease: "easeInOut",
                                    delay: index * 0.1,
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>

                    <p className='text-6xl text-white font-medium leading-relaxed'>
                        Explore Our <br />
                        <span className='text-green-500'>Services For Security</span> <br />
                        System
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4'>
                        <button
                            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            className='font-medium text-white p-4 rounded-full hover:bg-green-400 hover:text-black transition duration-300 border-4 border-b-green-400 border-l-green-400'>
                            Contact Us
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className='font-medium text-white p-4 rounded-full hover:bg-green-400 hover:text-black transition duration-300 border-4 border-t-green-400 border-r-green-400'>
                            Open Your Account
                        </button>
                    </div>
                </div>
            </div>

            <div className='bg-white py-24 px-8'>
                <h1 className='text-center text-4xl font-semibold mb-16'>
                    Feel the Best Experience <br /> with Our Features
                </h1>
                <div className='bg-white rounded-2xl shadow-2xl  max-w-6xl mx-auto mb-12 p-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
                        {/* Left: Intro & CTAs */}
                        <div>
                            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                                Ready to Elevate Your Security?
                            </h2>
                            <p className='text-gray-600 mb-12 text-lg mt-8'>
                                Join thousands of businesses who trust our cutting‑edge biometric, CCTV, and sensor solutions
                                for 24/7 peace of mind. Let’s build your custom security ecosystem together.
                            </p>
                            <div className='flex flex-wrap gap-4'>
                                <button
                                    onClick={() => navigate("/login")}
                                    className='px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition'>
                                    Get Started
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className='px-6 py-3 border border-green-500 text-green-500 rounded-full hover:bg-green-100 transition'>
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Right: Key Benefits */}
                        <div>
                            <img src={security} />
                        </div>
                    </div>
                </div>

                <div className='flex gap-8 max-w-6xl mx-auto'>
                    {[
                        { img: biometric, title: 'Biometric Identity Solutions' },
                        { img: cctv, title: 'CCTV Surveillance' },
                        { img: sensor, title: 'Smart Sensor Networks' }
                    ].map(({ img, title }, i) => (
                        <div
                            key={i}
                            className='relative cursor-pointer group rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 ease-in-out hover:-translate-y-2 h-96'
                        >
                            {/* Black Overlay */}
                            <div className='absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-80 transition-all duration-[1200ms] ease-in-out translate-y-full group-hover:translate-y-0 z-10'></div>

                            {/* Content */}
                            <div className='relative z-20 flex flex-col justify-center items-center h-full p-8 text-center'>
                                <img
                                    src={img}
                                    alt={title}
                                    className='w-full h-60 object-cover rounded-xl mb-6 transition duration-300 group-hover:opacity-0'
                                />
                                <div className='absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <h2 className='text-2xl font-bold mb-4 text-white'>
                                        {title}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-center mt-12 pb-24'>
                <div className='flex justify-center items-center'>
                    <div className="cursor-pointer relative group rounded-2xl bg-white shadow-xl h-full flex p-24 items-center overflow-hidden">
                        <div className="absolute inset-0 text-white bg-green-600 opacity-0 group-hover:opacity-80 transition-all duration-[1200ms] ease-in-out translate-y-full group-hover:translate-y-0"></div>

                        <div className='relative text-center'>
                            <h2 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-white transition duration-300'>Find Me</h2>
                            <p className='text-lg font-semibold text-gray-800 group-hover:text-white transition duration-300'>
                                Email: <a href='mailto:gvcommsec@yahoo.co.in' className='hover:underline'>gvcommsec@yahoo.co.in</a>
                            </p>
                            <p className='text-lg font-semibold text-gray-800 group-hover:text-white transition duration-300'>
                                Phone: <a href='tel:+919843336990' className='hover:underline'>9843336990</a>
                            </p>
                        </div>
                    </div>

                </div>

                <div>
                    <form className='max-w-4xl mx-12 p-8 rounded-2xl shadow-lg space-y-6 bg-white'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Your Name'
                                    className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                />
                            </div>
                            <div>
                                <input
                                    type='email'
                                    placeholder='Your Email'
                                    className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                />
                            </div>
                        </div>
                        <div>
                            <textarea
                                rows='8'
                                placeholder='Write your message here...'
                                className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                            ></textarea>
                        </div>
                        <div className='text-center'>
                            <button
                                type='submit'
                                className='px-8 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition'
                            >
                                Send
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            <footer className='bg-gray-900 text-white pt-16 pb-12'>
                <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12'>

                    {/* About Section */}
                    <div>
                        <h2 className='text-xl font-bold mb-4 text-green-500'>About Us</h2>
                        <p className='text-gray-400'>
                            We specialize in modern security solutions including biometric, CCTV, and sensor-based systems for homes and businesses.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className='text-xl font-bold mb-4 text-green-500'>Quick Links</h2>
                        <ul className='space-y-2'>
                            <li><a href='/adminhome' className='hover:text-green-400 transition'>Home</a></li>
                            <li><a href='/employees' className='hover:text-green-400 transition'>Employees</a></li>
                            <li><a href='/cctv' className='hover:text-green-400 transition'>Product</a></li>
                            <li><a href='/product' className='hover:text-green-400 transition'>Users</a></li>
                            <li><a href='/orders' className='hover:text-green-400 transition'>Orders</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className='text-xl font-bold mb-4 text-green-500'>Contact</h2>
                        <p className='text-gray-400'>Email: <a href='mailto:gvcommsec@yahoo.co.in' className='text-green-400 hover:underline'>thebakehousebysuhitrakumaran@gmai.com</a></p>
                        <p className='text-gray-400'>Phone: <a href='tel:+919843336990' className='text-green-400 hover:underline'>+91 98423 22161</a></p>
                        <p className='text-gray-400'>Location: <span className='text-green-400'>Tamil Nadu, India</span></p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h2 className='text-xl font-bold mb-4 text-green-500'>Our Location</h2>
                        <iframe
                            title='Map Location'
                            src="https://www.bing.com/maps?q=vanjipalayam+mangalam+road+tripur&FORM=HDRSC7&cp=11.102394%7E77.26826&lvl=15.3"
                            width='100%'
                            height='200'
                            style={{ border: 0 }}
                            allowFullScreen=''
                            loading='lazy'
                            referrerPolicy='no-referrer-when-downgrade'
                            className='rounded-xl'
                        ></iframe>
                    </div>
                </div>

                <div className='border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm'>
                    &copy; {new Date().getFullYear()} BAKE HOUSE. All rights reserved.
                </div>
            </footer>

        </>
    );
};
