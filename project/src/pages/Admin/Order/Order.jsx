import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../../../components/Navbar';

const orderStages = ['Order Placed', 'Employee Assigned', 'Preparing', 'Out For Delivery', 'Completed'];

export const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('ongoing');
    const [cancelRequestFilter, setCancelRequestFilter] = useState(false);


    const [employeeFilter, setEmployeeFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [stageFilter, setStageFilter] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState(null);

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [searchArea, setSearchArea] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [newUser, setNewUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [orderModal, setOrderModal] = useState(false);  // New state for order modal
    const [selectedProduct, setSelectedProduct] = useState("");  // State to store selected product
    const [employees, setEmployees] = useState([]); // State to store employee list
    const [isLoading, setIsLoading] = useState(false); // State for loading state
    const [selectedEmployee, setSelectedEmployee] = useState(""); // State to store selected employee
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState('');
    const [employeeError, setEmployeeError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');




    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setCancelRequestFilter(checked);
        onFilterChange({ cancelRequestFilter: checked });
    };


    const assignEmployeeToOrder = async (employeeId) => {
        try {
            const res = await fetch(`https://bake-house-backend.onrender.com/api/orders/assign/${selectedOrderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId })
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                fetch('https://bake-house-backend.onrender.com/api/orders/get-orders')
                    .then((res) => res.json())
                    .then((data) => {
                        setOrders(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error('Error fetching orders:', err);
                        setLoading(false);
                    });

                alert('Employee assigned successfully.');
                setIsModalOpen(false);
            } else {
                alert('Failed to assign employee.');
            }
        } catch (err) {
            console.error(err);
            alert('Error assigning employee.');
        }
    };

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

    useEffect(() => {
        fetch('https://bake-house-backend.onrender.com/api/orders/get-orders')
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

    const completedOrders = orders.filter(order => order.status === 'Completed');
    const ongoingOrders = orders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled');
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled');



    const filteredOrders = (
        selectedTab === 'completed' ? completedOrders :
            selectedTab === 'cancelled' ? cancelledOrders :
                ongoingOrders
    ).filter(order => {
        const matchesUser = userFilter ? order.user?.name?.toLowerCase().includes(userFilter.toLowerCase()) : true;
        const matchesLocation = locationFilter ? order.user?.area?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
        const matchesProduct = productFilter ? order.productName?.toLowerCase() === productFilter.toLowerCase() : true;
        const matchesStage = selectedTab === 'ongoing' && stageFilter ? order.status === stageFilter : true;
        const isCancelRequested = cancelRequestFilter
            ? order.cancelRequest === true
            : true;
        return matchesUser && matchesLocation && matchesProduct && matchesStage && isCancelRequested;
    });

    const handleCancelOrder = async () => {
        if (confirmRemove) {
            try {
                const response = await fetch(`https://bake-house-backend.onrender.com/api/orders/cancel/${confirmRemove}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    setOrders(prev => prev.map(o => o._id === confirmRemove ? { ...o, status: 'Cancelled' } : o));
                    setConfirmRemove(null); // Close the confirmation modal after removing

                } else {
                    alert('Failed to cancel order.');
                }
            } catch (err) {
                console.error(err);
                alert('Error cancelling order.');
            }
        }
    };

    const handleAssignEmployee = async (orderId) => {
        setSelectedOrderId(orderId);
        try {
            const res = await fetch("https://bake-house-backend.onrender.com/api/employee/get-employee");
            const data = await res.json();
            setEmployeeList(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
            alert('Error fetching employees.');
        }
    };


    if (loading) return <p className="text-center mt-4">Loading orders...</p>;

    return (
        <>
            <Navbar />

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
                <div className="bg-white rounded-xl shadow-lg p-6 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                    <input
                        type="text"
                        placeholder="Filter by User"
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Location"
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                    >
                        <option value="">All Products</option>
                        <option value="Cake">Cake</option>
                        <option value="MilkShake">MilkShake</option>
                        <option value="Icecream">Icecream</option>
                    </select>
                    {selectedTab === 'ongoing' && (
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                        >
                            <option value="">All Stages</option>
                            {orderStages.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                    )}
                    {selectedTab === 'ongoing' && (

                        <label className="flex items-center space-x-3 text-gray-800 text-sm">
                            <input
                                type="checkbox"
                                checked={cancelRequestFilter}
                                onChange={handleCheckboxChange}
                                className="form-checkbox border rounded-lg transform scale-150 focus:outline-none transition duration-300"
                            />
                            <span className="text-base">Cancel Requests</span>
                        </label>
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
                                            <p className="text-lg"><strong>User Phone:</strong> {order.user?.phone || 'N/A'}</p>
                                            <p className="text-lg"><strong>Location:</strong> {order.user?.area || 'N/A'}</p>
                                            <p className="text-lg mb-2"><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
                                            <p className="text-lg"><strong>Description:</strong> {order.description || 'N/A'}</p>

                                            <div className='flex'>
                                                {order.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => updateOrderStage(order._id, order.status)}
                                                        className="p-4 bg-blue-600 mr-4 font-bold text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Next Stage
                                                    </button>
                                                )}

                                                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => setConfirmRemove(order._id)} // Trigger confirmation modal
                                                        className="p-4 bg-red-600 font-bold text-white rounded-lg hover:bg-red-700"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>

                                        </div>

                                        {/* Right Section */}
                                        {order.status === 'Cancelled' ? (
                                            <p className="mt-2 text-red-500 font-bold text-2xl text-right py-4">Order Cancelled</p>
                                        ) : (
                                            <div className="md:w-2/3">
                                                {order.cancelRequest && (
                                                    <p className="text-red-600 font-bold text-2xl mb-4 mx-4 animate-blink">
                                                        Cancellation requested
                                                    </p>
                                                )}
                                                <h4 className="font-bold text-2xl ml-4 mb-16">Order Status</h4>
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
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Assign Employee</h3>
                        <ul className="max-h-60 overflow-y-auto space-y-2">
                            {employeeList.map(emp => (
                                <li
                                    key={emp._id}
                                    className="flex justify-between items-center border p-2 rounded hover:bg-gray-100"
                                >
                                    <span>{emp.name}</span>
                                    <button
                                        onClick={() => assignEmployeeToOrder(emp._id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Assign
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

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

            {orderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white py-10 px-6 rounded-lg shadow-lg w-[90%] max-w-4xl relative">
                        <button
                            onClick={() => {
                                setOrderModal(false);
                                setSelectedProduct("");
                                setQuantity(1);
                                setSelectedEmployee("");
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-center">Select Product for New Order</h3>

                        <div className="flex gap-10">
                            {/* Left Column: Product Buttons */}
                            <div className="flex flex-col gap-4 w-1/2 items-center">
                                <button
                                    onClick={() => {
                                        setSelectedProduct("Cake");
                                        handleAssignEmployees("Cake");
                                    }}
                                    className="bg-blue-600 text-white w-full px-6 py-3 rounded-md"
                                >
                                    CAKE
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedProduct("MilkShake");
                                        handleAssignEmployees("MilkShake");
                                    }}
                                    className="bg-blue-600 text-white w-full px-6 py-3 rounded-md"
                                >
                                    MILKSHAKE
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedProduct("Icecream");
                                        handleAssignEmployees("Icecream");
                                    }}
                                    className="bg-blue-600 text-white w-full px-6 py-3 rounded-md"
                                >
                                    ICECREAM
                                </button>
                            </div>

                            {/* Right Column: Quantity + Employee + Submit */}
                            <div className="w-1/2">
                                {selectedProduct && (
                                    <>
                                        <p className="text-lg font-semibold mb-4">
                                            You have selected: <span className="text-blue-600">{selectedProduct}</span>
                                        </p>

                                        {/* Employee List Dropdown */}
                                        {isLoading ? (
                                            <p>Loading employees...</p>
                                        ) : (
                                            <div className="mb-4">
                                                <label htmlFor="employeeDropdown" className="block text-md mb-1">Assign Employee:</label>
                                                <select
                                                    id="employeeDropdown"
                                                    value={selectedEmployee}
                                                    onChange={handleEmployeeSelection}
                                                    className="w-full bg-white border-2 border-gray-300 text-black px-4 py-2 rounded-md"
                                                >
                                                    <option value="">Select an employee</option>
                                                    {employees.map((employee) => (
                                                        <option key={employee._id} value={employee._id}>
                                                            {employee.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {employeeError && <p className="text-red-600 mt-2">{employeeError}</p>}
                                            </div>
                                        )}

                                        {/* Quantity Input */}
                                        <div className="mb-4">
                                            <label htmlFor="quantityInput" className="block text-md mb-1">Enter Quantity:</label>
                                            <input
                                                id="quantityInput"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                className="w-full border-2 border-gray-300 px-4 py-2 rounded-md text-black"
                                                min="1"
                                                required
                                            />
                                            {quantityError && <p className="text-red-600 mt-2">{quantityError}</p>}

                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="descriptionTextarea" className="block text-md mb-1">Description:</label>
                                            <textarea
                                                id="descriptionTextarea"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full border-2 border-gray-300 px-4 py-2 rounded-md text-black h-28 resize-none"
                                                placeholder="Enter description (optional)"
                                            ></textarea>
                                            {descriptionError && <p className="text-red-600 mt-2">{descriptionError}</p>}
                                        </div>



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
