import React, { useState } from 'react'
import logo from "../assets/images/CDGI Logo.png"
import axios from 'axios';
import API_BASE_URL from '../config/Config';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!email || !password) {
            setErrors('Please Enter both error and Password')
            return;
        }

        try {

            const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password })
            setEmail('');
            setPassword('');
            console.log("response of form:", response.data);

            const token = response.data.token;

            localStorage.setItem("is_Admin_loggedIn", true.toString());
            localStorage.setItem("token", token); //saving token in localstorage
            navigate('/home')

        } catch (error) {
            console.error('An error occured', error);
            setErrors('!!!An error occured. please try again later!!!')
        }
    }


    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="d-flex justify-content-center py-4">
                                <a href="index.html" className="logo d-flex align-items-center w-auto">
                                    <img src={logo} alt='' />
                                    <span className="d-none d-lg-block">Chameli Devi Admin Panel</span>
                                </a>
                            </div>
                            {/* End Logo */}
                            <div className="card mb-3">
                                <div className="card-body">
                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                        <p className="text-center small">Enter your email &amp; password to login</p>
                                    </div>
                                    <form
                                    action='post'
                                    onSubmit={handleSubmit}
                                    className="row g-3 needs-validation" noValidate>
                                        <div class="col-12">
                                            <label for="yourEmail" class="form-label">Your Email</label>
                                            <input type="email" name="email" className="form-control" id="yourEmail"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder='Enter Your Email here...'
                                                required />
                                            <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="yourPassword" className="form-label">Password</label>
                                            <input type="password" name="password" className="form-control" id="yourPassword"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder='Please enter your password!'
                                                required />
                                            <div className="invalid-feedback">Please enter your password!</div>
                                        </div>
                                        {errors && (
                                            <div className="col-12">
                                                <div className="alert alert-danger" role="alert">
                                                    {errors}
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit">Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default Login