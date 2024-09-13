import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';  // Import DataTable
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DeleteModal from '../blog/DeleteModal';
import { useNavigate } from 'react-router-dom';

function ContactUs() {

    const [formData, setFormData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getContactUsForm`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.data);
                } else {
                    console.error('Error fetching blogs');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (applicationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteContactForm/${applicationId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setFormData(formData.filter(application => application._id !== applicationId));
                setShowModal(false);
            } else {
                console.error('Error deleting application');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            width: '80px',
        },   
        {
            name: ' Name',
            selector: row => row.name
        },
        {
            name: ' contact no.',
            selector: row => row.mobileNumber
        },
        {
            name: ' Email',
            selector: row => row.email
        },
        {
            name: 'Message',
            selector: row => row.message
        },
        
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/viewContactUSForm/${row._id}`)}
                    >
                        <i className="bi bi-eye"></i>
                    </button>
                    <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                        setSelectedApplication(row);  // Store the selected application
                        setShowModal(true);  // Show the modal
                    }}
                >
                    <i className="bi bi-trash"></i>
                </button>
                </>
            ),
            button: true,
        },
    ];

  return (
    <>
        <Header/>
        <Sidebar/>
        <main id="main" className="main">
            <Pagetitle page='Application Form Data' />
            <section className='section'>
                
                {/* datatables for blogs */}
                    <DataTable
                        className='data-table'
                            columns={columns}
                            data={formData}
                            pagination
                            highlightOnHover
                            persistTableHead
                            responsive
                            striped
                            pointerOnHover
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
                                    color:'#343a40',
                                    fontSize:'17px'
                                },
                            },
                            pagination: {
                                style: {
                                    border: '1px solid #413f3f', // Border for pagination
                                    backgroundColor: 'white',
                                    color:'#343a40', // Background color for pagination
                                    fontSize:'15px'
                                },
                            },
                        }}

                    />
                     {/* Modal for Delete Confirmation */}
                    {selectedApplication && (
                        <DeleteModal
                            show={showModal}
                            onHide={() => setShowModal(false)}  // Close the modal
                            onDelete={handleDelete}  // Call handleDelete on confirm
                            blogId={selectedApplication._id}  // Pass the application ID
                        />
                    )}
            </section>
        </main>
    </>
  )
}

export default ContactUs