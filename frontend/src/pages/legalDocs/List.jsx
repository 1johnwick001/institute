import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';  // Import DataTable
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DeleteModal from '../blog/DeleteModal';
import { useNavigate } from 'react-router-dom';

function ListLegal() {

    const [formData, setFormData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get-legal-docs`);
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

    // Function to truncate content
    const truncateContent = (content, length) => {
        const plainText = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
        return plainText.length > length ? `${plainText.substring(0, length)}...` : plainText;
    };

    const handleDelete = async (applicationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete-legal-docs/${applicationId}`, {
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
            name: '#',
            selector: (row, index) => index + 1,
            width: '50px',
        },   
        {
            name: ' Name',
            selector: row => row.title
        },
        {
            name: ' content',
            selector: row => <div dangerouslySetInnerHTML={{ __html: truncateContent(row.content, 150) }} />,
            wrap:true
            
        },
        {
            name: ' Document Type',
            selector: row => row.documentType,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/edit-legal-docs/${row._id}/prashant`)}
                    >
                        <i className="bi bi-pencil"></i>
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
            <Pagetitle page='Students Enquiry Form' />
            <section className='section'>
                <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-primary'
                        onClick={()=>navigate('/create-legal-docs')}
                        >Add Legal Docs
                        </button>
                </div>
                
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

export default ListLegal