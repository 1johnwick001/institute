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


function Allroutes() {

	const isLoggedIn = localStorage.getItem("is_Admin_loggedIn") === 'true';
	return (

		<Routes>
			<Route path='/' element={<Login />} />
			<Route path='/home' element={isLoggedIn? <Home /> : <Navigate to="/" />} />
			{/* =========== Document section ================= */}
			<Route path='/doc-files' element={isLoggedIn? < DocFiles/> : <Navigate to="/" />} />
			{/* =========  category Url ======== */}
			<Route path='/all-category' element={isLoggedIn? <AllCategories /> : <Navigate to="/" />} />
			<Route path='/category' element={isLoggedIn? <Categories /> : <Navigate to="/" />} />
			<Route path='/subcategory' element={isLoggedIn? <SubCategories /> : <Navigate to="/" />} />
			<Route path='/subsubcategory' element={isLoggedIn? <SubSubCategories /> : <Navigate to="/" />} />
			{/* =========  Gallery Url ======== */}
			<Route path='/gallery' element={isLoggedIn? <Gallery /> : <Navigate to="/" />} />
			<Route path='/banner' element={isLoggedIn? <Banner /> : <Navigate to="/" />} />
			{/* ==========blog section ======= */}
			<Route path='/blogs-list' element={isLoggedIn? <Blogs /> : <Navigate to="/" />} />
			<Route path='/create-blog' element={isLoggedIn? <CreateBlog /> : <Navigate to="/" />} />
			<Route path='/edit-blog/:id' element={isLoggedIn? <EditBlog /> : <Navigate to="/" />} />
			{/* ==========Institute Banner section ======= */}
			<Route path='/institute-banner' element={isLoggedIn? <InstituteBanner /> : <Navigate to="/" />} />
			
		</Routes>

	)
}

export default Allroutes