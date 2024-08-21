import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';

import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
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

    // Function to handle edit
    const handleEdit = (id) => {
        console.log(`Edit blog with id ${id}`);
        // Implement edit functionality
    };

    // Function to handle delete
    const handleDelete = (id) => {
        console.log(`Delete blog with id ${id}`);
        // Implement delete functionality
    };

    // Function to handle navigation to create blog
    const handleCreate = () => {
        navigate('/create-blog'); // Navigate to the CreateBlog component
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
                            {blogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {blog.images ? <img src={blog.images} alt="Blog" style={{ width: '100px' }} /> : 'No image'}
                                    </td>
                                    <td>
                                        <div dangerouslySetInnerHTML={{ __html: truncateContent(blog.content, 250) }} />
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
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            <i className="bi bi-trash"></i> 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}

export default Blogs;
