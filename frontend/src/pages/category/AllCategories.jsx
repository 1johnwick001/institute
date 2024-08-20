import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-category/${selectedCategoryId}`);
      setCategories(categories.filter(category => category._id !== selectedCategoryId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedCategoryId(null);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="All Categories" />

        <section className="section">
          <table className="table table-bordered table-striped table-hover">
            <thead className="thead-dark">
              <tr className='table-dark'>
                <th scope="col">Category</th>
                <th scope="col">Sub-Category</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <React.Fragment key={category._id}>
                  <tr>
                    <td>{category.name}</td>
                    <td>
                      {category.subcategories.length > 0 ? (
                        <table className="table table-bordered">
                          <tbody>
                            {category.subcategories.map((subcategory) => (
                              <React.Fragment key={subcategory._id}>
                                <tr>
                                  <td>{subcategory.name}</td>
                                  <td>
                                    {subcategory.subcategories.length > 0 ? (
                                      <table className="table table-bordered">
                                        <tbody>
                                          {subcategory.subcategories.map((subSubCategory) => (
                                            <tr key={subSubCategory._id}>
                                              <td>{subSubCategory.name}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <span>No Sub-Sub-Categories</span>
                                    )}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span>No Sub-Categories</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(category._id)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* Delete Confirmation Modal */}
        <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showDeleteModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this category and all related subcategories?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}
      </main>
    </>
  );
}

export default AllCategories;
