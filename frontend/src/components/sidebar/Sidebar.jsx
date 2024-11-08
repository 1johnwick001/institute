import React from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <aside id='sidebar' className='sidebar'>
            <ul className='sidebar-nav' id='sidebar-nav'>
                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/home">
                        <i className='bi bi-grid'></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li class="nav-heading">Landing Page </li>

                <li className='nav-item'>
                    <Link 
                        to="#"
                        className='nav-link collapsed'
                        data-bs-target = '#home-page-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-houses'></i>
                        <span>Home Page Section </span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </Link>
                    <ul id='home-page-nav'
                    className='nav-content collapse'
                    data-bs-parent = '#sidebar-nav'
                    >

                        <li className='nav-item'>
                            <Link className='nav-link collapsed' to="/banner">
                                <i className='bi bi-flag-fill'></i>
                                <span>Banner</span>
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link collapsed' to='/bgBanners-list'>
                                <i className='bi bi-flag-fill'></i>
                                <span>Background-Banner</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/institute-banner">
                                <i className='bi bi-circle'></i>
                                <span>Create Institute Banners</span>
                            </Link>
                        </li>

                        <li className='nav-item'>
                            <Link className='nav-link collapsed' to="/fact-info">
                                <i className='bi bi-info-circle'></i>
                                <span>Fact Numbers</span>
                            </Link>
                        </li>

                        
                       
                    </ul>
                </li>

                
    
                <li className='nav-item'>
                    <Link 
                        to="#"
                        className='nav-link collapsed'
                        data-bs-target = '#category-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-dpad'></i>
                        <span>Category</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </Link>
                    <ul id='category-nav'
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
                        {/* <li class="nav-heading">Tabs or other child categories </li>
                        <li>
                            <Link to="/supersubcategory">
                                <i className='bi bi-circle'></i>
                                <span>super-sub-categories</span>
                            </Link>
                        </li> */}
                    </ul>
                </li>


                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/tabs-data">
                        <i className='bi bi-tags'></i>
                        <span>Tabs</span>
                    </Link>
                </li>
    
                
                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/doc-files">
                        <i className='bi bi-file-pdf'></i>
                        <span>Doc Files</span>
                    </Link>
                </li>

                
    
                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/gallery">
                        <i className='bi bi-floppy'></i>
                        <span>Gallery</span>
                    </Link>
                </li>

                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/getnewsAndEvents">
                        <i className='bi bi-newspaper'></i>
                        <span>News and Events</span>
                    </Link>
                </li>
    
                
    
                <li className='nav-item'>
                    <Link 
                        to="#"
                        className='nav-link collapsed'
                        data-bs-target = '#blog-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-menu-button-wide'></i>
                        <span>Blog Section</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </Link>
                    <ul id='blog-nav'
                    className='nav-content collapse'
                    data-bs-parent = '#sidebar-nav'
                    >
                        <li>
                            <Link to="/blogs-list">
                                <i className='bi bi-circle'></i>
                                <span>Blogs List</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/create-blog">
                                <i className='bi bi-circle'></i>
                                <span>Create Blog</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                

                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/bog-details">
                        <i className='bi bi-person-vcard'></i>
                        <span>Cards/Faculty/Bog</span>
                    </Link>
                </li>

                

                <li className='nav-item'>
                    <Link 
                        to="#"
                        className='nav-link collapsed'
                        data-bs-target = '#enquirey-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-menu-button-wide'></i>
                        <span>Enquirey Section</span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </Link>
                    <ul id='enquirey-nav'
                    className='nav-content collapse'
                    data-bs-parent = '#sidebar-nav'
                    >
                        <li >
                            <Link to="/application-form">
                                    <i className='bi bi-info-circle'></i>
                                    <span>Application Form Data</span>
                            </Link>
                        </li>
                        <li >
                            <Link to="/contactUSForm">
                                <i className='bi bi-info-circle'></i>
                                <span>Contact us Form Data</span>
                            </Link>
                        </li>
                        <li >
                            <Link to="/feedbackForm">
                                <i className='bi bi-info-circle'></i>
                                <span>Feedback Form Data</span>
                            </Link>
                        </li>
                        <li >
                            <Link to="/student-enquirey">
                                <i className='bi bi-info-circle'></i>
                                <span>Student enquirey form data</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/contactUSAddressForm">
                        <i className='bi bi-map'></i>
                        <span>Contact Us Addresses</span>
                    </Link>
                </li>

                

                {/* <li class="nav-heading">Footer</li>

                <li className='nav-item'>
                    <Link 
                        to="#"
                        className='nav-link collapsed'
                        data-bs-target = '#home-footer-nav'
                        data-bs-toggle='collapse'
                    >
                        <i className='bi bi-record2'></i>
                        <span>Footer Section </span>
                        <i className='bi bi-chevron-down ms-auto'></i>
                    </Link>
                    <ul id='home-footer-nav'
                    className='nav-content collapse'
                    data-bs-parent = '#sidebar-nav'
                    >
                        <li>
                            <Link to="/footerCateg">
                                <i className='bi bi-circle'></i>
                                <span>Create Footer Categories</span>
                            </Link>
                        </li>

                        <li className='nav-item'>
                    <Link className='nav-link collapsed' to="/footer-doc-files">
                        <i className='bi bi-file-pdf'></i>
                        <span>Footer Doc Files</span>
                    </Link>
                </li>
                       
                    </ul>
                </li> */}

            </ul>
        </aside>
      )
}

export default Sidebar



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