import React from 'react';
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../config/Config';
import API_BASE_IMAGE_URL from '../../config/ImageConfig';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DeleteModal from '../blog/DeleteModal';



function BgBannerList() {

    const [blogs, setBlogs] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get-bgbanner`);
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data.data);
                } else {
                    console.error('Error fetching background banner');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchBlogs();
    }, []);



    // Function to handle edit
    const handleEdit = (id) => {
        navigate(`/edit-bgBanner/${id}`);
    };

    // Function to handle delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete-bgbanner/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBlogs(blogs.filter((blog) => blog._id !== id));
                setShowDeleteModal(false);
            } else {
                console.error('Error deleting bgbanner');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle navigation to create blog
    const handleCreate = () => {
        navigate('/create-bgBanner');
    };

    // Define DataTable columns
    const columns = [
        {
            name: 'Sr. No.',
            selector: (row, index) => index + 1,
            width: '80px',
        },
        
        {
            name: ' Heading',
            selector: row => row.heading,
            sortable: true,
        },
        
        {
            name: 'Sub Heading',
            selector: row => row.subHeading,
        },
        {
            name: 'Image',
            selector: row => row.image ? (
                <img 
                    src={`${API_BASE_IMAGE_URL}/${row.image}`} 
                    alt={row.heading} 
                    style={{ width: '75px', height: '75px', borderRadius: '35px' }} 
                />
            ) : 'No image',
            width: '150px',
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(row._id)}
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            setSelectedBlogId(row._id);
                            setShowDeleteModal(true);
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
    <Header />
    <Sidebar />
    <main id="main" className="main">
        <Pagetitle page='Background Banner' />
        <section className="section">
            <div className="d-flex justify-content-end mb-3">
                <button className='btn btn-info' onClick={handleCreate}>Create Background Banner </button>
            </div>
            {/* DataTable for Blogs */}
            <DataTable
            className='data-table'
                columns={columns}
                data={blogs}
                pagination
                highlightOnHover
                persistTableHead
                responsive
                striped
                pointerOnHover
                paginationPerPage={10} // Default rows per page
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

            {/* Delete Modal */}
            <DeleteModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                blogId={selectedBlogId}
            />
        </section>
    </main>
</>
  )
}

export default BgBannerList