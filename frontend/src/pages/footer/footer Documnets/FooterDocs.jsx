import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/sidebar/Sidebar';
import Pagetitle from '../../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../../config/Config';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function FooterDocFiles() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [footerCategories, setFooterCategories] = useState([]); // State for footer categories
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  const [tabs, setTabs] = useState([]); // State for tabs
  const [selectedTab, setSelectedTab] = useState(''); // State for selected tab

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const [docName, setDocName] = useState('');
  const [docFile, setDocFile] = useState(null); // State for document file

  const [data, setData] = useState([]); // State for fetched data

  // Fetch footer categories and document data from backend
  useEffect(() => {
    fetchFooterCategories();
    fetchData();
  }, []);

  const fetchFooterCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getFooter-categories`);
      setFooterCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching footer categories:', error);
      setFooterCategories([]);
    }
  };

  // Fetch tabs for a selected category
  const fetchTabs = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-tabs-by-category/${categoryId}`);
      setTabs(response.data.data); // Assuming the response contains tabs filtered by category
    } catch (error) {
      console.error('Error fetching tabs:', error);
      setTabs([]);
    }
  };

  // Update when category changes
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchTabs(categoryId); // Fetch tabs based on the selected category
  };

  // Fetch document data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-doc`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching document files:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // For editing 
    const editFormData = new FormData();
    editFormData.append('fileName', docName);
    if (docFile) editFormData.append('file', docFile);

    try {
      let response;
      if (isEditMode && currentDocId) {
        response = await axios.put(
          `${API_BASE_URL}/edit-doc/${currentDocId}`,
          editFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Correct content type for file uploads
            },
          }
        );
      } else {
        const formData = new FormData();
        formData.append('fileName', docName);
        
        if (docFile) formData.append('file', docFile);
        formData.append('category', selectedCategory);
        formData.append('tab', selectedTab); // Adding the tab if selected

        response = await axios.post(`${API_BASE_URL}/upload-doc`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Correct content type for file uploads
          },
        });
      }

      // Assuming the response contains the uploaded document with the URL
      if (response.data && response.data.document) {
        const uploadedDocument = response.data.document;
        console.log("Uploaded Document:", uploadedDocument); // Log the uploaded document
      }

      // Reset form and close modal
      resetForm();
      setShowModal(false);
      fetchData(); // Refresh data after successful submission
    } catch (error) {
      console.error('Error while calling API', error);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (row) => {
    setIsEditMode(true);
    setCurrentDocId(row._id);
    setDocName(row.fileName);
    setSelectedCategory(row.category);
    setShowModal(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (id) => {
    setDocToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-doc/${docToDelete}`);
      fetchData(); // Refresh data after successful deletion
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error while deleting document file', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to reset form
  const resetForm = () => {
    setDocName(''); // Reset document name
    setDocFile(null); // Reset document file
    setSelectedCategory(''); // Reset selected category
    setIsEditMode(false); // Reset edit mode
    setCurrentDocId(null); // Reset current document ID
  };

  const columns = [
    {
      name: 'Sr.No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Document Category Name',
      selector: (row) => row.category?.name || row.tab.name,
      sortable: true,
    },
    {
      name: 'Document Name',
      selector: (row) => row.fileName,
      sortable: true,
    },
    {
      name: 'Files',
      cell: (row) => (
        <i className="bi bi-filetype-pdf"></i>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleEditClick(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row._id)}>
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Document Files" />
        <section className="section">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Doc Files
            </button>
          </div>

          <DataTable
            className="data-table"
            columns={columns}
            data={data}
            pagination
            persistTableHead
            highlightOnHover
            striped
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#343a40', // Dark background
                  color: '#fff', // White text
                  fontSize: '18px', // Font size
                  padding: '5px', // Padding
                },
              },
              rows: {
                style: {
                  backgroundColor: '#fff', // Light background for rows
                  color: '#343a40',
                  fontSize: '17px',
                },
              },
              pagination: {
                style: {
                  border: '1px solid #413f3f', // Border for pagination
                  backgroundColor: 'white',
                  color: '#343a40', // Background color for pagination
                  fontSize: '16px',
                },
              },
            }}
          />
        </section>
      </main>
      {/* Add/Edit Modal */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-info">
              <h5 className="modal-title">
                {isEditMode ? 'Edit Document File' : 'Add Document File'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                aria-label="close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="docName" className="form-label">
                    Document Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="docName"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Select Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {footerCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {tabs.length > 0 && (
                  <div className="mb-3">
                    <label htmlFor="tab" className="form-label">
                      Select Tab
                    </label>
                    <select
                      className="form-select"
                      id="tab"
                      value={selectedTab}
                      onChange={(e) => setSelectedTab(e.target.value)}
                    >
                      <option value="">Select Tab</option>
                      {tabs.map((tab) => (
                        <option key={tab._id} value={tab._id}>
                          {tab.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="docFile" className="form-label">
                    Document File
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="docFile"
                    accept="application/pdf"
                    onChange={(e) => setDocFile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h5 className="modal-title">Delete Document File</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleDeleteCancel}
                aria-label="close"
              />
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this document file?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterDocFiles;
