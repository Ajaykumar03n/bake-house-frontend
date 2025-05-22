import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EmployeeNavbar } from '../../components/EmployeeNavbar';
export const DisplayProductEmployee = () => {
    const [kits, setKits] = useState([]);
    const [biometricKits, setBiometricKits] = useState([]);
    const [sensorKits, setSensorKits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [newCount, setNewCount] = useState("");

    useEffect(() => {
        fetchKits();
        fetchBiometricKits();
        fetchSensorKits();
    }, []);

    const fetchKits = async () => {
        try {
            const res = await axios.get("https://bake-house-backend.onrender.com/api/cctv");
            setKits(res.data);
        } catch (error) {
            console.error("Error fetching CCTV kits:", error);
        }
    };

    const fetchBiometricKits = async () => {
        try {
            const res = await axios.get("https://bake-house-backend.onrender.com/api/biometric");
            setBiometricKits(res.data);
        } catch (error) {
            console.error("Error fetching Biometric kits:", error);
        }
    };

    const fetchSensorKits = async () => {
        try {
            const res = await axios.get("https://bake-house-backend.onrender.com/api/sensors");
            setSensorKits(res.data);
        } catch (error) {
            console.error("Error fetching Sensor kits:", error);
        }
    };

    const openModal = (kit, kitId, component, type) => {
        const currentCount = kit[`${component}Count`];
        setModalData({ kit, kitId, component, currentCount, type });
        setNewCount(currentCount);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        const { kitId, component, type } = modalData;
        const parsedCount = parseInt(newCount, 10);

        if (isNaN(parsedCount) || parsedCount < 0) {
            alert("Please enter a valid non-negative number.");
            return;
        }

        try {
            await axios.put(`https://bake-house-backend.onrender.com/api/${type}/${kitId}/${component}`, {
                count: parsedCount,
            });

            const updateState = (prev) =>
                prev.map((kit) =>
                    kit._id === kitId
                        ? { ...kit, [component + 'Count']: parsedCount }
                        : kit
                );

            if (type === "cctv") {
                setKits(updateState);
            } else if (type === "biometric") {
                setBiometricKits(updateState);
            } else if (type === "sensors") {
                setSensorKits(updateState);
            }

        } catch (error) {
            console.error("Failed to update count:", error);
        }

        setShowModal(false);
    };

    const handleDelete = async (kitId, component, type) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the component "${component}" from this kit?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://bake-house-backend.onrender.com/api/${type}/${kitId}/${component}`);

            const updateState = (prev) =>
                prev.map((kit) =>
                    kit._id === kitId
                        ? { ...kit, [component]: null, [component + 'Count']: 0 }
                        : kit
                );

            if (type === "cctv") {
                setKits(updateState);
            } else if (type === "biometric") {
                setBiometricKits(updateState);
            } else if (type === "sensors") {
                setSensorKits(updateState);
            }

        } catch (error) {
            console.error("Failed to delete component:", error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const renderTable = (kitList, components, typeLabel) => (
        kitList.map((kit) => (
            <div key={kit._id} className="mb-8 mx-20">
                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full border-2 border-black-300 bg-white rounded-2xl shadow-xl">
                        <thead>
                            <tr className="bg-green-500 text-white">
                                <th className="px-6 py-3 border-b text-center">Component</th>
                                <th className="px-6 py-3 border-b text-center">Name</th>
                                <th className="px-6 py-3 border-b text-center">Count</th>
                                <th className="px-6 py-3 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {components.map((comp) => (
                                kit[comp] && (
                                    <tr key={comp} className="hover:bg-green-50">
                                        <td className="px-6 py-3 border-b text-center">{comp}</td>
                                        <td className="px-6 py-3 border-b text-center">{kit[comp]}</td>
                                        <td className={`px-6 py-3 border-b font-bold text-center ${kit[`${comp}Count`] < 5 ? "text-red-600" : "text-black"}`}>
                                            {kit[`${comp}Count`]}
                                        </td>
                                        <td className="px-6 py-3 border-b space-x-2 text-center">
                                            <button
                                                onClick={() => openModal(kit, kit._id, comp, typeLabel)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Update
                                            </button>

                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ))
    );

    const cctvComponents = ['IPcamera', 'NVR', 'HDD', 'Adapter', 'Cable', 'Screws', 'Anchors'];
    const biometricComponents = ['Scanner', 'Controller', 'Battery', 'Adapter', 'Cable', 'MountingBracket'];
    const sensorComponents = ['MotionSensor', 'SmokeSensor', 'GasSensor', 'DoorSensor', 'WaterLeakSensor','TemperatureSensor'];

    return (
        <>
            <EmployeeNavbar />
            <div className="mt-32 p-6">
                <h2 className="text-2xl font-bold mb-6 mx-20">CCTV Kits</h2>
                {kits.length > 0 ? renderTable(kits, cctvComponents, 'cctv') : <p>No CCTV Kits Available.</p>}

                <h2 className="text-2xl font-bold mt-12 mb-6 mx-20">Biometric Kits</h2>
                {biometricKits.length > 0 ? renderTable(biometricKits, biometricComponents, 'biometric') : <p>No Biometric Kits Available.</p>}

                <h2 className="text-2xl font-bold mt-12 mb-6 mx-20">Sensor Kits</h2>
                {sensorKits.length > 0 ? renderTable(sensorKits, sensorComponents, 'sensors') : <p>No Sensor Kits Available.</p>}
            </div>

            {showModal && modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-center">Update {modalData.component} Count</h3>

                        <p className="mb-4 text-xl text-center">
                            <strong>Current Count:</strong> <span className='text-green-800 font-bold'>{modalData.currentCount}</span>
                        </p>

                        <input
                            type="number"
                            className="w-full p-3  border-2 border-green-600 rounded mb-4 focus:outline-none focus:border-2 border-green-600"
                            placeholder="Enter new count"
                            value={newCount}
                            onChange={(e) => setNewCount(e.target.value)}
                            min={0}
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleConfirm}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
