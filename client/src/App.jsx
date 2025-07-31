import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Add this

// User pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';

// Admin
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import AdminCalender from './pages/admin/AdminCalender';
import AddTrailer from './pages/admin/AddTrailer';

// Cashier
import CashierLayout from './pages/cashier/CashierLayout';
import CashierDashboard from './pages/cashier/CashierDashboard';
import CashierBookings from './pages/cashier/CashierBookings';
import CashierDate from './pages/cashier/CashierDate';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCashierRoute = location.pathname.startsWith('/cashier');

  return (
    <>
      <Toaster />
      {!isAdminRoute && !isCashierRoute && <Navbar />}

      <Routes>
        {/* ✅ User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/seats/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* ✅ Admin protected routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="admin-dashboard" element={<Dashboard />} />
          <Route path="admin-calender" element={<AdminCalender />} />
          <Route path="add-trailer" element={<AddTrailer />} />
        </Route>

        {/* ✅ Cashier protected routes */}
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute allow={["cashier"]}>
              <CashierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CashierDashboard />} />
          <Route path="bookings" element={<CashierBookings />} />
          <Route path="filter" element={<CashierDate />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isCashierRoute && <Footer />}
    </>
  );
};

export default App;
