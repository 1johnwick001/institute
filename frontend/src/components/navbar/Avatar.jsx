import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/CDGI Logo.png"

function Avatar() {

    const navigate = useNavigate()

    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleLogoutClick = () => {
        setShowLogoutModal(true)
    };

    const handleCloseModal = () => {
        setShowLogoutModal(false)
    }

    const handleLogoutConfirm = () => {
        
        localStorage.removeItem("token");
        navigate("/");
        setShowLogoutModal(false);
        localStorage.removeItem("is_Admin_loggedIn");
    }

  return (
   <li className='nav-item dropdown pe-3'>
    <a className='nav-link nav-profile d-flex align-items-center pe-0' href="#"
    data-bs-toggle='dropdown'
    >
        <img src={logo} alt="logo" className = 'rounded-circle'/> 
        <span className='d-none d-md-block dropdown-toggle ps-2'>Admin</span>

    </a>

    <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
        <li className='dropdown-header'>
            <h6>PS</h6>
            <span>Web developer</span>
        </li>
        <li>
            <hr className='dropdown-divider' />
        </li>
        <li>
            <a className='dropdown-item d-flex align-items-center' href="#">
            <i className='bi bi-gear'></i>
            <span>my profile</span>
            </a>
        </li>
        <li>
            <hr className='dropdown-divider' />
        </li>
        {/* <li>
            <a className='dropdown-item d-flex align-items-center' href="#">
            <i className='bi bi-gear'></i>
            <span>Account settings</span>
            </a>
        </li> */}
        <li>
            <hr className='dropdown-divider' />
        </li>
        <li>
            <a className='dropdown-item d-flex align-items-center' href="#" onClick={handleLogoutClick}>
            <i className='bi bi-box-arrow-right'></i>
            <span>sign out</span>
            </a>
        </li>

    </ul>

    {/* Logout Confirmation Modal */}
     <div className={`modal fade ${showLogoutModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showLogoutModal ? 'block' : 'none' }} aria-labelledby="logoutModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-info">
                        <h5 className="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body">
                        <p>Do you really want to logout?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={handleLogoutConfirm}>Yes</button>
                        <button type="button" className="btn btn-primary" onClick={handleCloseModal}>No</button>
                    </div>
                </div>
            </div>
        </div>
    {showLogoutModal && <div className="modal-backdrop fade show" />}
    
   </li>
  )
}

export default Avatar
