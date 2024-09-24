import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function Categories() {
	const [showModal, setShowModal] = useState(false);
	const [categoryName, setCategoryName] = useState('');
	const [categories, setCategories] = useState([]);

	// ====== edit 
	const [editingCategoryId, setEditingCategoryId] = useState(null);
	const [editCategoryName, setEditCategoryName] = useState('');
	const [showEditModal, setShowEditModal] = useState(false);

	// ====== delete
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingCategoryId, setDeletingCategoryId] = useState(null);

	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setShowModal(false);
		setCategoryName(''); // Reset input field
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/get-categories`);
			if (response.data.status) {
				setCategories(response.data.data); // Ensure this is an array
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
			// Handle error (e.g., show an error message)
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_BASE_URL}/create-category`, { name: categoryName });
			// Fetch categories again to include the newly added category
			fetchCategories();
			handleCloseModal();
		} catch (error) {
			console.error('Error adding category:', error);
			// Handle error (e.g., show an error message)
		}
	};

	const handleEditModal = (category) => {
		setEditingCategoryId(category._id);
		setEditCategoryName(category.name);
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		setEditingCategoryId(null);
		setEditCategoryName('');
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`${API_BASE_URL}/update-category/${editingCategoryId}`, { name: editCategoryName });
			fetchCategories(); // Refresh the categories list
			handleCloseEditModal();
		} catch (error) {
			console.error('Error updating category:', error);
		}
	};

	const handleDeleteModal = (categoryId) => {
		setDeletingCategoryId(categoryId);
		setShowDeleteModal(true);
	  };
	  
	  const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingCategoryId(null);
	  };
	  
	  const handleConfirmDelete = async () => {
		try {
		  await axios.delete(`${API_BASE_URL}/delete-category/${deletingCategoryId}`);
		  fetchCategories(); // Refresh the categories list
		  handleCloseDeleteModal();
		} catch (error) {
		  console.error('Error deleting category:', error);
		  // Handle error (e.g., show an error message)
		}
	};


	return (
  <>
    <Header />
    <Sidebar />
    <main id="main" className="main">
      <Pagetitle page='Category' />

      <section className="section">
        {/* <div className="d-flex justify-content-end mb-3">
          <button className='btn btn-primary' onClick={handleShowModal}>Add Category</button>
        </div> */}
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr className='table-dark'>
              <th scope="col">Sr No</th>
              <th scope="col">Category Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <th scope="row">{index + 1}</th>
                <td>{category.name}</td>
                <td>
                  {/* <button className="btn btn-warning btn-sm m-2" onClick={() => handleEditModal(category)}>
                    <i className="fas fa-edit"></i> Edit
                  </button> */}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteModal(category._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add Category Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-info">
              <h5 className="modal-title">Add Category</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
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

      {showModal && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}

      {/* Edit Category Modal */}
      <div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-info">
              <h5 className="modal-title">Edit Category</h5>
              <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label htmlFor="editCategoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editCategoryName"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="Enter category name"
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

      {/* Delete Category Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h5 className="modal-title text-white">Confirm Deletion</h5>
              <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
            </div>
            <div className="modal-body">
              <h4>Are you sure you want to delete this category?</h4>
              <hr></hr>
              <h6>!!!Deleting this will also delete all the data related to this category including categories, tabs!!!</h6>
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

export default Categories;
