import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function SuperSubCateg() {
    const [supercategories, setSupercategories] = useState([]);
    const [parentSubCategoryId, setParentSubCategoryId] = useState('');
    const [subSubCategoryName, setSubSubCategoryName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteCategoryId, setDeleteCategoryId] = useState('');



    useEffect(() => {
        fetchSupercategories();
    }, []);

    const fetchSupercategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-categories-level`);
            setSupercategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // Handle Add or Update category
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name: subSubCategoryName, parentId: parentSubCategoryId };

        try {
            if (isEditing) {
                // If editing, send an update request
                await axios.put(`${API_BASE_URL}/update-category/${editCategoryId}`, payload);
            } else {
                // If adding a new category, send a create request
                await axios.post(`${API_BASE_URL}/create-category`, payload);
            }
            fetchSupercategories(); // Refresh the categories list
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    // Handle opening the modal for adding a category
    const handleOpenModal = () => {
        setIsEditing(false); // Reset the editing state
        setParentSubCategoryId('');
        setSubSubCategoryName('');
        setShowModal(true);
    };

    // Handle opening the modal for editing a category
    const handleEdit = (category) => {
        setIsEditing(true);
        setEditCategoryId(category._id);
        setParentSubCategoryId(category.parent?._id || '');
        setSubSubCategoryName(category.name);
        setShowModal(true);
    };

    const handleDelete = (categoryId) => {
        handleDeleteOpenModal(categoryId);
    };

    const handleDeleteOpenModal = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setShowDeleteModal(true);
    };
    
    const handleDeleteCloseModal = () => setShowDeleteModal(false);
    
    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/delete-category/${deleteCategoryId}`);
            fetchSupercategories(); // Refresh the categories list
            handleDeleteCloseModal();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };
    

    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Super sub categories' />

                <section className='section'>
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary' onClick={handleOpenModal}>
                            Add Super-Sub-Category
                        </button>
                    </div>

                    <table className="table table-bordered table-striped table-hover">
                        <thead className="thead-dark">
                            <tr className='table-dark'>
                                <th scope="col">Sr No</th>
                                <th scope="col">Parent Sub-Category</th>
                                <th scope="col">Super-Sub-Category Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supercategories.length > 0 ? (
                                supercategories
                                    .filter(category => category.level >= 3) 
                                    .map((category, index) => (
                                        <tr key={category._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{category.parent ? category.parent.name : 'N/A'}</td> {/* Display parent name if available */}
                                            <td>{category.name}</td> {/* Display sub-sub-category name */}
                                            <td>
                                                <button 
                                                    className="btn btn-warning btn-sm m-2"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(category._id)}
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No categories available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* Modal for Adding or Editing Super Sub-Category */}
                {showModal && (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header bg-info">
                    <h5 className="modal-title">
                        {isEditing ? 'Edit Super Sub-Category' : 'Add Super Sub-Category'}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="parentCategory">Select Parent Category</label>
                            <select
                                className="form-control"
                                id="parentCategory"
                                value={parentSubCategoryId}
                                onChange={(e) => setParentSubCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select a Parent Category</option>
                                {supercategories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subSubCategoryName">Super Sub-Category Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="subSubCategoryName"
                                value={subSubCategoryName}
                                onChange={(e) => setSubSubCategoryName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)}

{showDeleteModal && (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button type="button" className="btn-close" onClick={handleDeleteCloseModal}></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete this category? This action cannot be undone.
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleDeleteCloseModal}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
            </main>
        </>
    );
}

export default SuperSubCateg;
