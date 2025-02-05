import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import { useNavigate } from 'react-router-dom';



const CreateMultiple = () => {
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
    const [tabs, setTabs] = useState([]); // State for tabs
    const [selectedTab, setSelectedTab] = useState(''); // State for selected tab
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [images, setImages] = useState(['']); // Initialize with one empty input
  
  const navigate = useNavigate();

const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchTabs(categoryId); // Fetch tabs based on the selected category
};

 useEffect(() => {
        fetchCategories()
}, []);

const renderCategoryOptions = (categories) => {
    return categories.map((category) => (
        <React.Fragment key={category._id}>
            <option value={category._id}>{category.name}</option>
            {category.subcategories && renderCategoryOptions(category.subcategories)}
        </React.Fragment>
    ));
};

// Fetch Categories from backend
const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-categories`);
        setCategories(response.data.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
    }
};

// Fetch tabs for a selected category
const fetchTabs = async (categoryId) => {
    try {
    const response = await axios.get(`${API_BASE_URL}/get-tabs-by-category/${categoryId}`);
    setTabs(response.data.data); // Assuming the response contains tabs filtered by category
    } catch (error) {
    console.error('Error fetching tabs:', error);
    setTabs([]);
    }
};
  
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
    formData.append('category', selectedCategory);
    formData.append('tab', selectedTab); // Adding the tab if selected
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
      const response = await axios.post(`${API_BASE_URL}/create-multiple-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        navigate('/getMultipleImages');
      } else {
        console.error('Error creating multiple images');
      }
    } catch (error) {
      console.error('Error creating multiple images', error);
    }
  };

  return (
    <>
    <Header/>
    <Sidebar/>
    <main id="main" className="main">
    <Pagetitle page='Multiple Images' />
        <div className="container mt-5">
        
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Select Category</label>
                <select
                    id="category"
                    className="form-control"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Select a category</option>
                    {renderCategoryOptions(categories)}
                </select>
            </div>
            {Array.isArray(tabs) && tabs.length > 0 && (
            <div className="mb-3">
                    <label htmlFor="tab" className="form-label">Select Tab (optional)</label>
                <select
                id="tab"
                className="form-control"
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                >
                <option value="">Select a tab</option>
                {tabs.map((tab) => (
                    <option key={tab._id} value={tab._id}>{tab.name}</option>
                ))}
                </select>
            </div>
)}
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

export default CreateMultiple;