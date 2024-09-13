import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function SubCategories() {
	const [showModal, setShowModal] = useState(false);
	const [categoryName, setCategoryName] = useState('');
	const [parentId, setParentId] = useState('');
	const [categories, setCategories] = useState([]);
	const [subcategories, setSubcategories] = useState([]);

	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [editSubCategory, setEditSubCategory] = useState(null);
	const [deletingSubCategoryId, setDeletingSubCategoryId] = useState(null);
	const [editSubCategoryName, setEditSubCategoryName] = useState('');


	const [categoryType, setCategoryType] = useState('')



	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setShowModal(false);
		setCategoryName('');
		setParentId('');
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/get-categories`);
			setCategories(response.data.data); // Ensure you're setting the correct data here
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const fetchSubcategories = async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/get-categories`);
			setSubcategories(response.data.data.flatMap(category => category.subcategories)); // Flatten subcategories
		} catch (error) {
			console.error('Error fetching subcategories:', error);
		}
	};

	useEffect(() => {
		fetchCategories();
		fetchSubcategories();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_BASE_URL}/create-category`, { name: categoryName, parentId, type: categoryType, });
			fetchSubcategories(); // Refresh the subcategories list
			handleCloseModal();
		} catch (error) {
			console.error('Error adding subcategory:', error);
		}
	};

	const handleEditModal = (subcategory) => {
		setEditSubCategory(subcategory);
		setEditSubCategoryName(subcategory.name);
		setShowEditModal(true);
	  };
	  
	  const handleCloseEditModal = () => {
		setShowEditModal(false);
		setEditSubCategory(null);
		setEditSubCategoryName('');
	  };
	  
	  const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
		  await axios.put(`${API_BASE_URL}/update-category/${editSubCategory._id}`, { name: editSubCategoryName });
		  fetchSubcategories(); // Refresh the subcategories list
		  handleCloseEditModal();
		} catch (error) {
		  console.error('Error editing subcategory:', error);
		}
	  };

	const handleDeleteModal = (subcategoryId) => {
		setDeletingSubCategoryId(subcategoryId);
		setShowDeleteModal(true);
		};
		
		const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
		setDeletingSubCategoryId(null);
		};
		
		const handleConfirmDelete = async () => {
		try {
			await axios.delete(`${API_BASE_URL}/delete-category/${deletingSubCategoryId}`);
			fetchSubcategories(); // Refresh the subcategories list
			handleCloseDeleteModal();
		} catch (error) {
			console.error('Error deleting subcategory:', error);
		}
	};

	return (
		<>
		  <Header />
		  <Sidebar />
		  <main id="main" className="main">
			<Pagetitle page='Sub-Category' />
	  
			<section className="section">
			  <div className="d-flex justify-content-end mb-3">
				<button className='btn btn-primary' onClick={handleShowModal}>Add Sub-Category</button>
			  </div>
			  <table className="table table-bordered table-striped table-hover">
				<thead className="thead-dark">
				  <tr className='table-dark'>
					<th scope="col">Sr No</th>
					<th scope="col">Parent Category</th>
					<th scope="col">Sub-Category Name</th>
					<th scope="col">Action</th>
				  </tr>
				</thead>
				<tbody>
				  {subcategories.map((subcategory, index) => (
					<tr key={subcategory._id}>
					  <th scope="row">{index + 1}</th>
					  <td>{subcategory.parent ? subcategory.parent.name : 'N/A'}</td>
					  <td>{subcategory.name}</td>
					  <td>
						<button className="btn btn-warning btn-sm m-2" onClick={() => handleEditModal(subcategory)}>
						  <i className="fas fa-edit"></i> Edit
						</button>
						<button className="btn btn-danger btn-sm" onClick={() => handleDeleteModal(subcategory._id)}>
						  <i className="fas fa-trash"></i> Delete
						</button>
					  </td>
					</tr>
				  ))}
				</tbody>
			  </table>
			</section>
	  
			{/* Add Sub-Category Modal */}
			<div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
			  <div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
				  <div className="modal-header bg-info">
					<h5 className="modal-title">Add Sub-Category</h5>
					<button type="button" className="btn-close" onClick={handleCloseModal}></button>
				  </div>
				  <div className="modal-body">
					<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="parentId" className="form-label">Parent Category</label>
						<select
						  className="form-control"
						  id="parentId"
						  value={parentId}
						  onChange={(e) => setParentId(e.target.value)}
						  required
						>
						  <option value="">Select Parent Category</option>
						  {categories.map(category => (
							<option key={category._id} value={category._id}>{category.name}</option>
						  ))}
						</select>
					  </div>
					  <div className="mb-3">
						<label htmlFor="categoryName" className="form-label">Sub-Category Name</label>
						<input
						  type="text"
						  className="form-control"
						  id="categoryName"
						  value={categoryName}
						  onChange={(e) => setCategoryName(e.target.value)}
						  placeholder="Enter sub-category name"
						  required
						/>
					  </div>
					  <div className="mb-3">
                <label htmlFor="categoryType" className="form-label">Type</label>
                <select
                  className="form-control"
                  id="categoryType"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="pdf">PDF</option>
                  <option value="text">Text</option>
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
	  
			{/* Edit Sub-Category Modal */}
			<div className={`modal fade ${showEditModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showEditModal ? 'block' : 'none' }}>
			  <div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
				  <div className="modal-header bg-info">
					<h5 className="modal-title">Edit Sub-Category</h5>
					<button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
				  </div>
				  <div className="modal-body">
					<form onSubmit={handleEditSubmit}>
					  <div className="mb-3">
						<label htmlFor="editSubCategoryName" className="form-label">Sub-Category Name</label>
						<input
						  type="text"
						  className="form-control"
						  id="editSubCategoryName"
						  value={editSubCategoryName}
						  onChange={(e) => setEditSubCategoryName(e.target.value)}
						  placeholder="Enter sub-category name"
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
	  
			{/* Delete Sub-Category Confirmation Modal */}
			<div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
			  <div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
				  <div className="modal-header bg-danger">
					<h5 className="modal-title text-white">Confirm Deletion</h5>
					<button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
				  </div>
				  <div className="modal-body">
					<p>Are you sure you want to delete this sub-category?</p>
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

export default SubCategories;
