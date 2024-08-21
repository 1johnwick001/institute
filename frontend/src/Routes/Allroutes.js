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

function Allroutes() {
	return (

		<Routes>
			<Route path='/' element={<Login />} />
			<Route path='/home' element={localStorage.getItem("is_Admin_loggedIn") ? <Home /> : <Navigate to="/" />} />
			{/* =========  category Url ======== */}
			<Route path='/all-category' element={localStorage.getItem("is_Admin_loggedIn") ? <AllCategories /> : <Navigate to="/" />} />
			<Route path='/category' element={localStorage.getItem("is_Admin_loggedIn") ? <Categories /> : <Navigate to="/" />} />
			<Route path='/subcategory' element={localStorage.getItem("is_Admin_loggedIn") ? <SubCategories /> : <Navigate to="/" />} />
			<Route path='/subsubcategory' element={localStorage.getItem("is_Admin_loggedIn") ? <SubSubCategories /> : <Navigate to="/" />} />
			{/* =========  Gallery Url ======== */}
			<Route path='/gallery' element={localStorage.getItem("is_Admin_loggedIn") ? <Gallery /> : <Navigate to="/" />} />
			<Route path='/banner' element={localStorage.getItem("is_Admin_loggedIn") ? <Banner /> : <Navigate to="/" />} />
			{/* ==========blog section ======= */}
			<Route path='/blogs-list' element={localStorage.getItem("is_Admin_loggedIn") ? <Blogs /> : <Navigate to="/" />} />
			<Route path='/create-blog' element={localStorage.getItem("is_Admin_loggedIn") ? <CreateBlog /> : <Navigate to="/" />} />
		</Routes>

	)
}

export default Allroutes