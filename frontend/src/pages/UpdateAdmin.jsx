// src/UpdateAdmin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/Config';
import Header from '../components/Header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import Pagetitle from '../components/pagetitle/Pagetitle';

const UpdateAdmin = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

        try {
            const response = await fetch(`${API_BASE_URL}/admin/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Redirect to home page after a successful update
                setTimeout(() => {
                    navigate('/'); 
                }, 2000); // : wait for 2 seconds before redirecting
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error("Error updating admin:", err);
            setError("An error occurred while updating admin.");
        }
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Update Admin Credentials' />
                <div className="container">
                    <section className="section register p-4 d-flex flex-column align-items-center justify-content-center">
                        <div className="card mb-3 shadow-lg">
                            <div className="card-body">
                                <div className="pt-4 pb-2">
                                    <h1 className='card-title text-center pb-0 fs-4 '>Update Admin Information</h1>

                                    <form className='row g-3' onSubmit={handleSubmit}>
                                        <div className="col-12">
                                            <label className="form-label" htmlFor="email">Email Address</label>
                                            <input
                                                className='form-control'
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" htmlFor="password">New Password</label>
                                            <input
                                                className='form-control'
                                                type="password"
                                                id="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-info w-100 shadow" type="submit">Update</button>
                                        </div>
                                    </form>
                                    {message && <div className="success-message">{message}</div>}
                                    {error && <div className="error-message">{error}</div>}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>  
    );
};

export default UpdateAdmin;