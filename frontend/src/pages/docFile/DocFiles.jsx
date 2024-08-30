import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function DocFiles() {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  const [docName, setDocName] = useState(''); // State for document name
  console.log('name',docName)
  const [docFile, setDocFile] = useState(null); // State for document file

  const [data, setData] = useState([]); // State for fetched data

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const renderCategoryOptions = (categories) => {
    return categories.map((category) => (
        <React.Fragment key={category._id}>
            <option value={category._id}>{category.name}</option>
            {category.subcategories && renderCategoryOptions(category.subcategories)}
        </React.Fragment>
    ));
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

    const formData = new FormData();
    formData.append('fileName', docName);
    if (docFile) formData.append('file', docFile);
    formData.append('category', selectedCategory);

    try {
      if (isEditMode && currentDocId) {
        await axios.put(
          `${API_BASE_URL}/edit-doc-file/${currentDocId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/upload-doc`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset form and close modal
      setShowModal(false);
      resetForm();
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
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-doc/${id}`);
      fetchData(); // Refresh data after successful deletion
    } catch (error) {
      console.error('Error while deleting document file', error);
    }
  };

  // Function to reset form
  const resetForm = () => {
    setDocName('');
    setDocFile(null);
    setSelectedCategory('');
    setIsEditMode(false);
    setCurrentDocId(null);
  };

  const columns = [
    {
      name: 'Sr.No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Document Name',
      selector: (row) => row.fileName,
      sortable: true,
    },
    {
      name: 'Document type',
      selector: (row) => row.fileType,
      sortable: true,
    },
    {
      name: 'Files',
      cell: (row) => (
        <i class="bi bi-filetype-pdf"></i>
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
                onClick={() => setShowModal(false)}
                aria-label="close"
                >
                
                </button>
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
                    <label htmlFor="docFile" className="form-label">
                    Document File
                    </label>
                    <input
                    type="file"
                    className="form-control"
                    id="docFile"
                    onChange={(e) => setDocFile(e.target.files[0])}
                        // Assuming PDF files, adjust if needed
                    required={!isEditMode} // Required only in add mode
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                    Category
                    </label>
                    <select
                    className="form-control"
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    >
                    <option value="">Select a category</option>
                    {renderCategoryOptions(categories)}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isEditMode ? 'Update Document' : 'Save Document'}
                </button>
                </form>
            </div>
            </div>
        </div>
        </div>
        {/* Modal backdrop */}
        {showModal && <div className="modal-backdrop fade show"></div>}
        
    </>
  );
}

export default DocFiles;
