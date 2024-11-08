import React, { useState } from 'react';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import { useNavigate } from 'react-router-dom';



const CreateNewsEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [images, setImages] = useState(['']); // Initialize with one empty input
  
  const navigate = useNavigate();
  
  const handleImageChange = (index, e) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0]; // Save selected file
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']); // Add a new empty input
  };

  const removeImageField = (index) => {
    const newImages = images.filter((_, i) => i !== index); // Remove the specific input
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title); // Append title (HTML format from SunEditor)
    formData.append('date', date);
    formData.append('time', time);

    // Append each selected image
    images.forEach((image) => {
      if (image) {
        formData.append('images', image); // Only append if there's a file
      }
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/create-news-events`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        navigate('/getnewsAndEvents');
      } else {
        console.error('Error creating blog');
      }
    } catch (error) {
      console.error('Error creating news/event', error);
    }
  };

  return (
    <>
    <Header/>
    <Sidebar/>
    <main id="main" className="main">
    <Pagetitle page='News And Events' />
        <div className="container mt-5">
        
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
            <div className="mb-3">
            <label className="form-label">Date</label>
            <input 
                type="date" 
                className="form-control" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Time</label>
            <input 
                type="text"
                className="form-control" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required 
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Title</label>
            <SunEditor onChange={setTitle}
            setOptions={{
              // Set height if needed
              buttonList: [
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],  // Text styling buttons
                ['font', 'fontSize', 'formatBlock','fontColor', 'textStyle', 'paragraphStyle', 'hiliteColor'],  // Font and format options
                ['fullScreen', 'showBlocks', 'codeView']
                // ['align', 'horizontalRule', 'list', 'table']  
              ],
            }}
            setDefaultStyle="font-size:18px;"
            height='15vh'
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Images</label>
            {images.map((image, index) => (
                <div className="input-group mb-2" key={index}>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleImageChange(index, e)}
                />
                <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => removeImageField(index)}
                >
                    Remove
                </button>
                </div>
            ))}
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={addImageField}
            >
                Add Another Image
            </button>
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
        </form>
        </div>
    </main>
    </>
  );
};

export default CreateNewsEvent;