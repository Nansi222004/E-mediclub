import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';

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
const AuthPage = lazy(() => import('../modules/auth/user/pages/AuthPage'));

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
const RejectedScreen = lazy(() => import('../modules/vendor/pages/RejectedScreen'));
const ApprovedScreen = lazy(() => import('../modules/vendor/pages/ApprovedScreen'));

// Multi-Vendor Page Modules (Pharmacy)
const PharmacyVendorLayout = lazy(() => import('../modules/vendor/layouts/PharmacyVendorLayout'));
const VendorDashboard = lazy(() => import('../modules/vendor/pages/VendorDashboard'));
const MedicineCatalog = lazy(() => import('../modules/vendor/pages/MedicineCatalog'));
const VendorProductManagement = lazy(() => import('../modules/vendor/pages/VendorProductManagement'));
const VendorOrdersManagement = lazy(() => import('../modules/vendor/pages/VendorOrdersManagement'));
const VendorStocksManagement = lazy(() => import('../modules/vendor/pages/VendorStocksManagement'));
const VendorEarnings = lazy(() => import('../modules/vendor/pages/VendorEarnings'));
const VendorNotifications = lazy(() => import('../modules/vendor/pages/VendorNotifications'));
const VendorCustomers = lazy(() => import('../modules/vendor/pages/VendorCustomers'));
const VendorPrescriptionManagement = lazy(() => import('../modules/vendor/pages/VendorPrescriptionManagement'));
const VendorPrescriptionDetail = lazy(() => import('../modules/vendor/pages/VendorPrescriptionDetail'));
const VendorMedicineAddWizard = lazy(() => import('../modules/vendor/pages/VendorMedicineAddWizard'));
const VendorMedicineDetails = lazy(() => import('../modules/vendor/pages/VendorMedicineDetails'));
const VendorProfile = lazy(() => import('../modules/vendor/pages/VendorProfile'));
const VendorServiceAreas = lazy(() => import('../modules/vendor/pages/VendorServiceAreas'));
const VendorPromotions = lazy(() => import('../modules/vendor/pages/VendorPromotions'));
const VendorAnalytics = lazy(() => import('../modules/vendor/pages/VendorAnalytics'));
const VendorSettings = lazy(() => import('../modules/vendor/pages/VendorSettings'));

// Lab Vendor Page Modules
const LabVendorLayout = lazy(() => import('../modules/vendor/layouts/LabVendorLayout'));
const LabVendorDashboard = lazy(() => import('../modules/vendor/pages/LabVendorDashboard'));
const LabVendorProfile = lazy(() => import('../modules/vendor/pages/LabVendorProfile'));
const TestOrders = lazy(() => import('../modules/vendor/pages/TestOrders'));
const HomeCollection = lazy(() => import('../modules/vendor/pages/HomeCollection'));
const TestsManagement = lazy(() => import('../modules/vendor/pages/TestsManagement'));
const TestPackages = lazy(() => import('../modules/vendor/pages/TestPackages'));
const UploadReportsPage = lazy(() => import('../modules/vendor/pages/UploadReportsPage'));
const ReportHistory = lazy(() => import('../modules/vendor/pages/ReportHistory'));
const Customers = lazy(() => import('../modules/vendor/pages/Customers'));
const ReviewsRatings = lazy(() => import('../modules/vendor/pages/ReviewsRatings'));
const LabVendorSlots = lazy(() => import('../modules/vendor/pages/LabVendorSlots'));
const LabVendorAnalytics = lazy(() => import('../modules/vendor/pages/LabVendorAnalytics'));
const LabVendorServiceAreas = lazy(() => import('../modules/vendor/pages/LabVendorServiceAreas'));

