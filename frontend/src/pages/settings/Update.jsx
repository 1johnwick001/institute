import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../config/Config";
import API_BASE_IMAGE_URL from "../../config/ImageConfig";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagetitle from "../../components/pagetitle/Pagetitle";

function EditSettings() {
  const { id } = useParams(); // Get setting ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    websiteName: "",
    Address: "",
    pinNo: "",
    contactNo: "",
    optionalContactNo: "",
    email: "",
    fbLink: "",
    instaLink: "",
    linkedinLink: "",
    twitterLink: "",
    youtubeLink: "",
    favIcon: "",
    headerLogo: "",
    extraLogo: [],
    footerLogo: "",
    favIconFile: null,
    headerLogoFile: null,
    footerLogoFile: null,
    extraLogoFiles: []
  });

  useEffect(() => {
    fetchSetting();
  }, []);

  // Fetch setting details by ID
  const fetchSetting = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-settings`);
      setFormData({
        ...response.data.data,
        favIconFile: null, // Reset file input fields when data is fetched
        headerLogoFile: null,
        footerLogoFile: null,
        extraLogoFiles: []
      });
    } catch (error) {
      console.error("Error fetching setting:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files });
  };

  const addExtraLogoField = () => {
    setFormData((prev) => ({
      ...prev,
      extraLogoFiles: [...prev.extraLogoFiles, null], // Add a new empty input field
    }));
  };

  // Handle file selection for extra logos
const handleExtraLogoChange = (e, index) => {
    const files = e.target.files;
    setFormData((prev) => {
      const updatedFiles = [...prev.extraLogoFiles];
      updatedFiles[index] = files[0]; // Store selected file at the correct index
      return { ...prev, extraLogoFiles: updatedFiles };
    });
  };
  
  // Remove a specific extra logo input
  const removeExtraLogo = (index) => {
    setFormData((prev) => {
      const updatedFiles = prev.extraLogoFiles.filter((_, i) => i !== index);
      return { ...prev, extraLogoFiles: updatedFiles };
    });
  };

  // Handle form submission (Update setting)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data with file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "extraLogo" && key !== "extraLogoFiles") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append files to FormData
    if (formData.favIconFile) formDataToSend.append("favIcon", formData.favIconFile[0]);
    if (formData.headerLogoFile) formDataToSend.append("headerLogo", formData.headerLogoFile[0]);
    if (formData.footerLogoFile) formDataToSend.append("footerLogo", formData.footerLogoFile[0]);
    formData.extraLogoFiles.forEach((file) => {
        if (file) formDataToSend.append("extraLogo", file); // Ensure only selected files are appended
      });

    try {
      await axios.put(`${API_BASE_URL}/settings-update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Settings updated successfully!");
      navigate("/settings"); // Redirect back to list page
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page="Edit Settings" />
        <section className="section">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label>Website Name</label>
              <input
                type="text"
                name="websiteName"
                className="form-control"
                value={formData.websiteName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Address</label>
              <textarea
                name="Address"
                className="form-control"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>PIN Code</label>
              <input
                type="text"
                name="pinNo"
                className="form-control"
                value={formData.pinNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Contact No</label>
              <input
                type="text"
                name="contactNo"
                className="form-control"
                value={formData.contactNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Optional Contact No</label>
              <input
                type="text"
                name="optionalContactNo"
                className="form-control"
                value={formData.optionalContactNo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Facebook Link</label>
              <input
                type="text"
                name="fbLink"
                className="form-control"
                value={formData.fbLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Instagram Link</label>
              <input
                type="text"
                name="instaLink"
                className="form-control"
                value={formData.instaLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>LinkedIn Link</label>
              <input
                type="text"
                name="linkedinLink"
                className="form-control"
                value={formData.linkedinLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Twitter Link</label>
              <input
                type="text"
                name="twitterLink"
                className="form-control"
                value={formData.twitterLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>YouTube Link</label>
              <input
                type="text"
                name="youtubeLink"
                className="form-control"
                value={formData.youtubeLink}
                onChange={handleChange}
              />
            </div>

            {/* File Inputs for logos */}
            <div className="mb-3">
              <label>Favicon</label>
              <input
                type="file"
                name="favIconFile"
                onChange={handleFileChange}
              />
              {formData.favIcon && (
                <div>
                  <img
                    src={`${API_BASE_IMAGE_URL}/${formData.favIcon}`}
                    alt="Favicon"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label>Header Logo</label>
              <input
                type="file"
                name="headerLogoFile"
                onChange={handleFileChange}
              />
              {formData.headerLogo && (
                <div>
                  <img
                    src={`${API_BASE_IMAGE_URL}/${formData.headerLogo}`}
                    alt="Header Logo"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
            <label>Extra Logos</label>
            {formData.extraLogoFiles.map((file, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                <input
                    type="file"
                    name={`extraLogoFiles-${index}`}
                    onChange={(e) => handleExtraLogoChange(e, index)}
                />
                <button
                    type="button"
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => removeExtraLogo(index)}
                >
                    Remove
                </button>
                </div>
            ))}
            <button
                type="button"
                className="btn btn-success btn-sm mt-2"
                onClick={addExtraLogoField}
            >
                Add More
            </button>

            {formData.extraLogo.length > 0 && (
                <div className="d-flex mt-3">
                {formData.extraLogo.map((logo, index) => (
                    <img
                    key={index}
                    src={`${API_BASE_IMAGE_URL}/${logo}`}
                    alt={`Extra Logo ${index + 1}`}
                    style={{ width: "80px", height: "auto", marginRight: "10px" }}
                    />
                ))}
                </div>
            )}
            </div>

            <div className="mb-3">
              <label>Footer Logo</label>
              <input
                type="file"
                name="footerLogoFile"
                onChange={handleFileChange}
              />
              {formData.footerLogo && (
                <div>
                  <img
                    src={`${API_BASE_IMAGE_URL}/${formData.footerLogo}`}
                    alt="Footer Logo"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default EditSettings;