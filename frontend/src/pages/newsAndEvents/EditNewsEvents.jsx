import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Pagetitle from '../../components/pagetitle/Pagetitle';
import API_BASE_URL from '../../config/Config';

const EditNewsEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchNewsEvent();
  }, []);

  const fetchNewsEvent = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/news-eventsbyid/${id}`);
      const { title, date, time } = response.data;
      setTitle(title);
      setDate(date);
      setTime(time);
    } catch (error) {
      console.error('Error fetching news/event data', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/edit-news-events/${id}`, {
        title,
        date,
        time
      });
      navigate('/getnewsAndEvents'); // Redirect after success
    } catch (error) {
      console.error('Error updating news/event', error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Pagetitle page='Edit News/Event' />
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
              <SunEditor setContents={title} onChange={setTitle} />
            </div>
            <button type="submit" className="btn btn-success">Update</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditNewsEvents;