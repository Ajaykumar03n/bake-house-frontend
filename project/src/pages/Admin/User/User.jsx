import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../../../components/Navbar';
import { useNavigate } from 'react-router-dom';

export const DisplayUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [searchArea, setSearchArea] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [newUser, setNewUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmRemove, setConfirmRemove] = useState(null);
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


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("https://bake-house-backend.onrender.com/api/auth/users");
                const filtered = res.data.filter(user =>
                    user.role != 'admin' && user.role != 'employee'
                );

                setUsers(filtered);
                setFilteredUsers(filtered);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchName.toLowerCase()) &&
            user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
            user.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
            user.area.toLowerCase().includes(searchArea.toLowerCase()) &&
            user.address.toLowerCase().includes(searchAddress.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchName, searchEmail, searchPhone, searchArea, searchAddress, users]);

    const handleRemoveUser = async () => {
        if (confirmRemove) {
            try {
                await axios.delete(`https://bake-house-backend.onrender.com/api/auth/delete-user/${confirmRemove}`);
                const updated = users.filter(user => user._id !== confirmRemove);
                setUsers(updated);
                setFilteredUsers(updated);
                setConfirmRemove(null); // Close the confirmation modal after removing
            } catch (err) {
                console.error("Failed to delete user", err);
            }
        }
    };

    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        try {
            if (newUser._id) {
                await axios.put(`https://bake-house-backend.onrender.com/api/auth/update-user/${newUser._id}`, newUser);
                const updatedUsers = users.map(user =>
                    user._id === newUser._id ? { ...user, ...newUser } : user
                );
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            } else {
                const res = await axios.post("https://bake-house-backend.onrender.com/api/auth/add-user", newUser);
                const newUserFromServer = res.data.user;
                const updatedUsers = [...users, newUserFromServer];
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            }
            setErrorMessage("");
            setNewUser(null);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMessage("Email already in use. Please use a different email.");
            } else if (error.response && error.response.status === 400) {
                setErrorMessage("All fields are required.");
            } else {
                console.error("Error adding/updating user:", error);
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };



    const handleAssignEmployees = async (product) => {
        setIsLoading(true); // Start loading
        try {
            // Fetch employee list from the backend using axios
            const res = await axios.get('https://bake-house-backend.onrender.com/api/employee/get-employee');
            const filteredEmployees = res.data.filter((employee) =>
                employee.type && employee.type.includes(product)
            );
            setEmployees(filteredEmployees); // Update state with employee data from response

        } catch (error) {
            console.error('Error fetching employee list:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };



    const handleEmployeeSelection = (event) => {
        setSelectedEmployee(event.target.value);
    };


    const handleOrderSubmit = async () => {
        try {
            if (!selectedEmployee) {
                setEmployeeError('Please enter a valid employees.');
                return;
            }
            if (!quantity || quantity < 1) {
                setQuantityError('Please enter a valid quantity.');
                return;
            }


            const response = await axios.post("https://bake-house-backend.onrender.com/api/orders/place-order", {
                productName: selectedProduct,
                quantity: quantity,
                employeeId: selectedEmployee,  // now correctly stores _id, not name
                userId: selectedUserId,
                description:description
            });

            console.log("Order success:", response.data);
            setOrderModal(false);
        } catch (error) {
            console.error("Order failed:", error);
        }
    };


    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 mt-24 overflow-x-hidden'>
                <div className='container ml-12 py-12 flex flex-col lg:flex-row'>
                    {/* Sidebar */}
                    <aside className='w-full lg:w-1/4 pr-8 mb-6 lg:mb-0'>
                        <div className='bg-white p-8 shadow-xl rounded-lg'>
                            <h2 className='text-2xl font-extrabold mb-6 text-gray-800'>Search Users</h2>
                            <input type="text" placeholder="Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className='border p-2 mb-4 w-full' />
                            <input type="text" placeholder="Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className='border p-2 mb-4 w-full' />
                            <input type="text" placeholder="Phone" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className='border p-2 mb-4 w-full' />
                            <input type="text" placeholder="Area" value={searchArea} onChange={(e) => setSearchArea(e.target.value)} className='border p-2 mb-4 w-full' />
                            <input type="text" placeholder="Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} className='border p-2 mb-4 w-full' />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className='w-full lg:w-[1000px]'>
                        <div className='flex justify-end px-4 mb-4'>
                            <button
                                onClick={() => {
                                    setNewUser({ name: "", email: "", phone: "", area: "", address: "" });
                                    setErrorMessage("");
                                }}
                                className='bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700'
                            >
                                Add User
                            </button>
                        </div>

                        {/* User Table */}
                        <table className="min-w-full bg-white shadow-lg">
                            <thead>
                                <tr className="border-b text-center">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Phone</th>
                                    <th className="px-4 py-2">Area</th>
                                    <th className="px-4 py-2">Address</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b text-center">
                                            <td className="px-4 py-2">{user.name}</td>
                                            <td className="px-4 py-2">{user.email}</td>
                                            <td className="px-4 py-2">{user.phone}</td>
                                            <td className="px-4 py-2">{user.area}</td>
                                            <td className="px-4 py-2 w-[15px]">{user.address}</td>
                                            <td className="px-4 py-2">
                                                <div>
                                                    <div className='flex mb-2'>
                                                        <button
                                                            onClick={() => {
                                                                setNewUser(user);
                                                                setErrorMessage("");
                                                            }}
                                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 w-full"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmRemove(user._id)} // Trigger confirmation modal
                                                            className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setOrderModal(true);
                                                            setSelectedUserId(user._id); // Set the user ID when placing the order
                                                        }}
                                                        className="bg-blue-500 text-white px-4 py-2 w-full rounded-md"
                                                    >
                                                        Place New Order
                                                    </button>

                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center px-4 py-2">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </main>
                </div>
            </div>

            {/* Confirmation Modal for Remove User */}
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
                                onClick={handleRemoveUser} // Confirm and remove
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

            {/* Modal for Add/Edit User */}
            {newUser !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative'>
                        <button
                            onClick={() => {
                                setNewUser(null);
                                setErrorMessage("");
                            }}
                            className='absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold'
                        >
                            &times;
                        </button>
                        <h3 className='text-xl font-bold mb-4 text-center'>{newUser._id ? "Edit User" : "Add New User"}</h3>

                        {/* Error message display */}
                        {errorMessage && (
                            <p className="text-red-600 font-semibold text-center pb-4">{errorMessage}</p>
                        )}

                        <form onSubmit={handleAddOrUpdateUser} className='grid grid-cols-1 gap-4'>
                            <input type="text" placeholder="Name" value={newUser.name || ""} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className='border border-gray-300 rounded-md p-2' required />
                            <input type="email" placeholder="Email" value={newUser.email || ""} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className='border border-gray-300 rounded-md p-2' required />
                            <input type="tel" placeholder="Phone" value={newUser.phone || ""} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className='border border-gray-300 rounded-md p-2' required />
                            <input type="text" placeholder="Area" value={newUser.area || ""} onChange={(e) => setNewUser({ ...newUser, area: e.target.value })} className='border border-gray-300 rounded-md p-2' />
                            <input type="text" placeholder="Address" value={newUser.address || ""} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} className='border border-gray-300 rounded-md p-2' />
                            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">Save</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal */}
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
                                            <p>Loading items...</p>
                                        ) : (
                                            <div className="mb-4">
                                                <label htmlFor="employeeDropdown" className="block text-md mb-1">Select the item:</label>
                                                <select
                                                    id="employeeDropdown"
                                                    value={selectedEmployee}
                                                    onChange={handleEmployeeSelection}
                                                    className="w-full bg-white border-2 border-gray-300 text-black px-4 py-2 rounded-md"
                                                >
                                                    <option value="">Select an item</option>
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
