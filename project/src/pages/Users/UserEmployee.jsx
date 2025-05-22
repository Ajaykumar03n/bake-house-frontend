import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserNavbar } from '../../components/UserNavBar';
export const DisplayEmployeesUsers = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [image, setImage] = useState(null);

    const [searchName, setSearchName] = useState("");
    const [searchQuantity, setSearchQuantity] = useState("");
    const [searchType, setSearchType] = useState("");
    const [orderModal, setOrderModal] = useState(false);  // New state for order modal
    const [selectedProduct, setSelectedProduct] = useState("");  // State to store selected product
    const [isLoading, setIsLoading] = useState(false); // State for loading state
    const [selectedEmployee, setSelectedEmployee] = useState(""); // State to store selected employee
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState('');
    const [employeeError, setEmployeeError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [searchCost, setSearchCost] = useState("");

    const [confirmRemove, setConfirmRemove] = useState("");

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        type: "",
        quantity: "",
        cost: "",
    });

    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append("image", image);

        try {
            const res = await fetch("https://bake-house-backend.onrender.com/api/upload/image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Image upload failed");

            const data = await res.json();
            return data.imageUrl;
        } catch (err) {
            console.error("Image upload error:", err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get("https://bake-house-backend.onrender.com/api/employee/get-employee");
                const employeeData = res.data;

                const employeesWithSignedUrls = await Promise.all(
                    employeeData.map(async (emp) => {
                        try {
                            const signRes = await fetch(
                                `https://bake-house-backend.onrender.com/api/s3/sign-image-url?url=${encodeURIComponent(emp.imageUrl)}`,
                                {
                                    credentials: 'include',
                                }
                            );
                            const signData = await signRes.json();
                            return {
                                ...emp,
                                signedImageUrl: signData.signedUrl,
                            };
                        } catch (err) {
                            console.error('Error signing image URL for', emp.name, err);
                            return { ...emp, signedImageUrl: '' };
                        }
                    })
                );

                setEmployees(employeesWithSignedUrls);
                setFilteredEmployees(employeesWithSignedUrls);
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const results = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
            emp.type.toLowerCase().includes(searchType.toLowerCase()) &&
            (searchQuantity === "" || emp.quantity >= Number(searchQuantity)) &&
            (searchCost === "" || emp.cost <= Number(searchCost))
        );
        setFilteredEmployees(results);
    }, [searchName, searchType, searchQuantity, searchCost, employees]);







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
        const results = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
            emp.type.toLowerCase().includes(searchType.toLowerCase()) &&
            (searchQuantity === "" || emp.quantity >= Number(searchQuantity)) &&
            (searchCost === "" || emp.cost <= Number(searchCost))
        );
        setFilteredEmployees(results);
    }, [searchName, searchType, searchQuantity, searchCost, employees]);


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

            const user = localStorage.getItem("userId");
            const response = await axios.post("https://bake-house-backend.onrender.com/api/orders//user-place-order", {
                productName: selectedProduct,
                quantity: quantity,
                employeeId: selectedEmployee,  // now correctly stores _id, not name
                userId: user,
                description: description
            });

            console.log("Order success:", response.data);
            setOrderModal(false);
            setSelectedEmployee("");
            setSelectedProduct("");
        } catch (error) {
            console.error("Order failed:", error);
        }
    };


    return (
        <>
            <UserNavbar />
            <div className='min-h-screen bg-gray-50 mt-24 overflow-x-hidden'>
                <div className='container ml-12 py-12 flex flex-col lg:flex-row'>
                    <aside className='w-full lg:w-1/4 pr-8 mb-6 lg:mb-0'>
                        <div className='bg-white p-8 shadow-xl rounded-lg'>
                            <h2 className='text-2xl font-extrabold mb-6 text-gray-800'>Search</h2>
                            {/* Search Inputs */}
                            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Name' />
                            <input type="text" value={searchType} onChange={(e) => setSearchType(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Type' />
                            <input type="number" value={searchQuantity} onChange={(e) => setSearchQuantity(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Qunatity' />
                            <input type="number" value={searchCost} onChange={(e) => setSearchCost(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Maximum Cost' />
                        </div>
                    </aside>

                    <main className='w-full lg:w-[1000px]'>
                        <div className='flex justify-end px-4 mb-4'>

                            <button
                                onClick={() => {
                                    setOrderModal(true);
                                    setSelectedUserId(user._id); // Set the user ID when placing the order
                                }}
                                className='bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700'
                            >
                                Place New Order
                            </button>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
                            {filteredEmployees.map((emp) => (
                                <div key={emp._id} className='bg-white p-4 rounded-lg shadow-xl'>
                                    <img src={emp.signedImageUrl} alt="employee" className="w-full h-48 object-cover rounded-md mb-2" />
                                    <h3 className='font-bold text-2xl mt-5 mb-2 text-center'>{emp.name}</h3>
                                    <p className='text-gray-600 mt-2'><span className='font-bold text-green-800'>Category: </span>{emp.type}</p>
                                    <p className='text-gray-600'><span className='font-bold text-green-800'>Available Quantity: </span>{emp.quantity}<span className='font-bold text-green-800'>  kg</span></p>
                                    <p className='text-gray-600'><span className='font-bold text-green-800'>cost: </span>{emp.cost || "N/A"}</p>


                                </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <p className='text-center text-gray-500 col-span-full'>No employees found</p>
                            )}
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
                                            <label htmlFor="quantityInput" className="block text-md mb-1">Enter Quantity:(kg)</label>
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
                                            onClick={async () => {
                                                try {
                                            

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
