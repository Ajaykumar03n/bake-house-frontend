import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../../../components/Navbar';

export const DisplayEmployees = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [image, setImage] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        degree: "",
        location: ""
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
                setEmployees(res.data);
                setFilteredEmployees(res.data);
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const results = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(results);
    }, [searchTerm, employees]);

    const handleRemoveEmployee = async (id) => {
        try {
            await axios.delete(`https://bake-house-backend.onrender.com/api/employee/delete-employee/${id}`);
            const updated = employees.filter(emp => emp._id !== id);
            setEmployees(updated);
            setFilteredEmployees(updated);
        } catch (err) {
            console.error("Failed to delete employee", err);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImage(image);
            }
            const res = await axios.post("https://bake-house-backend.onrender.com/api/employee/add-employee", newEmployee);
            setEmployees([...employees, res.data]);
            setFilteredEmployees([...employees, res.data]);
            setShowForm(false);
            setNewEmployee({
                name: "",
                email: "",
                phone: "",
                degree: "",
                location: "",
                imageUrl
            });
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-100 mt-24 overflow-x-hidden'>
                <div className='container ml-12 py-12 flex flex-col lg:flex-row'>
                    <aside className='w-full lg:w-1/4 pr-8 mb-6 lg:mb-0'>
                        <div className='bg-white p-8 shadow-xl rounded-lg'>
                            <h2 className='text-2xl font-extrabold mb-6 text-gray-800'>Search</h2>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full border-gray-300 rounded-md shadow-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Search by name'
                            />
                        </div>
                    </aside>

                    <main className='w-full lg:w-[1000px]'>
                        <div className='flex justify-end px-4 mb-4'>
                            <button
                                onClick={() => setShowForm(true)}
                                className='bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700'
                            >
                                Add Employee
                            </button>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
                            {filteredEmployees.map((emp) => (
                                <div key={emp._id} className='bg-white p-4 rounded shadow'>
                                    <h3 className='font-bold text-lg'>{emp.name}</h3>
                                    <p className='text-gray-600'>Email: {emp.email}</p>
                                    <p className='text-gray-600'>Phone: {emp.phone}</p>
                                    <p className='text-gray-600'>Degree: {emp.degree}</p>
                                    <p className='text-gray-600'>Location: {emp.location || "N/A"}</p>

                                    <div className='flex justify-center items-center'>
                                        <button
                                            onClick={() => handleRemoveEmployee(emp._id)}
                                            className='mt-2 bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
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

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative'>
                        <button
                            onClick={() => setShowForm(false)}
                            className='absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold'
                        >
                            &times;
                        </button>
                        <h3 className='text-xl font-bold mb-4'>Add New Employee</h3>
                        <form onSubmit={handleAddEmployee} className='grid grid-cols-1 gap-4'>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                className='border border-gray-300 rounded-md p-2'
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                className='border border-gray-300 rounded-md p-2'
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={newEmployee.phone}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                className='border border-gray-300 rounded-md p-2'
                                required
                            />
                            <input
                                type="text"
                                placeholder="Degree"
                                value={newEmployee.degree}
                                onChange={(e) => setNewEmployee({ ...newEmployee, degree: e.target.value })}
                                className='border border-gray-300 rounded-md p-2'
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={newEmployee.location}
                                onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                                className='border border-gray-300 rounded-md p-2'
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="submit"
                                className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700'
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
