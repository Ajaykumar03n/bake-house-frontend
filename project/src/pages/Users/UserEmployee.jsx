import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../../../components/Navbar';

export const DisplayEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [image, setImage] = useState(null);

    const [searchName, setSearchName] = useState("");
    const [searchQuantity, setSearchQuantity] = useState("");
    const [searchType, setSearchType] = useState("");
    const [searchCost, setSearchCost] = useState("");

    const [confirmRemove,setConfirmRemove] = useState("");

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
            const res = await fetch("http://localhost:8083/api/upload/image", {
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
                const res = await axios.get("http://localhost:8083/api/employee/get-employee");
                const employeeData = res.data;

                const employeesWithSignedUrls = await Promise.all(
                    employeeData.map(async (emp) => {
                        try {
                            const signRes = await fetch(
                                `http://localhost:8083/api/s3/sign-image-url?url=${encodeURIComponent(emp.imageUrl)}`,
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
    
    
    const handleRemoveEmployee = async () => {
        if (confirmRemove) {

            try {
                await axios.delete(`http://localhost:8083/api/employee/delete-employee/${confirmRemove}`);
                const updated = employees.filter(emp => emp._id !== confirmRemove);
                setEmployees(updated);
                setFilteredEmployees(updated);
                setConfirmRemove(null); // Close the confirmation modal after removing

            } catch (err) {
                console.error("Failed to delete employee", err);
            }
        }
    };


    const handleAddOrUpdateEmployee = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = editingEmployee?.imageUrl || null;

            if (image) {
                imageUrl = await uploadImage(image);
            }

            if (editingEmployee) {
                // Update existing employee
                await axios.put(`http://localhost:8083/api/employee/update-employee/${editingEmployee._id}`, {
                    ...newEmployee,
                    imageUrl,
                });

                const updatedEmployees = employees.map((emp) =>
                    emp._id === editingEmployee._id ? { ...emp, ...newEmployee, imageUrl } : emp
                );
                setEmployees(updatedEmployees);
                setFilteredEmployees(updatedEmployees);
            } else {
                // Add new employee
                const res = await axios.post("http://localhost:8083/api/employee/add-employee", {
                    ...newEmployee,
                    imageUrl,
                });
                setEmployees([...employees, res.data]);
                setFilteredEmployees([...employees, res.data]);
            }

            setShowForm(false);
            setNewEmployee({ name: "", type: "", quantity: "", cost: "" });
            setImage(null);
            setEditingEmployee(null);
            const fetchEmployees = async () => {
                try {
                    const res = await axios.get("http://localhost:8083/api/employee/get-employee");
                    const employeeData = res.data;
    
                    const employeesWithSignedUrls = await Promise.all(
                        employeeData.map(async (emp) => {
                            try {
                                const signRes = await fetch(
                                    `http://localhost:8083/api/s3/sign-image-url?url=${encodeURIComponent(emp.imageUrl)}`,
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
    
        } catch (error) {
            console.error("Error adding/updating employee:", error);
        }
    };

    const openEditForm = (employee) => {
        setEditingEmployee(employee);
        setNewEmployee({
            name: employee.name,
            type: employee.type,
            quantity: employee.quantity,
            cost: employee.cost
        });
        setShowForm(true);
    };

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 mt-24 overflow-x-hidden'>
                <div className='container ml-12 py-12 flex flex-col lg:flex-row'>
                    <aside className='w-full lg:w-1/4 pr-8 mb-6 lg:mb-0'>
                        <div className='bg-white p-8 shadow-xl rounded-lg'>
                            <h2 className='text-2xl font-extrabold mb-6 text-gray-800'>Search</h2>
                            {/* Search Inputs */}
                            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Name' />
                            <input type="text" value={searchType} onChange={(e) => setSearchType(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Type' />
                            <input type="number" value={searchQuantity} onChange={(e) => setSearchQuantity(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Quantity' />
                            <input type="number" value={searchCost} onChange={(e) => setSearchCost(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Maximum Cost' />
                        </div>
                    </aside>

                    <main className='w-full lg:w-[1000px]'>
                        <div className='flex justify-end px-4 mb-4'>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingEmployee(null);
                                    setNewEmployee({ name: "", type: "", quantity: "", cost: "" });
                                }}
                                className='bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700'
                            >
                                Add Product
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

                                    <div className='mt-3'>
                                        <button
                                            onClick={() => openEditForm(emp)}
                                            className='bg-yellow-500 text-white px-4 py-2 rounded-md w-full mb-2 focus:outline-none hover:bg-yellow-600'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setConfirmRemove(emp._id)} // Trigger confirmation modal
                                            className='bg-red-600 text-white px-4 py-2 w-full rounded-md focus:outline-none hover:bg-red-700'
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <p className='text-center text-gray-500 col-span-full'>No employees found</p>
                            )}
                        </div>

                    </main>
                </div>
            </div>

            {/* Add or Edit Form Modal */}
            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative'>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingEmployee(null);
                            }}
                            className='absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold'
                        >
                            &times;
                        </button>
                        <h3 className='text-xl font-bold mb-4'>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h3>
                        <form onSubmit={handleAddOrUpdateEmployee} className='grid grid-cols-1 gap-4'>
                            <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className='border border-gray-300 rounded-md p-2' required />
                            <input type="text" placeholder="Type" value={newEmployee.type} onChange={(e) => setNewEmployee({ ...newEmployee, type: e.target.value })} className='border border-gray-300 rounded-md p-2' />
                            <input type="number" placeholder="Quantity" value={newEmployee.quantity} onChange={(e) => setNewEmployee({ ...newEmployee, quantity: e.target.value })} className='border border-gray-300 rounded-md p-2' />
                            <input type="number" placeholder="Cost" value={newEmployee.cost} onChange={(e) => setNewEmployee({ ...newEmployee, cost: e.target.value })} className='border border-gray-300 rounded-md p-2' />

                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            <button type="submit" className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700'>
                                {editingEmployee ? "Update" : "Submit"}
                            </button>
                        </form>
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
                        <h3 className='text-xl font-bold mb-4 text-center'>Are you sure you want to remove this item?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleRemoveEmployee} // Confirm and remove
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