// Doctor Vendor Page Modules
const DoctorVendorLayout = lazy(() => import('../modules/vendor/layouts/DoctorVendorLayout'));
const DoctorVendorDashboard = lazy(() => import('../modules/vendor/pages/DoctorVendorDashboard'));
const DoctorVendorSchedule = lazy(() => import('../modules/vendor/pages/DoctorVendorSchedule'));
const DoctorVendorPatients = lazy(() => import('../modules/vendor/pages/DoctorVendorPatients'));
const DoctorVendorProfile = lazy(() => import('../modules/vendor/pages/DoctorVendorProfile'));
const DoctorVendorAppointments = lazy(() => import('../modules/vendor/pages/DoctorVendorAppointments'));
const DoctorVendorConsultations = lazy(() => import('../modules/vendor/pages/DoctorVendorConsultations'));
const DoctorVendorPrescriptions = lazy(() => import('../modules/vendor/pages/DoctorVendorPrescriptions'));
const DoctorVendorAnalytics = lazy(() => import('../modules/vendor/pages/DoctorVendorAnalytics'));
const DoctorVendorReviews = lazy(() => import('../modules/vendor/pages/DoctorVendorReviews'));
const DoctorVendorEarnings = lazy(() => import('../modules/vendor/pages/DoctorVendorEarnings'));

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
      <Route path="/login" element={<AuthPage />} />

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
        <Route path="medicines/add" element={<VendorMedicineAddWizard />} />
        <Route path="medicines/:id" element={<VendorMedicineDetails />} />
        
        {/* New Flattened Routes */}
        <Route path="devices" element={<VendorProductManagement />} />
        <Route path="orders/*" element={<VendorOrdersManagement />} />
        <Route path="prescriptions" element={<VendorPrescriptionManagement />} />
        <Route path="prescriptions/:id" element={<VendorPrescriptionDetail />} />
        <Route path="inventory/*" element={<VendorStocksManagement />} />
        
        <Route path="service-areas" element={<VendorServiceAreas />} />
        <Route path="promotions" element={<VendorPromotions />} />
        <Route path="customers/*" element={<VendorCustomers />} />
        
        <Route path="revenue/*" element={<VendorEarnings />} />
        <Route path="analytics" element={<VendorAnalytics />} />
        <Route path="reviews" element={<ReviewsRatings />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>

      {/* 5. Lab Vendor Auth & Routes */}
      <Route path="/vendor/lab/login" element={<LabLogin />} />
      <Route path="/vendor/lab/signup" element={<LabSignup />} />
      <Route path="/vendor/lab/forgot-password" element={<VendorForgotPasswordPage />} />

      <Route path="/vendor/lab" element={<LabVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<LabVendorDashboard />} />
        <Route path="orders" element={<Navigate to="/vendor/lab/orders/all" replace />} />
        <Route path="orders/:status" element={<TestOrders />} />
        
        <Route path="collections" element={<Navigate to="/vendor/lab/collections/requests" replace />} />
        <Route path="collections/:tab" element={<HomeCollection />} />
        
        <Route path="tests" element={<Navigate to="/vendor/lab/tests/all" replace />} />
        <Route path="tests/:tab" element={<TestsManagement />} />
        
        <Route path="packages" element={<Navigate to="/vendor/lab/packages/all" replace />} />
        <Route path="packages/:tab" element={<TestPackages />} />
        
        <Route path="reports/upload" element={<UploadReportsPage />} />
        <Route path="reports/history" element={<ReportHistory />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reviews" element={<ReviewsRatings />} />
        <Route path="analytics" element={<LabVendorAnalytics />} />
        <Route path="revenue" element={<Navigate to="../analytics" replace />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="profile/:tab" element={<LabVendorProfile />} />
        <Route path="profile" element={<Navigate to="/vendor/lab/profile/basic" replace />} />
        <Route path="settings" element={<LabVendorProfile defaultTab="settings" />} />
      </Route>

      {/* 6. Doctor Vendor Auth & Routes */}
      <Route path="/vendor/doctor/login" element={<DoctorLogin />} />
      <Route path="/vendor/doctor/signup" element={<DoctorSignup />} />
      <Route path="/vendor/doctor/forgot-password" element={<VendorForgotPasswordPage />} />
      <Route path="/vendor/onboarding-pending" element={<OnboardingPending />} />
      <Route path="/vendor/rejected" element={<RejectedScreen />} />
      <Route path="/vendor/approved" element={<ApprovedScreen />} />
      <Route path="/vendor/verify-otp" element={<VendorVerifyOtpPage />} />

      <Route path="/vendor/doctor" element={<DoctorVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorVendorDashboard />} />
        <Route path="schedule" element={<Navigate to="/vendor/doctor/schedule/availability" replace />} />
        <Route path="schedule/:tab" element={<DoctorVendorSchedule />} />
        
        {/* Appointments Module */}
        <Route path="appointments" element={<Navigate to="/vendor/doctor/appointments/all" replace />} />
        <Route path="appointments/:tab" element={<DoctorVendorAppointments />} />
        
        {/* Patients & Records */}
        <Route path="patients" element={<Navigate to="/vendor/doctor/patients/list" replace />} />
        <Route path="patients/:tab" element={<DoctorVendorPatients />} />
        
        {/* Consultations */}
        <Route path="consultations" element={<Navigate to="/vendor/doctor/consultations/video" replace />} />
        <Route path="consultations/:tab" element={<DoctorVendorConsultations />} />
        
        {/* Prescriptions */}
        <Route path="prescriptions" element={<Navigate to="/vendor/doctor/prescriptions/create" replace />} />
        <Route path="prescriptions/:tab" element={<DoctorVendorPrescriptions />} />
        
        {/* Earnings & Analytics */}
        <Route path="earnings" element={<Navigate to="/vendor/doctor/earnings/revenue" replace />} />
        <Route path="earnings/:tab" element={<DoctorVendorEarnings />} />
        <Route path="analytics" element={<DoctorVendorAnalytics />} />
        <Route path="reviews" element={<DoctorVendorReviews />} />
        
        <Route path="availability" element={<DoctorVendorSchedule />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="profile" element={<DoctorVendorProfile />} />
        <Route path="settings" element={<DoctorVendorProfile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
