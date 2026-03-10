import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import UserDetails from "./admin/UserDetails";
import Users from "./admin/Users";
import Product from "./admin/Product";
import Category from "./admin/Category";
import Orders from "./admin/Orders";
import Messages from "./admin/Messages";
import Vendors from "./admin/Vendors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="profile" element={<UserDetails />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
