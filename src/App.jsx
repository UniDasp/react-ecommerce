import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill main-container py-4">
        <Routes>
          <Route path="/react-ecommerce/" element={<HomePage />} />
          <Route path="/react-ecommerce/login" element={<LoginPage />} />
          <Route path="/react-ecommerce/register" element={<RegisterPage />} />
          <Route path="/react-ecommerce/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/react-ecommerce/products" element={<ProductsPage />} />
          <Route
            path="/react-ecommerce/products/:id"
            element={<ProductDetailPage />}
          />
          <Route path="/react-ecommerce/cart" element={<CartPage />} />
          <Route path="/react-ecommerce/checkout" element={<CheckoutPage />} />
          <Route path="/react-ecommerce/account" element={<AccountPage />} />
          <Route path="/react-ecommerce/cambiar-contrasena" element={<ChangePassword />} />
          <Route path="/cambiar-contrasena" element={<ChangePassword />} />
          <Route path="/react-ecommerce/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/react-ecommerce/mis-pagos" element={<PaymentsPage />} />
          {/* legacy/alternate paths --> redirect to canonical payments route */}
          <Route path="/react-ecommerce/pagos/mis-pagos" element={<Navigate to="/react-ecommerce/mis-pagos" replace />} />
          <Route path="/react-ecommerce/pagos" element={<Navigate to="/react-ecommerce/mis-pagos" replace />} />
          <Route path="/react-ecommerce/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
