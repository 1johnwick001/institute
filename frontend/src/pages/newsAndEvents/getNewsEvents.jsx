import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../config/Config';
import { useNavigate } from 'react-router-dom';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';


function GetNewsEvents() {

    const navigate = useNavigate();
    
    const [data , setData] = useState([])

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [factsIdToDelete, setFactsIdToDelete] = useState(null);

    useEffect(() => {
        fetchData();
      }, []);

      // Function to fetch data
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/news-events`);
            setData(response.data.data);
            
        } catch (error) {
           alert(error.message)
        }
    };

        // Function to handle delete button click
  const handleDeleteClick = (id) => {
    setFactsIdToDelete(id);
    setShowDeleteModal(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-news-events/${factsIdToDelete}`);
      fetchData(); // Refresh data after successful deletion
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error while deleting data', error);
      alert(error.message)
    }
  };

  // Function to truncate content
  const truncateContent = (content, length) => {
    const plainText = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
    return plainText.length > length ? `${plainText.substring(0, length)}...` : plainText;
};

  // Function to handle delete cancellation
  const handleDeleteCancellation = () => {
    setShowDeleteModal(false);
  };

    const columns = [

        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            width: '90px',
            sortable: true,
        },
        
        {
            name: ' title',
            selector: (row) => <div dangerouslySetInnerHTML={{ __html: truncateContent(row.title, 150) }} />,
            sortable: true,
        },
        {
            name: ' date',
            selector: (row) => row.date,
            
        },
        
        {
            name: 'Image',
            selector: row => row.images && row.images.length > 0 
                ? <img src={`${API_BASE_IMAGE_URL}/${row.images[0]}`} alt="News/Event" style={{ width: '55px', height: '55px' }} /> 
                : 'No image',
            width: '150px',
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button className="btn btn-warning btn-sm m-2" onClick={() => navigate(`/editNewsEvents/${row._id}`)}>
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row._id)}>
                        <i className="fas fa-trash"></i> Delete
                    </button>
                </>
            ),
        },
    ];


  return (
    <>
        <Header/>
        <Sidebar/>
        <main id="main" className="main">
            <Pagetitle page='Creaete News / Events' />
                <section className='section'>
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary'
                        onClick={()=>navigate('/newsAndEvents')}
                        >Add BOG 
                        </button>
                    </div>
                    <DataTable
                        className='data-table'
                        columns={columns}
                        data={data}
                        pagination
                        persistTableHead
                        highlightOnHover
                        striped
                        responsive
                        paginationPerPage={40} // Default rows per page
                        paginationRowsPerPageOptions={[10, 50, 100,200,500]}
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
                                    fontSize: '17px'
                                },
                            },
                            pagination: {
                                style: {
                                    border: '1px solid #413f3f', // Border for pagination
                                    backgroundColor: 'white',
                                    color: '#343a40', // Background color for pagination
                                    fontSize: '16px'
                                },
                            },
                        }}
                    />
                </section>
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
                    Are you sure you want to delete this Event?
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
        </main>
    </>
  )
}

export default GetNewsEvents