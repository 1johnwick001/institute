import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import JoditEditor from 'jodit-react';
import API_BASE_URL from '../../config/Config';

function CreateBlog() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); 

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
	if (!image) {
		alert('Please upload a blog image.');
		return;
	}

    const formData = new FormData();
    formData.append('content', content);
	formData.append('blogImage', image);
    

    try {
      const response = await fetch(`${API_BASE_URL}/create-blog`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blog created successfully', data);
        navigate('/blogs-list'); // Redirect to blogs list
      } else {
        console.error('Error creating blog');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page='Create Blog' />
		<form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

		
			<JoditEditor
			value={content}
			onChange={newContent => setContent(newContent)}
			/>
			<div className="mt-3 col-md-3">
			<label htmlFor="imageName" className="form-label">Blog Image Name</label>
			<input
				id="imageName"
				name='blogImage'
				className="form-control"
				type="file"
				accept="image/*"
				onChange={handleImageChange}
				required
			/>
			</div>
			<button className='mt-2 btn btn-primary w-100' type='submit'>Submit</button>
		</form>	
      </main>
    </>
  );
}

export default CreateBlog;
