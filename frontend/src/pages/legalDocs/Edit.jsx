import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import axios from 'axios';
import API_BASE_URL from '../../config/Config';
import TestSunEditorJsx from '../blog/Editor';

function EditLegal() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const navigate = useNavigate();
  const editor = useRef();

  // Optional: if you need the sunEditor instance
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  // Fetch the existing legal document when component mounts
  useEffect(() => {
    const fetchLegalDoc = async () => {
      try {
        // Retrieve JWT token from localStorage
        const response = await axios.get(`${API_BASE_URL}/get-legal-docs/${id}`);
        if (response.status === 200 && response.data.data) {
          const { title, content, documentType } = response.data.data;
          setTitle(title);
          setContent(content);
          setDocumentType(documentType);
        } else {
          alert('Failed to fetch legal document data.');
        }
      } catch (error) {
        console.error('Error fetching legal document', error);
      }
    };

    fetchLegalDoc();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (!content.trim()) {
      alert('Please enter the content.');
      return;
    }
    if (!documentType) {
      alert('Please select a document type.');
      return;
    }

    try {
      // Prepare payload as JSON
      const payload = { title, content, documentType };

      // Retrieve JWT token from localStorage
      const token = localStorage.getItem('token');

      const response = await axios.put(`${API_BASE_URL}/update-legal-docs/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 200) {
        navigate('/list-docs');
      } else {
        alert('Error updating legal document');
      }
    } catch (error) {
      const errMsg =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'An error occurred';
      alert(`Error updating legal document: ${errMsg}`);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Edit Legal Documents" />
        <section className="section">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter Title..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Document Type Selector */}
                <div className="mb-3">
                  <label htmlFor="documentType" className="form-label">Document Type</label>
                  <select
                    id="documentType"
                    name="documentType"
                    className="form-control"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    required
                  >
                    <option value="">-- Select Document Type --</option>
                    <option value="terms">Terms and Conditions</option>
                    <option value="privacy">Privacy Policy</option>
                  </select>
                </div>

                {/* Content Editor */}
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content</label>
                  <TestSunEditorJsx
                    value={content}
                    onChange={(newContent) => setContent(newContent)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default EditLegal;