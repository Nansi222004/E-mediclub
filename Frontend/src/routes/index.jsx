import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import Shimmer from '../shared/components/Shimmer';
import ProtectedRoute from '../shared/components/ProtectedRoute';

// Lazy loading clinical pages for enhanced performance (User Panel)
const HomePage = lazy(() => import('../modules/user/pages/HomePage'));
const ProductDetailsPage = lazy(() => import('../modules/user/pages/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('../modules/user/pages/CategoriesPage'));
const SearchPage = lazy(() => import('../modules/user/pages/SearchPage'));
const CartPage = lazy(() => import('../modules/user/pages/CartPage'));
const CheckoutPage = lazy(() => import('../modules/user/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../modules/user/pages/OrdersPage'));
const ProfilePage = lazy(() => import('../modules/user/pages/ProfilePage'));
const DoctorAppointmentsPage = lazy(() => import('../modules/user/pages/DoctorAppointmentsPage'));
const LabTestsPage = lazy(() => import('../modules/user/pages/LabTestsPage'));
const DoctorBookingPage = lazy(() => import('../modules/user/pages/DoctorBookingPage'));
const LabTestBookingPage = lazy(() => import('../modules/user/pages/LabTestBookingPage'));
const LabDetailsPage = lazy(() => import('../modules/user/pages/LabDetailsPage'));
const ProductRatingsPage = lazy(() => import('../modules/user/pages/ProductRatingsPage'));


// Auth Page (Customer)
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'));

// Layouts (Admin & Vendor)
const AdminLayout = lazy(() => import('../modules/admin/layouts/AdminLayout'));
const VendorLayout = lazy(() => import('../modules/vendor/layouts/VendorLayout'));

// Super Admin Auth Page Modules
const AdminLoginPage = lazy(() => import('../modules/auth/admin/pages/AdminLoginPage'));
const AdminForgotPasswordPage = lazy(() => import('../modules/auth/admin/pages/AdminForgotPasswordPage'));
const AdminVerifyOtpPage = lazy(() => import('../modules/auth/admin/pages/AdminVerifyOtpPage'));
const AdminResetPasswordPage = lazy(() => import('../modules/auth/admin/pages/AdminResetPasswordPage'));

// Super Admin Page Modules
const AdminDashboard = lazy(() => import('../modules/admin/pages/AdminDashboard'));
const VendorManagement = lazy(() => import('../modules/admin/pages/VendorManagement'));
const ProductManagement = lazy(() => import('../modules/admin/pages/ProductManagement'));
const MedicinesPage = lazy(() => import('../modules/admin/pages/MedicinesPage'));
const OrdersManagement = lazy(() => import('../modules/admin/pages/OrdersManagement'));
const UsersManagement = lazy(() => import('../modules/admin/pages/UsersManagement'));
const DoctorManagement = lazy(() => import('../modules/admin/pages/DoctorManagement'));
const DoctorSpecialtyRegistry = lazy(() => import('../modules/admin/pages/DoctorSpecialtyRegistry'));
const LabTestsManagement = lazy(() => import('../modules/admin/pages/LabTestsManagement'));
const LabCategoriesRegistry = lazy(() => import('../modules/admin/pages/LabCategoriesRegistry'));
const BookingsManagement = lazy(() => import('../modules/admin/pages/BookingsManagement'));
const PaymentsManagement = lazy(() => import('../modules/admin/pages/PaymentsManagement'));
const ReportsManagement = lazy(() => import('../modules/admin/pages/ReportsManagement'));
const CMSManagement = lazy(() => import('../modules/admin/pages/CMSManagement'));
const SettingsPage = lazy(() => import('../modules/admin/pages/SettingsPage'));
const NotificationsPage = lazy(() => import('../modules/admin/pages/NotificationsPage'));
const ComplaintsManagement = lazy(() => import('../modules/admin/pages/ComplaintsManagement'));

const CitiesCoverage = lazy(() => import('../modules/admin/pages/CitiesCoverage'));
const PincodeManager = lazy(() => import('../modules/admin/pages/PincodeManager'));
const UnserviceableAreas = lazy(() => import('../modules/admin/pages/UnserviceableAreas'));
const HomeCollections = lazy(() => import('../modules/admin/pages/HomeCollections'));
const Prescriptions = lazy(() => import('../modules/admin/pages/Prescriptions'));

// Multi-Vendor Auth Page Modules
const PharmacyVendorAuth = lazy(() => import('../modules/vendor/pages/PharmacyVendorAuth'));
const PharmacySignup = lazy(() => import('../modules/vendor/pages/PharmacySignup'));
const LabLogin = lazy(() => import('../modules/vendor/pages/LabLogin'));
const LabSignup = lazy(() => import('../modules/vendor/pages/LabSignup'));
const DoctorLogin = lazy(() => import('../modules/vendor/pages/DoctorLogin'));
const DoctorSignup = lazy(() => import('../modules/vendor/pages/DoctorSignup'));

const VendorForgotPasswordPage = lazy(() => import('../modules/auth/vendor/pages/VendorForgotPasswordPage'));
const VendorVerifyOtpPage = lazy(() => import('../modules/auth/vendor/pages/VendorVerifyOtpPage'));
const OnboardingPending = lazy(() => import('../modules/vendor/pages/OnboardingPending'));

// Multi-Vendor Page Modules (Pharmacy)
const PharmacyVendorLayout = lazy(() => import('../modules/vendor/layouts/PharmacyVendorLayout'));
const VendorDashboard = lazy(() => import('../modules/vendor/pages/VendorDashboard'));
const MedicineCatalog = lazy(() => import('../modules/vendor/pages/MedicineCatalog'));
const VendorProductManagement = lazy(() => import('../modules/vendor/pages/VendorProductManagement'));
const VendorOrdersManagement = lazy(() => import('../modules/vendor/pages/VendorOrdersManagement'));
const VendorStocksManagement = lazy(() => import('../modules/vendor/pages/VendorStocksManagement'));
const VendorEarnings = lazy(() => import('../modules/vendor/pages/VendorEarnings'));
const VendorProfile = lazy(() => import('../modules/vendor/pages/VendorProfile'));

// Lab Vendor Page Modules
const LabVendorLayout = lazy(() => import('../modules/vendor/layouts/LabVendorLayout'));
const LabVendorDashboard = lazy(() => import('../modules/vendor/pages/LabVendorDashboard'));
const LabVendorTests = lazy(() => import('../modules/vendor/pages/LabVendorTests'));
const LabVendorBookings = lazy(() => import('../modules/vendor/pages/LabVendorBookings'));
const LabVendorProfile = lazy(() => import('../modules/vendor/pages/LabVendorProfile'));

// Doctor Vendor Page Modules
const DoctorVendorLayout = lazy(() => import('../modules/vendor/layouts/DoctorVendorLayout'));
const DoctorVendorDashboard = lazy(() => import('../modules/vendor/pages/DoctorVendorDashboard'));
const DoctorVendorSchedule = lazy(() => import('../modules/vendor/pages/DoctorVendorSchedule'));
const DoctorVendorPatients = lazy(() => import('../modules/vendor/pages/DoctorVendorPatients'));
const DoctorVendorProfile = lazy(() => import('../modules/vendor/pages/DoctorVendorProfile'));

// Minimal Suspense Fallback with branded shimmer treatment
const SuspenseFallback = () => (
  <div className="flex flex-col gap-6 p-4 md:p-6 w-full">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-white shadow-premium border border-slate-100 overflow-hidden">
        <div className="w-full h-full shimmer-element" />
      </div>
      <div className="flex-1">
        <div className="w-32 h-4 rounded shimmer-element mb-2" />
        <div className="w-40 h-3 rounded shimmer-element" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="md:col-span-2 h-48 md:h-56 bg-white rounded-3xl border border-slate-100 shadow-premium shimmer-element" />
      <div className="h-48 md:h-56 bg-white rounded-3xl border border-slate-100 shadow-premium shimmer-element" />
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
      {/* 1. Main User Module Layout Router */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="medicines" element={<CategoriesPage />} />
        <Route path="wellness" element={<CategoriesPage />} />
        <Route path="ayurveda" element={<CategoriesPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="track-orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="doctor-appointments" element={<DoctorAppointmentsPage />} />
        <Route path="doctors/:doctorId/book" element={<DoctorBookingPage />} />
        <Route path="lab-tests" element={<LabTestsPage />} />
        <Route path="lab-tests/:testId/book" element={<LabTestBookingPage />} />
        <Route path="labs/:labId" element={<LabDetailsPage />} />
        <Route path="rate/:orderId" element={<ProductRatingsPage />} />
      </Route>

      {/* Auth page routed outside layout so it doesn't show navigation bars */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Super Admin Auth Public Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="/admin/verify-otp" element={<AdminVerifyOtpPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      {/* 3. Super Admin Module Protected Router */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="medicines" element={<MedicinesPage />} />
        <Route path="medicines/add" element={<ProductManagement autoOpenAdd={true} />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="orders/medicines" element={<OrdersManagement />} />
        <Route path="orders/lab-bookings" element={<BookingsManagement defaultTab="Lab Tests" />} />
        <Route path="orders/appointments" element={<BookingsManagement defaultTab="Doctors" />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="patients" element={<UsersManagement />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="doctors-categories" element={<DoctorSpecialtyRegistry />} />
        <Route path="lab-tests" element={<LabTestsManagement />} />
        <Route path="lab-tests/add" element={<LabTestsManagement autoOpenAdd={true} />} />
        <Route path="lab-categories" element={<LabCategoriesRegistry />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="appointments" element={<BookingsManagement defaultTab="Doctors" />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="locations/cities" element={<CitiesCoverage />} />
        <Route path="locations/pincodes" element={<PincodeManager />} />
        <Route path="locations/gaps" element={<UnserviceableAreas />} />
        <Route path="home-collections" element={<HomeCollections />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="complaints" element={<ComplaintsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="cms" element={<CMSManagement />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* 4. Pharmacy Vendor Auth & Routes */}
      <Route path="/vendor/pharmacy/login" element={<PharmacyVendorAuth />} />
      <Route path="/vendor/pharmacy/signup" element={<PharmacySignup />} />
      <Route path="/vendor/pharmacy/forgot-password" element={<VendorForgotPasswordPage />} />
      
      <Route path="/vendor/pharmacy" element={<PharmacyVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        
        {/* Pharmacy Specific Catalog */}
        <Route path="medicines" element={<MedicineCatalog />} />
        
        {/* Fallbacks for other routes requested in the sidebar */}
        <Route path="products" element={<VendorProductManagement />} />
        <Route path="orders/*" element={<VendorOrdersManagement />} />
        <Route path="prescriptions/*" element={<VendorOrdersManagement />} />
        <Route path="categories/*" element={<VendorProductManagement />} />
        <Route path="inventory/*" element={<VendorStocksManagement />} />
        <Route path="promotions/*" element={<VendorEarnings />} />
        <Route path="customers" element={<VendorProfile />} />
        <Route path="delivery" element={<VendorOrdersManagement />} />
        <Route path="revenue" element={<VendorEarnings />} />
        <Route path="analytics" element={<VendorEarnings />} />
        <Route path="notifications" element={<VendorProfile />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="settings" element={<VendorProfile />} />
      </Route>

      {/* 5. Lab Vendor Auth & Routes */}
      <Route path="/vendor/lab/login" element={<LabLogin />} />
      <Route path="/vendor/lab/signup" element={<LabSignup />} />
      <Route path="/vendor/lab/forgot-password" element={<VendorForgotPasswordPage />} />

      <Route path="/vendor/lab" element={<LabVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<LabVendorDashboard />} />
        <Route path="tests" element={<LabVendorTests />} />
        <Route path="tests/add" element={<LabVendorTests />} />
        <Route path="bookings" element={<LabVendorBookings />} />
        <Route path="bookings/home-collections" element={<LabVendorBookings />} />
        <Route path="reports" element={<LabVendorBookings />} />
        <Route path="earnings" element={<VendorEarnings />} />
        <Route path="profile" element={<LabVendorProfile />} />
        <Route path="settings" element={<LabVendorProfile />} />
      </Route>

      {/* 6. Doctor Vendor Auth & Routes */}
      <Route path="/vendor/doctor/login" element={<DoctorLogin />} />
      <Route path="/vendor/doctor/signup" element={<DoctorSignup />} />
      <Route path="/vendor/doctor/forgot-password" element={<VendorForgotPasswordPage />} />
      <Route path="/vendor/onboarding-pending" element={<OnboardingPending />} />
      <Route path="/vendor/verify-otp" element={<VendorVerifyOtpPage />} />

      <Route path="/vendor/doctor" element={<DoctorVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorVendorDashboard />} />
        <Route path="schedule" element={<DoctorVendorSchedule />} />
        <Route path="appointments" element={<DoctorVendorPatients />} />
        <Route path="appointments/today" element={<DoctorVendorPatients />} />
        <Route path="consultations" element={<DoctorVendorPatients />} />
        <Route path="prescriptions" element={<DoctorVendorPatients />} />
        <Route path="availability" element={<DoctorVendorSchedule />} />
        <Route path="earnings" element={<VendorEarnings />} />
        <Route path="patients" element={<DoctorVendorPatients />} />
        <Route path="profile" element={<DoctorVendorProfile />} />
        <Route path="settings" element={<DoctorVendorProfile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
