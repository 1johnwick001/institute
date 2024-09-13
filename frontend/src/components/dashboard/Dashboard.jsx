import React, { useEffect, useState } from 'react'
import Pagetitle from '../../components/pagetitle/Pagetitle';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/Config';

function Dashboard() {

	const navigate = useNavigate();

	const [dashboardStats, setDashboardStats] = useState({
		totalCategories: 0,
		totalImages: 0,
		totalBannerImages: 0,
		totalBlogs: 0,
		totalApplicationForms: 0,
	})
	
	// for fetching dashboard stats
	const fetchDashboardStats = async () => {
		try {
			
			const response = await fetch(`${API_BASE_URL}/get-dashboard`);
			if (response.ok) {
				const data = await response.json();
				setDashboardStats(data.data)
			} else {
				console.error('Error while fetching data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	// fetchin data when component mounts

	useEffect(()=>{
		fetchDashboardStats()
	},[]);


	

	return (
		<main id="main" className="main">
		  <Pagetitle page='Dashboard' />
		  <hr />
		  <section className="section dashboard">
			<div className="row">
			  {/* Left side columns */}
			  <div className="col">
				<div className="row">
				  {/* Total Categories Card */}
				  <div className="col-xxl-3 col-md-6">
					<div className="card info-card sales-card">
					  <div className="card-body">
						<h5 className="card-title"><span>Total Main Categories</span></h5>
						<div className="d-flex align-items-center">
						  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
							<i className="bi bi-columns-gap" />
						  </div>
						  <div className="ps-3  ">
							<h6>{dashboardStats.totalCategories}</h6>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				  {/* End Total Categories Card */}
	
				  {/* Total Gallery Items Card */}
				  <div className="col-xxl-3 col-md-6">
					<div className="card info-card revenue-card">
					  <div className="card-body">
						<h5 className="card-title"><span>Total Gallery Items</span></h5>
						<div className="d-flex align-items-center">
						  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
							<i className="bi bi-images" />
						  </div>
						  <div className="ps-3">
							<h6>{dashboardStats.totalImages}</h6>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				  {/* End Total Gallery Items Card */}
	
				  {/* Total Banner Images Card */}
				  <div className="col-xxl-3 col-md-6">
					<div className="card info-card customers-card">
					  <div className="card-body">
						<h5 className="card-title"><span>Total Banner Images</span></h5>
						<div className="d-flex align-items-center">
						  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
							<i className="bi bi-card-image" />
						  </div>
						  <div className="ps-3">
							<h6>{dashboardStats.totalBannerImages}</h6>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				  {/* End Total Banner Images Card */}
	
				  {/* Total Blogs Card */}
				  <div className="col-xxl-3 col-md-6">
					<div className="card info-card blogs-card">
					  <div className="card-body">
						<h5 className="card-title"><span>Total Blogs</span></h5>
						<div className="d-flex align-items-center">
						  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
							<i className="bi bi-journal-richtext" />
						  </div>
						  <div className="ps-3">
							<h6>{dashboardStats.totalBlogs}</h6>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				  {/* End Total Blogs Card */}
				</div>
			  </div>
			  {/* End Left side columns */}
			  
			</div>
			<div className="col">
				<div className="row">
				  {/* Total Application Forms data */}
				  <div className="col-xxl-3 col-md-6">
					<div className="card info-card application-card">
					  <div className="card-body">
						<h5 className="card-title"><span>Total Application Forms Submitted</span></h5>
						<div className="d-flex align-items-center">
						  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
							<i className="bi bi-clipboard-data" />
						  </div>
						  <div className="ps-3  ">
							<h6>{dashboardStats.totalApplicationForms}</h6>
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				  {/* End Total Application Forms data*/}
				</div>
			  </div>
		  </section>
		</main>
	  );
}

export default Dashboard