import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmployeeNavbar } from '../../components/EmployeeNavbar';
const orderStages = ['Order Placed', 'Employee Assigned', 'Employee Arrived', 'Pending', 'Completed'];

export const EmployeeOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('ongoing');

    const [employeeFilter, setEmployeeFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(null);


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        if (!userId) {
            alert('User ID not found in localStorage');
            return;
        }

        
        fetch(`https://bake-house-backend.onrender.com/api/orders/get-orders-by-employee/${userId}/${email}`)
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
                setLoading(false);
            });
    }, []);

    const updateOrderStage = async (orderId, currentStatus) => {
        const currentIndex = orderStages.indexOf(currentStatus);
        if (currentIndex >= orderStages.length - 1) return; // Already at final stage

        const nextStage = orderStages[currentIndex + 1];

        try {
            const res = await fetch(`https://bake-house-backend.onrender.com/api/orders/update-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStage }),
            });

            if (res.ok) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === orderId ? { ...order, status: nextStage } : order
                    )
                );
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error updating status.');
        }
    };

    const completedOrders = orders.filter(order => order.status === 'Completed');
    const ongoingOrders = orders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled');
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled');

    const filteredOrders = (
        selectedTab === 'completed' ? completedOrders :
            selectedTab === 'cancelled' ? cancelledOrders :
                ongoingOrders
    ).filter(order => {
        const matchesEmployee = employeeFilter ? order.employee?.name?.toLowerCase().includes(employeeFilter.toLowerCase()) : true;
        const matchesUser = userFilter ? order.user?.name?.toLowerCase().includes(userFilter.toLowerCase()) : true;
        const matchesLocation = locationFilter ? order.user?.area?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
        const matchesProduct = productFilter ? order.productName?.toLowerCase() === productFilter.toLowerCase() : true;
        const matchesStage = selectedTab === 'ongoing' && stageFilter ? order.status === stageFilter : true;
        return matchesEmployee && matchesUser && matchesLocation && matchesProduct && matchesStage;
    });

    const handleCancelOrder = async () => {
        if (confirmRemove) {
            try {
                const response = await fetch(`https://bake-house-backend.onrender.com/api/orders/request-cancel/${confirmRemove}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    setOrders(prev =>
                        prev.map(o =>
                            o._id === confirmRemove ? { ...o, cancelRequested: true } : o
                        )
                    );
                    setConfirmRemove(null); // Close the confirmation modal after removing

                } else {
                    alert('Failed to request cancellation.');
                }
            } catch (err) {
                console.error(err);
                alert('Error requesting cancellation.');
            }

        }
    };


    if (loading) return <p className="text-center mt-4">Loading orders...</p>;

    return (
        <>
            <EmployeeNavbar />
            <div className="mx-auto max-w-7xl px-6 mt-32 mb-16">
                <h2 className="text-4xl font-bold text-center mb-10 pt-8">Order Management</h2>

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-200 rounded-xl p-1 w-[35%] flex justify-center">
                        {['ongoing', 'completed', 'cancelled'].map(tab => {
                            const label = tab === 'ongoing' ? 'Ongoing / Pending' : tab === 'completed' ? 'Completed' : 'Cancelled';
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${selectedTab === tab
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-10 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Filter by Employee"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={employeeFilter}
                        onChange={(e) => setEmployeeFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by User"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Location"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                    <select
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                    >
                        <option value="">All Products</option>
                        <option value="Biometric">Biometric</option>
                        <option value="CCTV">CCTV</option>
                        <option value="Sensors">Sensors</option>
                    </select>
                    {selectedTab === 'ongoing' && (
                        <select
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                        >
                            <option value="">All Stages</option>
                            {orderStages.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Order List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTab + employeeFilter + userFilter + locationFilter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {filteredOrders.length === 0 ? (
                            <p className="text-center text-gray-500">No matching orders found.</p>
                        ) : (
                            filteredOrders.map((order) => {
                                const currentStageIndex = orderStages.indexOf(order.status);
                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6"
                                    >
                                        {/* Left Section */}
                                        <div className="md:w-1/3 space-y-2 text-sm capitalize">

                                            <p className="text-lg"><strong>Product:</strong> <span className="font-bold text-green-800">{order.productName}</span></p>
                                            <p className="text-lg"><strong>User Name:</strong> {order.user?.name || 'N/A'}</p>
                                            <p className="text-lg"><strong>Employee:</strong> {order.employee?.name || 'N/A'}</p>
                                            <p className="text-lg"><strong>Location:</strong> {order.user?.area || 'N/A'}</p>
                                            <p className="text-lg mb-2"><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>

                                            {order.status !== 'Completed' && (
                                                <div className=" mt-6">
                                                    <button
                                                        onClick={() => updateOrderStage(order._id, order.status)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                                                    >
                                                        Move to Next Stage
                                                    </button>
                                                </div>
                                            )}

                                            {order.cancelRequested && (
                                                <p className="text-yellow-600 text-lg font-semibold mt-2">Cancellation requested</p>
                                            )}
                                        </div>

                                        {/* Right Section */}
                                        {order.status === 'Cancelled' ? (
                                            <p className="mt-2 text-red-500 font-bold text-2xl text-right py-4">Order Cancelled</p>
                                        ) : (
                                            <div className="md:w-2/3">
                                                {order.status === 'Order Placed' && (
                                                    <p className="text-blue-800 font-bold text-2xl mb-4 mx-4 animate-blink">
                                                        Wait for Owner to Assign Employee
                                                    </p>
                                                )}


                                                <h4 className="font-bold text-2xl ml-4 mb-20 mx-4">Order Status</h4>

                                                <div className="relative flex items-center justify-between">
                                                    <div className="absolute top-4 left-4 right-4 h-1 bg-gray-300 z-0 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 transition-all"
                                                            style={{
                                                                width: `${(currentStageIndex / (orderStages.length - 1)) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                    {orderStages.map((stage, index) => (
                                                        <div key={stage} className="relative z-9 flex flex-col items-center flex-1">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${index <= currentStageIndex ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                                {index + 1}
                                                            </div>
                                                            <span className="text-xs mt-1 text-center">{stage}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                );
                            })
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            {confirmRemove && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative'>
                        <button
                            onClick={() => setConfirmRemove(null)} // Close modal without action
                            className='absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold'
                        >
                            &times;
                        </button>
                        <h3 className='text-xl font-bold mb-4 text-center'>Are you sure you want to remove this user?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelOrder} // Confirm and remove
                                className="bg-red-600 text-white px-6 py-2 rounded-md"
                            >
                                Yes, Remove
                            </button>
                            <button
                                onClick={() => setConfirmRemove(null)} // Cancel and close modal
                                className="bg-gray-600 text-white px-6 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
