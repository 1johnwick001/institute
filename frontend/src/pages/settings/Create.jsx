import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/Config';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import { useNavigate } from 'react-router-dom';

const CreateSettings = () => {
    const [websiteName, setWebsiteName] = useState('');
    const [webDescription, setWebDescription] = useState('');
    const [Address, setAddress] = useState('');
    const [pinNo, setPinNo] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [optionalContactNo, setOptionalContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [fbLink, setFbLink] = useState('');
    const [instaLink, setInstaLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    
    const [favIcon, setFavIcon] = useState(null);
    const [headerLogo, setHeaderLogo] = useState(null);
    const [footerLogo, setFooterLogo] = useState(null);
    const [extraLogos, setExtraLogos] = useState([null]); // Initialize with one empty input

    const navigate = useNavigate();

    const handleExtraLogoChange = (index, e) => {
        const newExtraLogos = [...extraLogos];
        newExtraLogos[index] = e.target.files[0]; // Save selected file
        setExtraLogos(newExtraLogos);
    };

    const addExtraLogoField = () => {
        setExtraLogos([...extraLogos, null]); // Add a new empty input
    };

    const removeExtraLogoField = (index) => {
        const newExtraLogos = extraLogos.filter((_, i) => i !== index); // Remove the specific input
        setExtraLogos(newExtraLogos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('websiteName', websiteName);
        formData.append('webDescription', webDescription);
        formData.append('Address', Address);
        formData.append('pinNo', pinNo);
        formData.append('contactNo', contactNo);
        formData.append('optionalContactNo', optionalContactNo);
        formData.append('email', email);
        formData.append('fbLink', fbLink);
        formData.append('instaLink', instaLink);
        formData.append('linkedinLink', linkedinLink);
        formData.append('twitterLink', twitterLink);
        formData.append('youtubeLink', youtubeLink);

        // Append single file uploads
        if (favIcon) formData.append('favIcon', favIcon);
        if (headerLogo) formData.append('headerLogo', headerLogo);
        if (footerLogo) formData.append('footerLogo', footerLogo);

        // Append each selected extra logo
        extraLogos.forEach((logo) => {
            if (logo) {
                formData.append('extraLogo', logo); // Only append if there's a file
            }
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/settings`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                navigate('/settings'); // Redirect to settings page or wherever appropriate
            } else {
                console.error('Error creating settings');
            }
        } catch (error) {
            console.error('Error creating settings', error);
        }
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <Pagetitle page='Create Settings' />
                <div className="container mt-5">
                    <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                        <div className="mb-3">
                            <label className="form-label"> Website Name </label>
                            <input 
                                type="text"
                                className="form-control" 
                                value={websiteName} 
                                onChange={(e) => setWebsiteName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Web Description</label>
                            <textarea 
                                className="form-control" 
                                value={webDescription} 
                                onChange={(e) => setWebDescription(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={Address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Pin No</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={pinNo} 
                                onChange={(e) => setPinNo(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contact No</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={contactNo} 
                                onChange={(e) => setContactNo(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Optional Contact No</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={optionalContactNo} 
                                onChange={(e) => setOptionalContactNo(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Facebook Link</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={fbLink} 
                                onChange={(e) => setFbLink(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Instagram Link</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={instaLink} 
                                onChange={(e) => setInstaLink(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">LinkedIn Link</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={linkedinLink} 
                                onChange={(e) => setLinkedinLink(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Twitter Link</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={twitterLink} 
                                onChange={(e) => setTwitterLink(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">YouTube Link</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                value={youtubeLink} 
                                onChange={(e) => setYoutubeLink(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fav Icon</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={(e) => setFavIcon(e.target.files[0])} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Header Logo</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={(e) => setHeaderLogo(e.target.files[0])} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Footer Logo</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={(e) => setFooterLogo(e.target.files[0])} 
                                required 
                            />
                        </div>
                        < div className="mb-3">
                            <label className="form-label">Extra Logos</label>
                            {extraLogos.map((logo, index) => (
                                <div className="input-group mb-2" key={index}>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => handleExtraLogoChange(index, e)}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-danger" 
                                        onClick={() => removeExtraLogoField(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={addExtraLogoField}
                            >
                                Add Another Extra Logo
                            </button>
                        </div>
                        <button type="submit" className="btn btn-success">Submit</button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default CreateSettings;