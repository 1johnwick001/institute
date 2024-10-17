import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Categories from '../pages/category/Categories'
import SubCategories from '../pages/category/SubCategories'
import SubSubCategories from '../pages/category/SubSubCategories'
import AllCategories from '../pages/category/AllCategories'
import Gallery from '../pages/gallery/Gallery'
import Banner from '../pages/Banner'
import CreateBlog from '../pages/blog/CreateBlog'
import Blogs from '../pages/blog/Blogs'
import EditBlog from '../pages/blog/EditBlog'
import InstituteBanner from '../pages/landingPage/InstituteBanner'
import DocFiles from '../pages/docFile/DocFiles'
import FactInfo from '../pages/factsInfo/FactInfo'
import Bog from '../pages/BOG/Bog'
import CreateEditBog from '../pages/BOG/CreateEditBog'
import SuperSubCateg from '../pages/category/SuperSubCateg'
import ApplicationForm from '../pages/applicationForm/ApplicationForm'
import ViewApplicationForm from '../pages/applicationForm/ViewApplicationForm'
import ContactUs from '../pages/ContactUsForm/ContactUs'
import ViewContactUs from '../pages/ContactUsForm/ViewContactUs'
import Tabs from '../pages/tabs/Tabs'
import FeedbackForm from '../pages/feedbackForm/FeedbackForm'
import ViewFeedback from '../pages/feedbackForm/ViewFeedback'
import FooterCategories from '../pages/footer/FooterCategories'
import FooterDocFiles from '../pages/footer/footer Documnets/FooterDocs'
import StudentEnquirey from '../pages/studentEnquirey/StudentEnquirey'
import ViewStudentEnquirey from '../pages/studentEnquirey/ViewStudentEnq'
import ContactUsAddress from '../pages/ContactUsForm/ContactUsAddress'
import EditContactUsAddress from '../pages/ContactUsForm/EditContactUsAddress'
import Urls from '../pages/url/Urls'
import NewsAndEvents from '../pages/newsAndEvents/NewsAndEvents'
import GetNewsEvents from '../pages/newsAndEvents/getNewsEvents'
import EditNewsEvents from '../pages/newsAndEvents/EditNewsEvents'


function Allroutes() {

	const isLoggedIn = localStorage.getItem("is_Admin_loggedIn") === 'true';

	return (

		<Routes>
			<Route path='/' element={<Login />} />
			<Route path='/home' element={isLoggedIn? <Home /> : <Navigate to="/" />} />
			{/* =========== Document section ================= */}
			<Route path='/doc-files' element={isLoggedIn? < DocFiles/> : <Navigate to="/" />} />
			{/* =========== facts info section ================= */}
			<Route path='/fact-info' element={isLoggedIn? < FactInfo/> : <Navigate to="/" />} />
			{/* =========== BOG info section ================= */}
			<Route path='/bog-details' element={isLoggedIn? < Bog/> : <Navigate to="/" />} />
			<Route path='/create-edit' element={isLoggedIn? < CreateEditBog/> : <Navigate to="/" />} />
			<Route path="/create-edit/:id?" element={<CreateEditBog />} />
			{/* =========  category Url ======== */}
			<Route path='/all-category' element={isLoggedIn? <AllCategories /> : <Navigate to="/" />} />
			<Route path='/category' element={isLoggedIn? <Categories /> : <Navigate to="/" />} />
			<Route path='/subcategory' element={isLoggedIn? <SubCategories /> : <Navigate to="/" />} />
			<Route path='/subsubcategory' element={isLoggedIn? <SubSubCategories /> : <Navigate to="/" />} />
			<Route path='/supersubcategory' element={isLoggedIn? <SuperSubCateg /> : <Navigate to="/" />} />

			{/* tabs data */}
			<Route path='/tabs-data' element={isLoggedIn? <Tabs /> : <Navigate to="/" />} />
			
			{/* =========  Gallery Url ======== */}
			<Route path='/gallery' element={isLoggedIn? <Gallery /> : <Navigate to="/" />} />
			<Route path='/banner' element={isLoggedIn? <Banner /> : <Navigate to="/" />} />
			{/* ==========blog section ======= */}
			<Route path='/blogs-list' element={isLoggedIn? <Blogs /> : <Navigate to="/" />} />
			<Route path='/create-blog' element={isLoggedIn? <CreateBlog /> : <Navigate to="/" />} />
			<Route path='/edit-blog/:id' element={isLoggedIn? <EditBlog /> : <Navigate to="/" />} />
			{/* ==========Institute Banner section ======= */}
			<Route path='/institute-banner' element={isLoggedIn? <InstituteBanner /> : <Navigate to="/" />} />
			{/* ========== Application Form section ======= */}
			<Route path='/application-form' element={isLoggedIn? <ApplicationForm /> : <Navigate to="/" />} />
			<Route path='/view-application-form/:id' element={isLoggedIn? <ViewApplicationForm /> : <Navigate to="/" />} />
			{/* contact us form */}
			<Route path='/contactUSForm' element={isLoggedIn? <ContactUs /> : <Navigate to="/" />} />
			<Route path='/viewContactUSForm/:id' element={isLoggedIn? <ViewContactUs /> : <Navigate to="/" />} />

			{/* Contact us address form */}
			<Route path='/contactUSAddressForm' element={isLoggedIn? <ContactUsAddress /> : <Navigate to="/" />} />
			<Route path='/edit-contact-us-address/:id' element={isLoggedIn? <EditContactUsAddress /> : <Navigate to="/" />} />
			

			{/* feedback  form */}
			<Route path='/feedbackForm' element={isLoggedIn? <FeedbackForm /> : <Navigate to="/" />} />
			<Route path='/viewFeedback/:id' element={isLoggedIn? <ViewFeedback /> : <Navigate to="/" />} />

			{/* {footer path} */}
			<Route path='/footerCateg' element={isLoggedIn? <FooterCategories /> : <Navigate to="/" />} />
			<Route path='/footer-doc-files' element={isLoggedIn? <FooterDocFiles /> : <Navigate to="/" />} />


			{/* student enquirey form */}
			<Route path='/student-enquirey' element={isLoggedIn? <StudentEnquirey /> : <Navigate to="/" />} />
			<Route path='/view-student-enquirey/:id' element={isLoggedIn? <ViewStudentEnquirey /> : <Navigate to="/" />} />

			<Route path='/urls' element={isLoggedIn? <Urls /> : <Navigate to="/" />} />

			<Route path='/getnewsAndEvents' element={isLoggedIn? <GetNewsEvents /> : <Navigate to="/" />} />
			<Route path='/newsAndEvents' element={isLoggedIn? <NewsAndEvents /> : <Navigate to="/" />} />
			<Route path='/editNewsEvents/:id' element={isLoggedIn? <EditNewsEvents /> : <Navigate to="/" />} />
			
		</Routes>

	)
}

export default Allroutes