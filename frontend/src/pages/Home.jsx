import React from 'react'
import Header from '../components/Header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';

function Home() {
  return (
        <div>
            <Header/>
            <Sidebar/>
            <Dashboard/>
        </div>
    )
}

export default Home