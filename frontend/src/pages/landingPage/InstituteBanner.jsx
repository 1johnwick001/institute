import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../config/Config';


function InstituteBanner() {
  // State for managing modal visibility and mode
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);

  // State for managing form data
  const [instituteName, setInstituteName] = useState('');
  const [instituteImage, setInstituteImage] = useState(null);
  const [instituteIcon, setInstituteIcon] = useState(null);
  const [instituteLink, setInstituteLink] = useState('');

  // State for storing current images and icons
  const [currentImageURL, setCurrentImageURL] = useState('');
  const [currentIconURL, setCurrentIconURL] = useState('');

  // State for fetching data
  const [data, setData] = useState([]);

  // State for managing delete modal visibility and banner ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-inst-banners`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData(); // Create FormData object
  
      // Append fields to FormData
      formData.append("instituteName", instituteName);
      formData.append("instituteLink", instituteLink);
  
      // Append the file only if it exists
      if (instituteImage) {
        formData.append("instituteImage", instituteImage);
      }
  
      if (isEditMode && currentBannerId) {
        await axios.put(
          `${API_BASE_URL}/edit-inst-banner/${currentBannerId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } } // Important for file uploads
        );
      } else {
        await axios.post(`${API_BASE_URL}/create-inst-banner`, formData, {
          headers: { "Content-Type": "multipart/form-data" }, // Important for file uploads
        });
      }
  
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error while calling API', error);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (row) => {
    setIsEditMode(true); // Set edit mode
    setCurrentBannerId(row._id); // Set current banner ID for editing
    setInstituteName(row.instituteName);
    setInstituteLink(row.instituteLink);
    setCurrentImageURL(row.instituteImage);
    setCurrentIconURL(row.instituteIcon);
    setShowModal(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (id) => {
    setBannerIdToDelete(id);
    setShowDeleteModal(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-inst-banner/${bannerIdToDelete}`);
      fetchData(); // Refresh data after successful deletion
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error while deleting data', error);
    }
  };

  // Function to handle delete cancellation
  const handleDeleteCancellation = () => {
    setShowDeleteModal(false);
  };


  // Function to reset form
  const resetForm = () => {
    setInstituteName('');
    setInstituteImage('');
    setInstituteIcon('');
    setInstituteLink('');
    setCurrentImageURL('');
    setCurrentIconURL('');
    setIsEditMode(false);
    setCurrentBannerId(null);
  };

  // Column configuration for the data table
  const columns = [
      {
        name: 'Sr.No.',
        selector: (row, index) => index + 1,
        sortable: true,
      },
      {
        name: 'Institute Name',
        selector: (row) => row.instituteName,
        sortable: true,
      },
      {
        name: 'Institute Link',
        selector: (row) => row.instituteLink,
        sortable: true,
      },
      {
        name: 'Institute Image',
        cell: (row) => (
          <img
            src={row.instituteImage}
            alt={row.instituteName}
            style={{ width: '55px', height: '45px', borderRadius: '15px' }}
          />
        ),
      },
      // {
      //   name: 'Institute Icon',
      //   cell: (row) => (
      //     <img
      //       src={row.instituteIcon}
      //       alt={row.instituteName}
      //       style={{ width: '45px', height: '45px', borderRadius: '25px' }}
      //     />
      //   ),
      // },
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
        <Pagetitle page="CDGI Banners" />
        <section className="section">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm(); // Reset form when opening in add mode
                setShowModal(true);
              }}
            >
              Add CDGI Banners
            </button>
          </div>
          {/* Data tables */}
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
                {isEditMode ? 'Edit CDGI Banner' : 'Add CDGI Banner'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="close"
              >
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="instituteName" className="form-label">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="instituteName"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    required
                  />
                </div>
                {isEditMode && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Current Institute Image</label>
                      <div>
                        <img
                          src={currentImageURL}
                          alt="Current Institute"
                          style={{ width: '55px', height: '55px', borderRadius: '35px' }}
                        />
                        
                      </div>
                    </div>
                    {/* <div className="mb-3">
                      <label className="form-label">Current Institute Icon</label>
                      <div>
                        <img
                          src={currentIconURL}
                          alt="Current Icon"
                          style={{ width: '55px', height: '55px', borderRadius: '35px' }}
                        />
                      </div>
                    </div> */}
                  </>
                )}
                <div className="mb-3">
                  <label htmlFor="instituteImage" className="form-label">
                    Institute Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="instituteImage"
                    onChange={(e) => setInstituteImage(e.target.files[0])}
                    accept="image/*"
                    required={!isEditMode} // Required only in add mode
                  />
                </div>
                  
                <div className="mb-3">
                  <label htmlFor="instituteLink" className="form-label">
                    Institute Link
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="instituteLink"
                    value={instituteLink}
                    onChange={(e) => setInstituteLink(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {isEditMode ? 'Update Banner' : 'Save Banner'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
      {/* Delete Confirmation Modal */}
      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleDeleteCancellation}
                aria-label="close"
              >
                <span aria-hidden="true"> &times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this banner?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirmation}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDeleteCancellation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default InstituteBanner;
