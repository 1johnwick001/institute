import React from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside id='sidebar' className='sidebar'>
        <ul className='sidebar-nav' id='sidebar-nav'>
            <li className='nav-item'>
                <Link className='nav-link' to="/home">
                    <i className='bi bi-grid'></i>
                    <span>Dashboard</span>
                </Link>
            </li>

            <li className='nav-item'>
                <Link 
                    to="#"
                    className='nav-link collapsed'
                    data-bs-target = '#components-nav'
                    data-bs-toggle='collapse'
                >
                    <i className='bi bi-menu-button-wide'></i>
                    <span>Category</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </Link>
                <ul id='components-nav'
                className='nav-content collapse'
                data-bs-parent = '#sidebar-nav'
                >
                    <li>
                        <Link to="/all-category">
                            <i className='bi bi-circle'></i>
                            <span>All Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/category">
                            <i className='bi bi-circle'></i>
                            <span>Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/subcategory">
                            <i className='bi bi-circle'></i>
                            <span>sub-category</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/subsubcategory">
                            <i className='bi bi-circle'></i>
                            <span>sub-Sub-category</span>
                        </Link>
                    </li>
                </ul>
            </li>

            <li class="nav-heading">Home Page </li>

            <li className='nav-item'>
                <Link className='nav-link collapsed' to="/gallery">
                    <i className='bi bi-grid'></i>
                    <span>Gallery</span>
                </Link>
            </li>

            <li className='nav-item'>
                <Link className='nav-link collapsed' to="/banner">
                    <i className='bi bi-grid'></i>
                    <span>Banner</span>
                </Link>
            </li>

            {/* <li className='nav-item'>
                <Link to=""
                className='nav-link collapsed'
                data-bs-target = '#forms-nav'
                data-bs-toggle='collapse'
                >
                    <i className='bi bi-journal-text'></i>
                    <span>Forms</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </Link>
                <ul
                id='forms-nav'
                className='nav-content collapse'
                data-bs-parent='#sidebar-nav'
                >
                    <li>
                        <Link to="#">
                            <i className='bi bi-circle'></i>
                            <span>Application Form</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i className='bi bi-circle'></i>
                            <span>Application </span>
                        </Link>
                    </li>
                </ul>

            </li>

            <li className='nav-item'>
                <Link to="" className='nav-link collapsed'
                data-bs-target='#tables-nav'
                data-bs-toggle='collapse'
                >
                    <i className='bi bi-layout-text-window-reverse'></i>
                    <span>Tables</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </Link>
                <ul id='tables-nav' className='nav-content collapse' data-bs-parent='#sidebar-nav'>
                    <li>
                        <Link to="">
                            <i className='bi bi-circle'></i>
                            <span>General Tables</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <i className='bi bi-circle'></i>
                            <span>Data Tables</span>
                        </Link>
                    </li>

                </ul>
            </li> */}

        </ul>
    </aside>
  )
}

export default Sidebar