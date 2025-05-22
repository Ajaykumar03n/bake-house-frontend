import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserNavbar } from '../../components/UserNavBar';
import biometric from '../../assets/biometric.jpg';
import cctv from '../../assets/cctv.jpeg';
import { useNavigate } from 'react-router-dom';
import sensor from '../../assets/sensor.jpg';



export const UserProduct = () => {
    const [orderModal, setOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const navigate = useNavigate();

    const handleOrderSubmit = async () => {

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token) {
            navigate("/login");
            return;
        }
        if (!quantity || quantity < 1) {
            setQuantityError('Please enter a valid quantity.');
            return;
        }

        try {
            const response = await axios.post("https://bake-house-backend.onrender.com/api/orders/user-place-order", {
                productName: selectedProduct,
                quantity: quantity,
                userId: userId
            });

            console.log("Order success:", response.data);
            setConfirmation('Order Placed Successfully');
            setTimeout(() => {
                setOrderModal(false);
                setSelectedProduct("");
                setQuantity(1);
                setQuantityError('');
                setConfirmation('');
            }, 2000);
        } catch (error) {
            console.error("Order failed:", error);
        }
    };

    return (
        <>
            <UserNavbar />
            <div className='min-h-screen bg-gray-50 mt-28 overflow-x-hidden'>
                <div className='flex justify-end  px-4'>
                    <button
                        onClick={() => {
                            setOrderModal(true);
                            setSelectedUserId(user._id);
                        }}
                        className='bg-green-600 text-white p-6 mt-8 font-bold rounded-md shadow-md hover:bg-green-700'
                    >
                        Place New Order
                    </button>
                </div>

                <div className='container py-12 flex flex-col justify-center items-center lg:flex-row'>
                    <main className='w-full lg:w-[1500px]'>
                        <div className='flex justify-center items-center gap-8 mx-auto'>
                            {[{ img: biometric, title: 'Biometric Identity Solutions' },
                            { img: cctv, title: 'CCTV Surveillance' },
                            { img: sensor, title: 'Smart Sensor Networks' }]
                                .map(({ img, title }, i) => (
                                    <div
                                        key={i}
                                        className='relative cursor-pointer group rounded-2xl overflow-hidden flex items-center shadow-2xl transform transition-all duration-500 ease-in-out hover:-translate-y-2 h-[450px]'
                                    >
                                        <div className='absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-80 transition-all duration-[1200ms] ease-in-out translate-y-full group-hover:translate-y-0 z-10'></div>
                                        <div className='relative z-20 flex flex-col justify-center items-center h-[450px] p-8 text-center'>
                                            <img
                                                src={img}
                                                alt={title}
                                                className='w-full h-60 object-cover rounded-xl transition duration-300 group-hover:opacity-0'
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
                    </main>
                </div>
            </div>
            {orderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white py-10 px-6 rounded-lg shadow-lg w-[90%] max-w-4xl relative">
                        <button
                            onClick={() => {
                                setOrderModal(false);
                                setSelectedProduct("");
                                setQuantity(1);
                                setQuantityError('');
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-center">Select Product for New Order</h3>

                        <div className="flex gap-10">
                            <div className="flex flex-col gap-4 w-1/2 items-center">
                                {["CCTV", "BIOMETRIC", "SENSORS"].map((product, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            handleAssignEmployees(product);
                                        }}
                                        className="bg-blue-600 text-white w-full px-6 py-3 rounded-md"
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>

                            <div className="w-1/2">

                                {selectedProduct && (
                                    <>
                                        {confirmation && (
                                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
                                                <strong className="font-bold">Success:</strong> {confirmation}
                                            </div>
                                        )}
                                        <p className="text-lg font-semibold mb-4">
                                            You have selected: <span className="text-blue-600">{selectedProduct}</span>
                                        </p>

                                        <div className="mb-4">
                                            <label htmlFor="quantityInput" className="block text-md mb-1">Enter Quantity:</label>
                                            <input
                                                id="quantityInput"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setQuantity(val);
                                                    if (val >= 1) setQuantityError('');
                                                }}
                                                className={`w-full px-4 py-2 rounded-md text-black border-2 ${quantityError ? 'border-red-600' : 'border-green-600'} focus:outline-none focus:border-green-600`}
                                                min="1"
                                                required
                                            />
                                            {quantityError && <p className="text-red-600 mt-2">{quantityError}</p>}
                                        </div>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch("https://bake-house-backend.onrender.com/api/orders/payment/request", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            orderId: order._id,
                                                            status: "payment acceptance request"
                                                        })
                                                    });

                                                    if (!response.ok) {
                                                        throw new Error("Failed to update payment request status.");
                                                    }

                                                    window.open("https://razorpay.me/@communication3244", "_blank");
                                                    window.location.reload();
                                                    handleOrderSubmit();


                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Unable to request payment update. Please try again.");
                                                }
                                            }}
                                            className="bg-green-600 mr-4 text-white px-6 py-2 rounded-md mt-2 inline-block"
                                        >
                                            Pay
                                        </button>


                                        <button
                                            onClick={handleOrderSubmit}
                                            className="bg-green-600 text-white px-6 py-2 rounded-md mt-2"
                                        >
                                            Confirm Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
