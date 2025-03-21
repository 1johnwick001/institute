import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import axios from 'axios';
import API_BASE_URL from '../../config/Config';
import TestSunEditorJsx from '../blog/Editor';

function CreateLegal() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const navigate = useNavigate();
  const editor = useRef();

  // Optional: if you need the sunEditor instance
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

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

      const response = await axios.post(`${API_BASE_URL}/create-legal-docs`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.status === 201) {
        navigate('/list-docs');
      } else {
        alert('Error creating legal document');
      }
    } catch (error) {
      // Extract error message from response if available, else generic error message.
      const errMsg =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        'An error occurred';
      alert(`Error creating legal document: ${errMsg}`);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Create Legal Documents" />
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

export default CreateLegal;