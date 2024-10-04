import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function FooterCategories() {
    const [showModal, setShowModal] = useState(false);
    const [footerCategoryName, setFooterCategoryName] = useState('');
    const [footerCategoryType, setFooterCategoryType] = useState('');
    const [footerCategories, setFooterCategories] = useState([]);

    // ====== edit 
    const [editingFooterCategoryId, setEditingFooterCategoryId] = useState(null);
    const [editFooterCategoryName, setEditFooterCategoryName] = useState('');
    const [editFooterCategoryType, setEditFooterCategoryType] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    // ====== delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingFooterCategoryId, setDeletingFooterCategoryId] = useState(null);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setFooterCategoryName(''); // Reset input field
        setFooterCategoryType('');
    };

    // Fetch Footer Categories
    const fetchFooterCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getFooter-categories`);
            if (response.data.status) {
                setFooterCategories(response.data.data); // Ensure this is an array
            }
        } catch (error) {
            console.error('Error fetching footer categories:', error);
        }
    };

    useEffect(() => {
        fetchFooterCategories();
    }, []);

    // Add Footer Category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/addFooter-categories`, { name: footerCategoryName, type: footerCategoryType });
            fetchFooterCategories(); // Refresh the list after adding
            handleCloseModal();
        } catch (error) {
            console.error('Error adding footer category:', error);
        }
    };

    // Edit Modal Handlers
    const handleEditModal = (category) => {
        setEditingFooterCategoryId(category._id);
        setEditFooterCategoryName(category.name);
        setEditFooterCategoryType(category.type);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingFooterCategoryId(null);
        setEditFooterCategoryName('');
        setEditFooterCategoryType('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/editFooter-category/${editingFooterCategoryId}`, { name: editFooterCategoryName, type: editFooterCategoryType });
            fetchFooterCategories(); // Refresh the list after updating
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating footer category:', error);
        }
    };

    // Delete Modal Handlers
    const handleDeleteModal = (categoryId) => {
        setDeletingFooterCategoryId(categoryId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingFooterCategoryId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/deleteFooter-category/${deletingFooterCategoryId}`);
            
            // Remove the deleted category from the state without refetching the entire list
            setFooterCategories(footerCategories.filter(category => category._id !== deletingFooterCategoryId));
    
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting footer category:', error);
        }
    };
    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Footer Categories' />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={handleShowModal}>Add Footer Category</button>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr className='table-dark'>
                                <th scope="col">Sr No</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Category Type</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {footerCategories.map((category, index) => (
                                <tr key={category._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.name}</td>
                                    <td>{category.type}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm m-2" onClick={() => handleEditModal(category)}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteModal(category._id)}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Add Footer Category Modal */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Add Footer Category</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="footerCategoryName" className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="footerCategoryName"
                                            value={footerCategoryName}
                                            onChange={(e) => setFooterCategoryName(e.target.value)}
                                            placeholder="Enter footer category name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="footerCategoryType" className="form-label">Category Type</label>
                                        <select
                                            className="form-control"
                                            id="footerCategoryType"
                                            value={footerCategoryType}
                                            onChange={(e) => setFooterCategoryType(e.target.value)}
                                            required
                                        >
                                            <option value="">Select type</option>
                                            <option value="pdf">PDF</option>
                                            <option value="link">Link</option>
                                            <option value="page">Page</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}

                {/* Edit Footer Category Modal */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Edit Footer Category</h5>
                                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="editFooterCategoryName" className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editFooterCategoryName"
                                            value={editFooterCategoryName}
                                            onChange={(e) => setEditFooterCategoryName(e.target.value)}
                                            placeholder="Enter footer category name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editFooterCategoryType" className="form-label">Category Type</label>
                                        <select
                                            className="form-control"
                                            id="editFooterCategoryType"
                                            value={editFooterCategoryType}
                                            onChange={(e) => setEditFooterCategoryType(e.target.value)}
                                            required
                                        >
                                            <option value="">Select type</option>
                                            <option value="pdf">PDF</option>
                                            <option value="link">Link</option>
                                            <option value="page">Page</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showEditModal && <div className="modal-backdrop fade show" onClick={handleCloseEditModal}></div>}

                {/* Delete Footer Category Confirmation Modal */}
                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this category?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                {showDeleteModal && <div className="modal-backdrop fade show" onClick={handleCloseDeleteModal}></div>}
            </main>
        </>
    );
}

export default FooterCategories;