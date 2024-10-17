import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function SubSubCategories() {
    const [showModal, setShowModal] = useState(false);
    const [subSubCategoryName, setSubSubCategoryName] = useState('');
    const [parentSubCategoryId, setParentSubCategoryId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [subSubcategories, setSubSubcategories] = useState([]);


    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editSubSubCategory, setEditSubSubCategory] = useState(null);
    const [deletingSubSubCategoryId, setDeletingSubSubCategoryId] = useState(null);
    const [editSubSubCategoryName, setEditSubSubCategoryName] = useState('');

    const [type, setType] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSubSubCategoryName('');
        setParentSubCategoryId('');
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-categories`);
            setSubcategories(response.data.data.flatMap(category => category.subcategories));
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchSubSubcategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-categories`);
            setSubSubcategories(response.data.data.flatMap(category =>
                category.subcategories.flatMap(subcategory => subcategory.subcategories)
            ));
        } catch (error) {
            console.error('Error fetching sub-subcategories:', error);
        }
    };

    useEffect(() => {
        fetchSubcategories();
        fetchSubSubcategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/create-category`, { name: subSubCategoryName, parentId: parentSubCategoryId, type  });
            fetchSubSubcategories(); // Refresh the sub-subcategories list
            handleCloseModal();
        } catch (error) {
            console.error('Error adding sub-subcategory:', error);
        }
    };

    const handleEditModal = (subSubcategory) => {
        setEditSubSubCategory(subSubcategory);
        setEditSubSubCategoryName(subSubcategory.name);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditSubSubCategory(null);
        setEditSubSubCategoryName('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/update-category/${editSubSubCategory._id}`, { name: editSubSubCategoryName });
            fetchSubSubcategories(); // Refresh the sub-subcategories list
            handleCloseEditModal();
        } catch (error) {
            console.error('Error editing sub-subcategory:', error);
        }
    };

    const handleDeleteModal = (subSubcategoryId) => {
        setDeletingSubSubCategoryId(subSubcategoryId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingSubSubCategoryId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/delete-category/${deletingSubSubCategoryId}`);
            fetchSubSubcategories(); // Refresh the sub-subcategories list
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting sub-subcategory:', error);
        }
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Sub-Sub-Category' />

                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={handleShowModal}>Add Sub-Sub-Category</button>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr className='table-dark'>
                                <th scope="col">Sr No</th>
                                <th scope="col">Parent Sub-Category</th>
                                <th scope="col">Sub-Sub-Category Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subSubcategories.map((subSubcategory, index) => (
                                <tr key={subSubcategory._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{subSubcategory.parent ? subSubcategory.parent.name : 'N/A'}</td>
                                    <td>{subSubcategory.name}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm m-2" onClick={() => handleEditModal(subSubcategory)}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        {/* <button className="btn btn-danger btn-sm" onClick={() => handleDeleteModal(subSubcategory._id)}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Add Sub-Sub-Category Modal */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Add Sub-Sub-Category</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="parentSubCategoryId" className="form-label">Parent Sub-Category</label>
                                        <select
                                            className="form-control"
                                            id="parentSubCategoryId"
                                            value={parentSubCategoryId}
                                            onChange={(e) => setParentSubCategoryId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Parent Sub-Category</option>
                                            {subcategories.map(subcategory => (
                                                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="subSubCategoryName" className="form-label">Sub-Sub-Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subSubCategoryName"
                                            value={subSubCategoryName}
                                            onChange={(e) => setSubSubCategoryName(e.target.value)}
                                            placeholder="Enter sub-sub-category name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">Type</label>
                                        <select
                                            className="form-control"
                                            id="type"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="pdf">PDF</option>
                                            <option value="text">Text</option>
                                            <option value="link">Link</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    <hr />
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}

                {/* Edit Sub-Sub-Category Modal */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info">
                                <h5 className="modal-title">Edit Sub-Sub-Category</h5>
                                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="editSubSubCategoryName" className="form-label">Sub-Sub-Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editSubSubCategoryName"
                                            value={editSubSubCategoryName}
                                            onChange={(e) => setEditSubSubCategoryName(e.target.value)}
                                            placeholder="Enter sub-sub-category name"
                                            required
                                        />
                                    </div>
                                    <hr />
                                    <div>
                                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showEditModal && <div className="modal-backdrop fade show" onClick={handleCloseEditModal}></div>}

                {/* Delete Sub-Sub-Category Confirmation Modal */}
                <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger">
                                <h5 className="modal-title text-white">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this sub-sub-category?</p>
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

export default SubSubCategories;
