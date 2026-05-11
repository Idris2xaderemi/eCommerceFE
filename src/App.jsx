import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from './store/slices/authSlice'

import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/Layout/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductsPage from './pages/ProductsPage'
import ProductDetails from './pages/ProductDetails'
import VendorPage from './pages/VendorPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import UserDashboard from './pages/UserDashboard'

import VendorDashboard from './pages/vendor/VendorDashboard'
import AddProduct from './pages/vendor/AddProduct'
import ProductManagement from './pages/vendor/ProductManagement'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorPayments from './pages/vendor/VendorPayments'
import AdminDashboard from './pages/admin/AdminDashboard'
import VendorsListPage from './pages/VendorsListPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AboutUs from './pages/info/AboutUs';
import Conditions from './pages/info/Conditions';
import OurJournals from './pages/info/OurJournals';
import Stores from './pages/info/Stores.jsx';
import Info from './pages/info/Info';
import FAQ from './pages/info/FAQ';
import Contact from './pages/info/Contact';
import PrivacyPolicy from './pages/info/PrivacyPolicy';
import ReturnsRefunds from './pages/info/ReturnRefunds';
import DeliveryInformation from './pages/info/DeliveryInformation';

import NotFound from './pages/NotFound.jsx'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(getProfile())
  }, [dispatch, isAuthenticated])

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/our-journals" element={<OurJournals />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/info" element={<Info />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/returns-refunds" element={<ReturnsRefunds />} />
          <Route path="/delivery-information" element={<DeliveryInformation />} />

          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/vendor/:id" element={<VendorPage />} />
          <Route path="/vendors" element={<VendorsListPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/dashboard/add-product" element={<ProtectedRoute allowedRoles={['vendor']}><AddProduct /></ProtectedRoute>} />
          <Route path="/vendor/dashboard/products" element={<ProtectedRoute allowedRoles={['vendor']}><ProductManagement /></ProtectedRoute>} />
          <Route path="/vendor/dashboard/orders" element={<ProtectedRoute allowedRoles={['vendor']}><VendorOrders /></ProtectedRoute>} />
          <Route path="/vendor/dashboard/payments" element={<ProtectedRoute allowedRoles={['vendor']}><VendorPayments /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App