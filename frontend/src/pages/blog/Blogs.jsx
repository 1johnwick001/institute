import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import DeleteModal from './DeleteModal';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Current page state
    const [blogsPerPage] = useState(5);  // Number of blogs per page
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get-blogs`);
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data.data);
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

    // Calculate the range of blogs to show on the current page
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Function to handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to handle edit
    const handleEdit = (id) => {
        navigate(`/edit-blog/${id}`);
    };

    // Function to handle delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete-blog/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBlogs(blogs.filter((blog) => blog._id !== id));
                setShowDeleteModal(false); // Hide modal after delete
            } else {
                console.error('Error deleting blog');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle navigation to create blog
    const handleCreate = () => {
        navigate('/create-blog');
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Blogs List' />
                <section className="section">
                    <div className="d-flex justify-content-end mb-3">
                        <button className='btn btn-info' onClick={handleCreate}>Create Blog Post</button>
                    </div>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className='thead-dark'>
                            <tr className='table-dark'>
                                <th>Sr. No.</th>
                                <th>Image</th>
                                <th>Content</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBlogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{indexOfFirstBlog + index + 1}</td>
                                    <td>
                                        {blog.images ? <img src={blog.images} alt="Blog" style={{ width: '75px', height: '75px', borderRadius: '15px' }} /> : 'No image'}
                                    </td>
                                    <td>
                                        <div dangerouslySetInnerHTML={{ __html: truncateContent(blog.content, 180) }} />
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(blog._id)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                setSelectedBlogId(blog._id);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <nav>
                        <ul className="pagination">
                            {[...Array(Math.ceil(blogs.length / blogsPerPage)).keys()].map(number => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <a onClick={() => paginate(number + 1)} className="page-link">
                                        {number + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

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
    );
}

export default Blogs;
