import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EmployeeNavbar } from '../../components/EmployeeNavbar';
export const DisplayEmployeesEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);


    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchDegree, setSearchDegree] = useState("");

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
            emp.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
            emp.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
            emp.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
            emp.degree.toLowerCase().includes(searchDegree.toLowerCase())
        );
        setFilteredEmployees(results);
    }, [searchName, searchEmail, searchPhone, searchLocation, searchDegree, employees]);

    return (
        <>
            <EmployeeNavbar />
            <div className='min-h-screen bg-gray-50 mt-24 overflow-x-hidden'>
                <div className='container ml-12 py-12 flex flex-col lg:flex-row'>
                    <aside className='w-full lg:w-1/4 pr-8 mb-6 lg:mb-0'>
                        <div className='bg-white p-8 shadow-xl rounded-lg'>
                            <h2 className='text-2xl font-extrabold mb-6 text-gray-800'>Search</h2>
                            {/* Search Inputs */}
                            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Name' />
                            <input type="text" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Email' />
                            <input type="text" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Phone' />
                            <input type="text" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Location' />
                            <input type="text" value={searchDegree} onChange={(e) => setSearchDegree(e.target.value)} className='border p-2 mb-4 w-full' placeholder='Degree' />
                        </div>
                    </aside>

                    <main className='w-full lg:w-[1000px]'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
                            {filteredEmployees.map((emp) => (
                                <div key={emp._id} className='bg-white p-4 rounded-lg shadow-xl'>
                                    <img src={emp.signedImageUrl} alt="employee" className="w-full h-48 object-cover rounded-md mb-2" />
                                    <h3 className='font-bold text-2xl mt-5 mb-2 text-center'>{emp.name}</h3>
                                    <p className='text-gray-600 mt-2'><span className='font-bold text-green-800'>Email: </span>{emp.email}</p>
                                    <p className='text-gray-600'><span className='font-bold text-green-800'>Phone Number: </span>{emp.phone}</p>
                                    <p className='text-gray-600'><span className='font-bold text-green-800'>Degree: </span>{emp.degree}</p>
                                    <p className='text-gray-600'><span className='font-bold text-green-800'>Location: </span>{emp.location || "N/A"}</p>

                                </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <p className='text-center text-gray-500 col-span-full'>No employees found</p>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};
