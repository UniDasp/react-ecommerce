import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

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
          <Route path="/react-ecommerce/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
